const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const { formSubmissionLimiter } = require("../../middleware/rateLimiters");
const {
  cleanString,
  isValidEmail,
  isSpamSubmission,
} = require("../../utils/formValidation");

// Submit a message from the public contact form
router.post("/submit", formSubmissionLimiter, async (req, res) => {
  try {
    if (isSpamSubmission(req.body)) {
      return res.status(201).json({ message: "Message received." });
    }

    const firstName = cleanString(req.body?.firstName, 100);
    const lastName = cleanString(req.body?.lastName, 100);
    const email = cleanString(req.body?.email, 254).toLowerCase();
    const message = cleanString(req.body?.message, 5000);

    if (!firstName || !lastName || !email || !message) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields." });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address." });
    }

    const docRef = await db.collection("contactMessages").add({
      firstName,
      lastName,
      email,
      message,
      status: "NEW",
      source: "contact-page",
      createdAt: new Date().toISOString(),
    });

    res
      .status(201)
      .json({ message: "Message received.", id: docRef.id });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

// Get ALL contact sections at once
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("contact").get();

    // Return an object with section IDs as keys
    const sections = {};
    snapshot.forEach((doc) => {
      sections[doc.id] = doc.data();
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("Error getting contact sections:", error);
    res.status(500).json({ message: "Failed to fetch contact sections" });
  }
});

// Get a specific contact section (e.g., /api/public/contact/form)
router.get("/:sectionId", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const docRef = db.collection("contact").doc(sectionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error(
      `Error getting contact section ${req.params.sectionId}:`,
      error,
    );
    res.status(500).json({ message: "Failed to fetch contact section" });
  }
});

module.exports = router;
