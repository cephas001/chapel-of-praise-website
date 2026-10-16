// backend/middleware/auth.js
const { admin, db } = require("../config/firebase");

// 1. Basic Token Verification (Are they logged in?)
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if the header exists and is formatted correctly
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    // 2. Verify the token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // 3. Custom claims only refresh when the ID token rotates (~1h), so a
    // demoted admin would keep their old role/type until then. The Firestore
    // profile is the source of truth: prefer it so role/type changes take
    // effect on the very next request.
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();

    if (userDoc.exists) {
      const { role, type, name } = userDoc.data();
      req.user = {
        ...decodedToken,
        role: role || decodedToken.role,
        type: type || decodedToken.type,
        name: name || decodedToken.name,
      };
    } else {
      req.user = decodedToken;
    }

    next();
  } catch (error) {
    // 4. Log the actual error for your own debugging
    console.error("Firebase Token Verification Error:", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

// 2. Strict Super Admin Check (For registering new users)
const requireSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === "super_admin") {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Only Super Admins can perform this action." });
};

// 3. Static Type Check (Pass the type directly into the middleware)
const requireStaticTypeAccess = (requiredTypes) => {
  // Normalize to array of strings
  const allowed = Array.isArray(requiredTypes)
    ? requiredTypes
    : [requiredTypes];

  return (req, res, next) => {
    const user = req.user;

    if (user.role === "super_admin") return next();

    if (user.role === "admin") {
      // Allow if user's type matches any required type or is "all"
      const hasAccess = allowed.some(
        (t) => user.type === t || user.type === "all",
      );

      if (hasAccess) return next();
    }

    return res.status(403).json({
      error: `You do not have permission to manage ${allowed.join(
        ", ",
      )} operations.`,
    });
  };
};

module.exports = {
  verifyToken,
  requireSuperAdmin,
  requireStaticTypeAccess,
};
