const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

// Get prayer settings
router.get("/", async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("prayer");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting prayer settings:", error);
    res.status(500).json({ message: "Failed to fetch prayer settings" });
  }
});

// Create or update prayer settings
router.put("/", async (req, res) => {
  try {
    const settingsData = req.body;
    const docRef = db.collection("settings").doc("prayer");
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
    console.error("Error updating prayer settings:", error);
    res.status(500).json({ message: "Failed to update prayer settings" });
  }
});

// Allow POST to behave the same as PUT
router.post("/", async (req, res) => {
  try {
    const settingsData = req.body;
    const docRef = db.collection("settings").doc("prayer");
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
    console.error("Error updating prayer settings:", error);
    res.status(500).json({ message: "Failed to update prayer settings" });
  }
});

module.exports = router;
