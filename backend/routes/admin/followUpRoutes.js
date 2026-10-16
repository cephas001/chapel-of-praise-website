// backend/routes/followUpRoutes.js
const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const admin = require("firebase-admin");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

router.use(verifyToken);
router.use(requireStaticTypeAccess(["executive"]));

// Get all follow-ups
router.get("/", async (req, res) => {
  try {
    const followUpsSnapshot = await db.collection("followUps").get();
    const eventsSnapshot = await db.collection("events").get();

    const eventsMap = {};
    eventsSnapshot.forEach((doc) => {
      eventsMap[doc.id] = doc.data();
    });

    const followUps = [];
    followUpsSnapshot.forEach((doc) => {
      const data = doc.data();
      followUps.push({
        id: doc.id,
        ...data,
        eventDetails: data.eventId ? eventsMap[data.eventId] : null,
      });
    });

    followUps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(followUps);
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    res.status(500).json({ error: "Failed to fetch follow-ups." });
  }
});

// Create a new follow-up
router.post("/", async (req, res) => {
  try {
    const { fullName, category, phoneNumber, eventId, initialNote } = req.body;

    const payload = {
      fullName,
      category: category || "General",
      phoneNumber: phoneNumber || "",
      eventId: eventId || null,
      status: "Pending",
      notesThread: [],
      creatorId: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (initialNote) {
      payload.notesThread.push({
        text: initialNote,
        authorId: req.user.uid,
        timestamp: new Date().toISOString(),
      });
    }

    const docRef = await db.collection("followUps").add(payload);
    res.status(201).json({ message: "Follow-up created", id: docRef.id });
  } catch (error) {
    console.error("Error creating follow-up:", error);
    res.status(500).json({ error: "Failed to create follow-up." });
  }
});

// Add a note to a follow-up
router.post("/:id/notes", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Note text is required." });

    const newNote = {
      text,
      authorId: req.user.uid,
      authorName: req.user.name || "Executive",
      timestamp: new Date().toISOString(),
    };

    await db
      .collection("followUps")
      .doc(id)
      .update({
        notesThread: admin.firestore.FieldValue.arrayUnion(newNote),
        updatedAt: new Date().toISOString(),
      });

    res.status(200).json({ message: "Note added successfully", note: newNote });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Failed to add note to thread." });
  }
});

// Update follow-up status
const VALID_STATUSES = ["Pending", "Contacted", "Completed"];

router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Use Pending, Contacted or Completed." });
    }

    const docRef = db.collection("followUps").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Follow-up not found." });
    }

    await docRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status." });
  }
});

module.exports = router;
