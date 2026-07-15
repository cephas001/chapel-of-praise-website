const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");

// Get ALL counselling sections at once
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("counselling").get();

    // Return an object with section IDs as keys
    const sections = {};
    snapshot.forEach((doc) => {
      sections[doc.id] = doc.data();
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("Error getting counselling sections:", error);
    res.status(500).json({ message: "Failed to fetch counselling sections" });
  }
});

// Get a specific counselling section (e.g., /api/public/counselling/hero)
router.get("/:sectionId", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const docRef = db.collection("counselling").doc(sectionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error(
      `Error getting counselling section ${req.params.sectionId}:`,
      error,
    );
    res.status(500).json({ message: "Failed to fetch counselling section" });
  }
});

module.exports = router;
