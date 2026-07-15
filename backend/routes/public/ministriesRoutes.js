const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");

// Get ALL ministries sections at once
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("ministries").get();

    // Return an object with section IDs as keys
    const sections = {};
    snapshot.forEach((doc) => {
      sections[doc.id] = doc.data();
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("Error getting ministries sections:", error);
    res.status(500).json({ message: "Failed to fetch ministries sections" });
  }
});

// Get a specific ministries section
router.get("/:sectionId", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const docRef = db.collection("ministries").doc(sectionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error(
      `Error getting ministries section ${req.params.sectionId}:`,
      error,
    );
    res.status(500).json({ message: "Failed to fetch ministries section" });
  }
});

module.exports = router;
