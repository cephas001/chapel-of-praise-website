// backend/routes/admin/auth.js
const express = require("express");
const { db, auth } = require("../../config/firebase");
const { verifyToken, requireSuperAdmin } = require("../../middleware/auth");

const router = express.Router();

// --- REGISTER ROUTE (PROTECTED: ONLY SUPER ADMINS CAN ACCESS) ---
router.post("/register", verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role = "admin", type } = req.body;

    if (!name || !email || !password || !type) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // 1. Create the user in Firebase Authentication
    // Firebase automatically checks for duplicate emails and hashes the password safely!
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await auth.setCustomUserClaims(userRecord.uid, { role: role, type: type });

    // 2. Save the extra metadata in Firestore ('users' collection)
    // We use the Firebase Auth UID (userRecord.uid) as the document ID.
    // This perfectly links their Auth account to their database record.
    const userData = {
      name,
      email,
      role,
      type,
      createdAt: new Date().toISOString(),
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: userRecord.uid, ...userData },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Catch the specific Firebase error for duplicate emails
    if (error.code === "auth/email-already-exists") {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }
    res.status(500).json({
      error: error?.errorInfo?.message || "Server error during registration.",
    });
  }
});

// --- LOGIN ROUTE ---
// Note: The frontend logs the user in directly via Firebase.
// This route is now just for the frontend to send its token and fetch its role/type.
router.post("/login", verifyToken, async (req, res) => {
  try {
    // Thanks to your verifyToken middleware, req.user already contains the decoded Firebase token!
    const uid = req.user.uid;

    // Fetch the extra user data (role, type) from the Firestore 'users' collection
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ error: "User profile not found in database." });
    }

    const userData = userDoc.data();

    // We no longer mint our own token, we just return the user data needed for frontend state
    res.status(200).json({
      message: "User data synced successfully",
      user: {
        id: uid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        type: userData.type,
      },
    });
  } catch (error) {
    console.error("Login sync error:", error);
    res.status(500).json({ error: "Server error during login sync." });
  }
});

// --- LIST USERS (PROTECTED: ONLY SUPER ADMINS CAN ACCESS) ---
// Returns a curated list of users with only the fields the frontend needs.
router.get("/users", verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const users = [];
    // Firebase Admin SDK supports pagination via listUsers; we'll fetch up to 1000 at a time.
    let result = await auth.listUsers(1000);
    let allUsers = result.users || [];

    // If there are more pages, iterate through them
    while (result.pageToken) {
      result = await auth.listUsers(1000, result.pageToken);
      allUsers = allUsers.concat(result.users || []);
    }

    // Map and enrich with Firestore metadata (role/type) if available
    const promises = allUsers.map(async (u) => {
      const uid = u.uid;
      const userDoc = await db.collection("users").doc(uid).get();
      const docData = userDoc.exists ? userDoc.data() : {};

      // Prefer Firestore stored role/type, fallback to custom claims, then defaults
      const role =
        docData.role ||
        (u.customClaims && u.customClaims.role) ||
        (u.role ? u.role : "admin");
      const type =
        docData.type ||
        (u.customClaims && u.customClaims.type) ||
        (u.type ? u.type : "website");

      return {
        uid,
        name: docData.name || u.displayName || u.name || "",
        email: u.email || docData.email || "",
        role,
        type,
      };
    });

    const resolved = await Promise.all(promises);
    users.push(...resolved);

    res.status(200).json(users);
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ error: "Server error while listing users." });
  }
});

