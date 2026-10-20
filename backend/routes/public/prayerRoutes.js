const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const { formSubmissionLimiter } = require("../../middleware/rateLimiters");
const {
  cleanString,
  isValidEmail,
  isSpamSubmission,
} = require("../../utils/formValidation");

// Submit a prayer request from the public form
router.post("/submit", formSubmissionLimiter, async (req, res) => {
  try {
    if (isSpamSubmission(req.body)) {
      return res.status(201).json({ message: "Request received." });
    }

    const fullName = cleanString(req.body?.fullName, 150);
    const email = cleanString(req.body?.email, 254).toLowerCase();
    const request = cleanString(req.body?.request, 5000);
    const confidential = req.body?.confidential === true;

    if (!fullName || !request) {
      return res
        .status(400)
        .json({ error: "Please enter your name and prayer request." });
    }

    if (email && !isValidEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address." });
    }

    const docRef = await db.collection("prayerRequests").add({
      fullName,
      email,
      request,
      confidential,
      status: "NEW",
      source: "prayer-page",
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: "Prayer request received.",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error saving prayer request:", error);
    res.status(500).json({ error: "Failed to submit prayer request." });
  }
});

// Get ALL prayer sections at once
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("prayer").get();

    // Return an object with section IDs as keys
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

module.exports = router;
