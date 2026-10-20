const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const { formSubmissionLimiter } = require("../../middleware/rateLimiters");
const {
  cleanString,
  isValidEmail,
  isSpamSubmission,
} = require("../../utils/formValidation");

const CONTACT_METHODS = new Set(["phone", "email", "text"]);
const COUNSELLING_AREAS = new Set([
  "marriage",
  "premarital",
  "spiritual",
  "grief",
  "addiction",
  "general",
]);

// Submit a counselling request from the public form
router.post("/submit", formSubmissionLimiter, async (req, res) => {
  try {
    if (isSpamSubmission(req.body)) {
      return res.status(201).json({ message: "Request received." });
    }

    const firstName = cleanString(req.body?.firstName, 100);
    const lastName = cleanString(req.body?.lastName, 100);
    const email = cleanString(req.body?.email, 254).toLowerCase();
    const phone = cleanString(req.body?.phone, 32);
    const preferredContactMethod = cleanString(
      req.body?.preferredContactMethod,
      20,
    );
    const counsellingArea = cleanString(req.body?.counsellingArea, 40);
    const details = cleanString(req.body?.details, 5000);

    if (!firstName || !lastName || !email || !phone) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields." });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address." });
    }

    if (preferredContactMethod && !CONTACT_METHODS.has(preferredContactMethod)) {
      return res
        .status(400)
        .json({ error: "Please choose a valid contact method." });
    }

    if (counsellingArea && !COUNSELLING_AREAS.has(counsellingArea)) {
      return res
        .status(400)
        .json({ error: "Please choose a valid counselling area." });
    }

    const docRef = await db.collection("counsellingRequests").add({
      firstName,
      lastName,
      email,
      phone,
      preferredContactMethod,
      counsellingArea,
      details,
      status: "NEW",
      source: "counselling-page",
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: "Counselling request received.",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error saving counselling request:", error);
    res.status(500).json({ error: "Failed to submit counselling request." });
  }
});

// Get ALL counselling sections at once
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("counselling").get();

    // Return an object with section IDs as keys
    const sections = {};
    snapshot.forEach((doc) => {
      sections[doc.id] = doc.data();
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("Error getting counselling sections:", error);
    res.status(500).json({ message: "Failed to fetch counselling sections" });
  }
});

// Get a specific counselling section (e.g., /api/public/counselling/hero)
router.get("/:sectionId", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const docRef = db.collection("counselling").doc(sectionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error(
      `Error getting counselling section ${req.params.sectionId}:`,
      error,
    );
    res.status(500).json({ message: "Failed to fetch counselling section" });
  }
});

module.exports = router;
