const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");

router.get("/", async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("counseling");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting counseling settings:", error);
    res.status(500).json({ message: "Failed to fetch counseling settings" });
  }
});

module.exports = router;
