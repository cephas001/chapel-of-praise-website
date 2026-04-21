// backend/controllers/eventController.js
const { db } = require("../config/firebase");

// @desc    Create a new event
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;

    // Append server-side data
    const newEvent = {
      ...eventData,
      creatorId: req.user.uid, // From the auth middleware
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
};

// @desc    Get all events
// @route   GET /api/events
exports.getEvents = async (req, res) => {
  try {
    // Order by eventDate descending (newest first)
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
};

// @desc    Update an event
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res) => {
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
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
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
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
exports.getEventById = async (req, res) => {
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
};