// --- GET SINGLE USER ---
// Allows a user to fetch their own profile, or a super_admin to fetch any profile.
router.get("/:uid", verifyToken, async (req, res) => {
  try {
    const { uid } = req.params;

    // Security check: Only allow users to fetch their own data unless they are a super admin
    if (req.user.uid !== uid && req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized to access this profile." });
    }

    // 1. Fetch from Firebase Auth
    const userRecord = await auth.getUser(uid);

    // 2. Fetch from Firestore metadata
    const userDoc = await db.collection("users").doc(uid).get();
    const docData = userDoc.exists ? userDoc.data() : {};

    // 3. Consolidate role and type
    const role =
      docData.role ||
      (userRecord.customClaims && userRecord.customClaims.role) ||
      "admin";
    const type =
      docData.type ||
      (userRecord.customClaims && userRecord.customClaims.type) ||
      "website";

    // 4. Return formatted data matching frontend expectations
    res.status(200).json({
      uid: userRecord.uid,
      name: docData.name || userRecord.displayName || "",
      email: userRecord.email,
      email_verified: userRecord.emailVerified,
      role,
      type,
      createdAt: docData.createdAt || userRecord.metadata.creationTime,
      updatedAt: docData.updatedAt || null,
      firebase: {
        sign_in_provider: userRecord.providerData[0]?.providerId || "password",
        identities: userRecord.providerData,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    if (error.code === "auth/user-not-found") {
      return res.status(404).json({ error: "User not found." });
    }
    res
      .status(500)
      .json({ error: "Server error while fetching user details." });
  }
});

// --- UPDATE USER (PROTECTED: ONLY SUPER ADMINS CAN ACCESS) ---
// Updates displayName/email in Firebase Auth, custom claims, and Firestore metadata.
router.put("/update/:uid", verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, email, role, type } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // 1. Update Firebase Auth user (displayName and email if provided)
    const updatePayload = {};
    if (typeof name === "string") updatePayload.displayName = name;
    if (typeof email === "string") updatePayload.email = email;

    if (Object.keys(updatePayload).length > 0) {
      await auth.updateUser(uid, updatePayload);
    }

    // 2. Update custom claims (role/type) if provided
    const claimsToSet = {};
    if (typeof role === "string") claimsToSet.role = role;
    if (typeof type === "string") claimsToSet.type = type;

    if (Object.keys(claimsToSet).length > 0) {
      await auth.setCustomUserClaims(uid, claimsToSet);
    }

    // 3. Update or create Firestore user doc
    const userDocRef = db.collection("users").doc(uid);
    const userDoc = await userDocRef.get();

    const firestoreUpdate = {};
    if (typeof name === "string") firestoreUpdate.name = name;
    if (typeof email === "string") firestoreUpdate.email = email;
    if (typeof role === "string") firestoreUpdate.role = role;
    if (typeof type === "string") firestoreUpdate.type = type;
    firestoreUpdate.updatedAt = new Date().toISOString();

    if (userDoc.exists) {
      await userDocRef.update(firestoreUpdate);
    } else {
      // create with minimal required fields
      await userDocRef.set({
        ...firestoreUpdate,
        createdAt: new Date().toISOString(),
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: { id: uid, ...firestoreUpdate },
    });
  } catch (error) {
    console.error("Update user error:", error);
    // Handle common Firebase errors (e.g., email already exists)
    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({ error: "Email already in use." });
    }
    res.status(500).json({ error: "Server error during user update." });
  }
});

// --- DELETE USER (PROTECTED: ONLY SUPER ADMINS CAN ACCESS) ---
// Deletes the user from Firebase Auth and removes their Firestore profile.
router.delete("/:uid", verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // 1. Delete from Firebase Auth
    await auth.deleteUser(uid);

    // 2. Delete Firestore user doc (if exists)
    await db.collection("users").doc(uid).delete();

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Server error during user deletion." });
  }
});

// --- UPGRADE ROUTE (PROTECTED: ONLY SUPER ADMINS CAN ACCESS) ---
router.post(
  "/upgrade/:uid",
  verifyToken,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { uid } = req.params;

      if (!uid) {
        return res.status(400).json({ error: "User ID is required." });
      }

      // 1. Update Firebase custom claims
      await auth.setCustomUserClaims(uid, { role: "super_admin" });

      // 2. Update Firestore record
      const userDocRef = db.collection("users").doc(uid);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found in database." });
      }

      await userDocRef.update({
        role: "super_admin",
        upgradedAt: new Date().toISOString(),
      });

      res.status(200).json({
        message: "User upgraded to super_admin successfully",
        user: { id: uid, ...userDoc.data(), role: "super_admin" },
      });
    } catch (error) {
      console.error("Upgrade error:", error);
      res.status(500).json({
        error: error?.errorInfo?.message || "Server error during upgrade.",
      });
    }
  },
);

module.exports = router;
