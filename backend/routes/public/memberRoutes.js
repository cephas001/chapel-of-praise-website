// backend/routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");

// ==========================================
// PUBLIC ROUTES
// ==========================================
// Used by the main frontend website (chapelpraise.com)
router.post("/register-worker", async (req, res) => {
  try {
    const { passkey, ...memberData } = req.body;

    if (!passkey || !memberData.chapelUnit) {
      return res
        .status(400)
        .json({ error: "Chapel unit and passkey are required." });
    }

    const passkeyDoc = await db
      .collection("unitPasskeys")
      .doc(memberData.chapelUnit)
      .get();

    if (!passkeyDoc.exists || passkeyDoc.data().key !== passkey) {
      return res
        .status(403)
        .json({ error: "Invalid passkey for the selected unit." });
    }

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
});

module.exports = router;
