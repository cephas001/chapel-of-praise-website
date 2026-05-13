// backend/controllers/memberController.js
const { db } = require("../config/firebase");

// ==========================================
// PUBLIC FRONTEND: WORKER REGISTRATION
// ==========================================

// @desc    Register a new chapel worker using a unit passkey
// @route   POST /api/members/register-worker
// @access  Public
exports.registerWorker = async (req, res) => {
  try {
    const { passkey, ...memberData } = req.body;

    if (!passkey || !memberData.chapelUnit) {
      return res
        .status(400)
        .json({ error: "Chapel unit and passkey are required." });
    }

    // 1. Verify the Passkey
    // Assuming you have a 'unitPasskeys' collection where the document ID is the unit name
    // e.g., db.collection("unitPasskeys").doc("Choir")
    const passkeyDoc = await db
      .collection("unitPasskeys")
      .doc(memberData.chapelUnit)
      .get();

    if (!passkeyDoc.exists || passkeyDoc.data().key !== passkey) {
      return res
        .status(403)
        .json({ error: "Invalid passkey for the selected unit." });
    }

    // 2. Save the Worker
    const newWorker = {
      ...memberData,
      memberType: "WORKER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("members").add(newWorker);

    res.status(201).json({
      message: "Worker successfully registered.",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error registering worker:", error);
    res.status(500).json({ error: "Failed to register worker." });
  }
};

// ==========================================
// ADMIN FRONTEND: EXECUTIVE MANAGEMENT
// ==========================================

// @desc    Register a new executive (Bypasses passkey)
// @route   POST /api/members/executives
// @access  Private (Super Admin)
exports.createExecutive = async (req, res) => {
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
};

// @desc    Get all executives
// @route   GET /api/members/executives
// @access  Private (Admin/Super Admin)
exports.getExecutives = async (req, res) => {
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
};

// ==========================================
// SHARED QUERIES (Used for Attendance later)
// ==========================================

// @desc    Get all members of a specific unit (Includes both Workers and Executives)
// @route   GET /api/members/unit/:unitName
// @access  Private (Admin/Super Admin)
exports.getMembersByUnit = async (req, res) => {
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
};
