const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

// Get all prayer sections
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("prayer").get();

    const sections = {};
    snapshot.forEach((doc) => {
      sections[doc.id] = doc.data();
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("Error getting prayer sections:", error);
    res.status(500).json({ message: "Failed to fetch prayer sections" });
  }
});

// Get a specific prayer section
router.get("/:sectionId", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const docRef = db.collection("prayer").doc(sectionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error(
      `Error getting prayer section ${req.params.sectionId}:`,
      error,
    );
    res.status(500).json({ message: "Failed to fetch prayer section" });
  }
});

// Reusable function to create or update a specific prayer section
const savePrayerSettings = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const settingsData = req.body;

    const docRef = db.collection("prayer").doc(sectionId);
    const doc = await docRef.get();

    const dataToSave = {
      ...settingsData,
      updatedAt: new Date().toISOString(),
    };

    if (req.user && req.user.uid) {
      dataToSave.updatedBy = req.user.uid;
    }

    if (!doc.exists) {
      dataToSave.createdAt = new Date().toISOString();
      await docRef.set(dataToSave);
    } else {
      await docRef.update(dataToSave);
    }

    res.status(200).json(dataToSave);
  } catch (error) {
    console.error(
      `Error updating prayer section ${req.params.sectionId}:`,
      error,
    );
    res.status(500).json({ message: "Failed to update prayer section" });
  }
};

// Allow both PUT and POST to update specific sections
router.put("/:sectionId", savePrayerSettings);
router.post("/:sectionId", savePrayerSettings);

module.exports = router;
