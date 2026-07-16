const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

// Apply verifyToken middleware to all event routes
router.use(verifyToken);
router.use(requireStaticTypeAccess(["executive"]));
// Only allow users with type 'executive' or 'all' to access these routes

// Create Event
router.post("/", async (req, res) => {
  try {
    const eventData = req.body;

    const newEvent = {
      ...eventData,
      creatorId: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("events").add(newEvent);

    res.status(201).json({
      message: "Event created successfully",
      event: { id: docRef.id, ...newEvent },
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Get All Events
router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection("events")
      .orderBy("eventDate", "desc")
      .get();

    const events = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Update Event
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    updateData.updatedAt = new Date().toISOString();

    const eventRef = db.collection("events").doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    await eventRef.update(updateData);

    res.status(200).json({
      message: "Event updated successfully",
      event: { id, ...doc.data(), ...updateData },
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete Event
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const eventRef = db.collection("events").doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    await eventRef.delete();

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Get Event by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eventRef = db.collection("events").doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event details" });
  }
});

module.exports = router;
