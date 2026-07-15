const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");

// Get ALL events-calendar sections at once
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("events-calendar").get();

    // Return an object with section IDs as keys for easy frontend mapping
    const sections = {};
    snapshot.forEach((doc) => {
      sections[doc.id] = doc.data();
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("Error getting events calendar sections:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch events calendar sections" });
  }
});

// Get a specific events-calendar section
router.get("/:sectionId", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const docRef = db.collection("events-calendar").doc(sectionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error(
      `Error getting events calendar section ${req.params.sectionId}:`,
      error,
    );
    res
      .status(500)
      .json({ message: "Failed to fetch events calendar section" });
  }
});

module.exports = router;
