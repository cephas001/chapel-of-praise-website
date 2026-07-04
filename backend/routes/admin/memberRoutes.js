// backend/routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const { verifyToken, requireSuperAdmin } = require("../../middleware/auth");

// ==========================================
// PROTECTED ROUTES
// ==========================================
// Apply the token verification middleware to all routes below this line
router.use(verifyToken);

// General Admin Routes
// Used to fetch lists for attendance dropping
router.get("/unit/:unitName", async (req, res) => {
  try {
    const { unitName } = req.params;
    const snapshot = await db
      .collection("members")
      .where("chapelUnit", "==", unitName)
      .get();

    const members = [];
    snapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching unit members:", error);
    res.status(500).json({ error: "Failed to fetch unit members." });
  }
});

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("members").get();
    const members = [];
    snapshot.forEach((doc) => members.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching all members:", error);
    res.status(500).json({ error: "Failed to fetch all members." });
  }
});

// Super Admin Only Routes
// Used specifically for managing the Executive roster
router.post("/executives", requireSuperAdmin, async (req, res) => {
  try {
    const newExecutive = {
      ...req.body,
      memberType: "EXECUTIVE",
      creatorId: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("members").add(newExecutive);

    res.status(201).json({
      message: "Executive successfully created.",
      data: { id: docRef.id, ...newExecutive },
    });
  } catch (error) {
    console.error("Error creating executive:", error);
    res.status(500).json({ error: "Failed to create executive." });
  }
});

router.get("/executives", async (req, res) => {
  try {
    const snapshot = await db
      .collection("members")
      .where("memberType", "==", "EXECUTIVE")
      .get();

    const executives = [];
    snapshot.forEach((doc) => {
      executives.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(executives);
  } catch (error) {
    console.error("Error fetching executives:", error);
    res.status(500).json({ error: "Failed to fetch executives." });
  }
});

module.exports = router;
