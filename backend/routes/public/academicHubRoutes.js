const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");

// The Academic Hub page is powered by the Beyond Sunday homepage section so
// the homepage card and the public page always stay in sync.
router.get("/", async (req, res) => {
  try {
    const docRef = db.collection("homepage").doc("beyondSundaySection");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting academic hub content:", error);
    res.status(500).json({ message: "Failed to fetch academic hub content" });
  }
});

module.exports = router;
