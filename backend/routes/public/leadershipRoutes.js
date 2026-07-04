const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");

router.get("/", async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("leadership");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting leadership settings:", error);
    res.status(500).json({ message: "Failed to fetch leadership settings" });
  }
});

module.exports = router;
