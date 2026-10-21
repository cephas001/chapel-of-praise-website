// backend/routes/admin/auth.js
const crypto = require("crypto");
const express = require("express");
const { db, auth, admin } = require("../../config/firebase");
const { verifyToken, requireSuperAdmin } = require("../../middleware/auth");
const { loginLimiter } = require("../../middleware/rateLimiters");
const { setUserClaims } = require("../../utils/userClaims");

const router = express.Router();

const VALID_USER_TYPES = ["website", "executive", "all"];

const generateTemporaryPassword = () =>
  crypto.randomBytes(9).toString("base64url");

// --- REGISTER ROUTE (PROTECTED: ONLY SUPER ADMINS CAN ACCESS) ---
router.post("/register", verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role = "admin", type } = req.body;

    if (!name || !email || !type) {
      return res
        .status(400)
        .json({ error: "Name, email and type are required." });
    }

    if (!VALID_USER_TYPES.includes(type)) {
      return res
        .status(400)
        .json({ error: `Type must be one of: ${VALID_USER_TYPES.join(", ")}.` });
    }

    const resolvedRole = role === "super_admin" ? "super_admin" : "admin";

    // The register page lets super admins choose a password. The users page
    // omits it, so generate a secure temporary password and return it once
    // for the admin to hand over; users can change it via "Forgot password".
    const temporaryPassword = password || generateTemporaryPassword();

    // 1. Create the user in Firebase Authentication
    // Firebase automatically checks for duplicate emails and hashes the password safely!
    const userRecord = await auth.createUser({
      email,
      password: temporaryPassword,
      displayName: name,
    });

    await setUserClaims(userRecord.uid, {
      role: resolvedRole,
      type,
    });

    // 2. Save the extra metadata in Firestore ('users' collection)
    // We use the Firebase Auth UID (userRecord.uid) as the document ID.
    // This perfectly links their Auth account to their database record.
    const userData = {
      name,
      email,
      role: resolvedRole,
      type,
      createdAt: new Date().toISOString(),
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: userRecord.uid, ...userData },
      ...(password ? {} : { temporaryPassword }),
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
router.post("/login", loginLimiter, verifyToken, async (req, res) => {
  try {
    // Role/type are read from the verified token's custom claims, so login
    // no longer needs an extra Firestore lookup.
    const { uid, name, email, role, type } = req.user;

    res.status(200).json({
      message: "User data synced successfully",
      user: {
        id: uid,
        name: name || "",
        email: email || "",
        role: role || null,
        type: type || null,
      },
    });
  } catch (error) {
    console.error("Login sync error:", error);
    res.status(500).json({ error: "Server error during login sync." });
  }
});

// --- LIST USERS (PROTECTED: ONLY SUPER ADMINS CAN ACCESS) ---
// Paginated straight from the Firestore `users` collection (the source of
// truth for role/type), replacing the old listUsers + per-user read fan-out.
const USERS_DEFAULT_PAGE_SIZE = 50;
const USERS_MAX_PAGE_SIZE = 200;

router.get("/users", verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const requestedLimit = parseInt(req.query.limit, 10);
    const pageSize = Math.min(
      Math.max(
        Number.isFinite(requestedLimit)
          ? requestedLimit
          : USERS_DEFAULT_PAGE_SIZE,
        1,
      ),
      USERS_MAX_PAGE_SIZE,
    );

    const { cursor } = req.query;

    // Ordered by document ID (always present) so cursors stay stable even
    // for legacy docs that predate any given data field.
    let query = db
      .collection("users")
      .orderBy(admin.firestore.FieldPath.documentId())
      .limit(pageSize + 1);

    if (cursor) {
      query = query.startAfter(cursor);
    }

    const snapshot = await query.get();
    const hasMore = snapshot.size > pageSize;
    const pageDocs = snapshot.docs.slice(0, pageSize);

    const users = pageDocs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        name: data.name || "",
        email: data.email || "",
        role: data.role || "admin",
        type: data.type || "website",
      };
    });

    res.status(200).json({
      users,
      nextCursor: hasMore ? pageDocs[pageDocs.length - 1].id : null,
      hasMore,
    });
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

// --- UPDATE OWN PROFILE (ANY AUTHENTICATED USER) ---
// Self-service route: users may only update their own display name.
// Email, role, and type changes stay exclusive to super admins via /update/:uid.
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "A valid name is required." });
    }

    const trimmedName = name.trim();

    // 1. Update Firebase Auth displayName
    await auth.updateUser(uid, { displayName: trimmedName });

    // 2. Update or create the Firestore profile
    const userDocRef = db.collection("users").doc(uid);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      await userDocRef.update({
        name: trimmedName,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await userDocRef.set({
        name: trimmedName,
        email: req.user.email || "",
        role: req.user.role || "admin",
        type: req.user.type || "website",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: { id: uid, name: trimmedName },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server error during profile update." });
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

    if (
      typeof role === "string" &&
      !["admin", "super_admin"].includes(role)
    ) {
      return res.status(400).json({ error: "Invalid user role." });
    }

    if (typeof type === "string" && !VALID_USER_TYPES.includes(type)) {
      return res
        .status(400)
        .json({ error: `Type must be one of: ${VALID_USER_TYPES.join(", ")}.` });
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
      // Merge with existing claims so partial updates (e.g. only type)
      // don't wipe the user's other custom claims.
      await setUserClaims(uid, claimsToSet);
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

      // 1. Verify the Firestore record exists before mutating anything
      const userDocRef = db.collection("users").doc(uid);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found in database." });
      }

      // 2. Merge with existing claims so upgrading doesn't drop custom fields (e.g. type)
      await setUserClaims(uid, { role: "super_admin" });

      // 3. Update Firestore record (role only; type is preserved)
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
