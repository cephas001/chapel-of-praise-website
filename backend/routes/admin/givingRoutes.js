const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

// Get all giving sections
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("giving").get();

    const sections = {};
    snapshot.forEach((doc) => {
      sections[doc.id] = doc.data();
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("Error getting giving sections:", error);
    res.status(500).json({ message: "Failed to fetch giving sections" });
  }
});

// Get a specific giving section
router.get("/:sectionId", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const docRef = db.collection("giving").doc(sectionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error(
      `Error getting giving section ${req.params.sectionId}:`,
      error,
    );
    res.status(500).json({ message: "Failed to fetch giving section" });
  }
});

// Reusable function to create or update a specific giving section
const saveGivingSettings = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const settingsData = req.body;

    const docRef = db.collection("giving").doc(sectionId);
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
      `Error updating giving section ${req.params.sectionId}:`,
      error,
    );
    res.status(500).json({ message: "Failed to update giving section" });
  }
};

// Allow both PUT and POST to update specific sections
router.put("/:sectionId", saveGivingSettings);
router.post("/:sectionId", saveGivingSettings);

module.exports = router;
