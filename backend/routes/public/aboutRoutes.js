const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");

router.get("/", async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("about");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting about settings:", error);
    res.status(500).json({ message: "Failed to fetch about settings" });
  }
});

module.exports = router;
