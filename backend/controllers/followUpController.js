// backend/controllers/followUpController.js
const { db } = require("../config/firebase");
const admin = require("firebase-admin"); // Required for arrayUnion

// @desc    Get all follow-ups globally, enriched with Event details
// @route   GET /api/follow-ups
exports.getFollowUps = async (req, res) => {
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

    // Sort newest first
    followUps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(followUps);
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    res.status(500).json({ error: "Failed to fetch follow-ups." });
  }
};

// @desc    Create a new follow-up record
// @route   POST /api/follow-ups
exports.createFollowUp = async (req, res) => {
  try {
    const { fullName, category, phoneNumber, eventId, initialNote } = req.body;

    const payload = {
      fullName,
      category: category || "General",
      phoneNumber: phoneNumber || "",
      eventId: eventId || null, // Nullable for standalone records
      status: "Pending",
      notesThread: [],
      creatorId: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If the creator added a note during creation, inject it into the thread
    if (initialNote) {
      payload.notesThread.push({
        text: initialNote,
        authorId: req.user.uid,
        // Assuming your auth middleware attaches the user's name, or we just rely on ID for now
        timestamp: new Date().toISOString(),
      });
    }

    const docRef = await db.collection("followUps").add(payload);
    res.status(201).json({ message: "Follow-up created", id: docRef.id });
  } catch (error) {
    console.error("Error creating follow-up:", error);
    res.status(500).json({ error: "Failed to create follow-up." });
  }
};

// @desc    Add a note to an existing follow-up thread
// @route   POST /api/follow-ups/:id/notes
exports.addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, authorName } = req.body;

    if (!text) return res.status(400).json({ error: "Note text is required." });

    const newNote = {
      text,
      authorId: req.user.uid,
      authorName: authorName || "Executive", // Passed from frontend auth store
      timestamp: new Date().toISOString(),
    };

    // Atomically append the new note to the array without overwriting existing data
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
};

// @desc    Update follow up status (e.g., Pending -> Contacted)
// @route   PATCH /api/follow-ups/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.collection("followUps").doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status." });
  }
};
