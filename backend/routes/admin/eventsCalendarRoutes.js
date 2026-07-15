const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

// Get all events-calendar sections
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("events-calendar").get();

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

// Create or update a specific events-calendar section
router.put("/:sectionId", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const settingsData = req.body;
    const docRef = db.collection("events-calendar").doc(sectionId);
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
      `Error updating events calendar section ${req.params.sectionId}:`,
      error,
    );
    res
      .status(500)
      .json({ message: "Failed to update events calendar section" });
  }
});

// Allow POST to behave the same as PUT for a specific section
router.post("/:sectionId", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const settingsData = req.body;
    const docRef = db.collection("events-calendar").doc(sectionId);
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
      `Error updating events calendar section ${req.params.sectionId}:`,
      error,
    );
    res
      .status(500)
      .json({ message: "Failed to update events calendar section" });
  }
});

module.exports = router;
