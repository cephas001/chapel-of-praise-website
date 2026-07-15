const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");

// Get ALL about sections at once
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("about").get();

    // Return an object with section IDs as keys
    const sections = {};
    snapshot.forEach((doc) => {
      sections[doc.id] = doc.data();
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("Error getting about sections:", error);
    res.status(500).json({ message: "Failed to fetch about sections" });
  }
});

// Get a specific about section (e.g., /api/public/about/team)
router.get("/:sectionId", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const docRef = db.collection("about").doc(sectionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error(
      `Error getting about section ${req.params.sectionId}:`,
      error,
    );
    res.status(500).json({ message: "Failed to fetch about section" });
  }
});

module.exports = router;
