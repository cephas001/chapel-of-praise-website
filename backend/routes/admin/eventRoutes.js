const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");
const { pickWritableFields } = require("../../utils/payload");

// Client-writable fields only; server-managed fields (creatorId, timestamps)
// can never be set or overwritten by the request body.
const EVENT_WRITABLE_FIELDS = [
  "eventDate",
  "service",
  "specialProgram",
  "programDay",
  "startTime",
  "endTime",
  "eventDescription",
];

const EVENTS_DEFAULT_LIMIT = 50;
const EVENTS_MAX_LIMIT = 200;

const parseBoundedInteger = (value, fallback, min, max) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) return fallback;

  return Math.min(Math.max(parsed, min), max);
};

// Apply verifyToken middleware to all event routes
router.use(verifyToken);
router.use(requireStaticTypeAccess(["executive"]));
// Only allow users with type 'executive' or 'all' to access these routes

// Create Event
router.post("/", async (req, res) => {
  try {
    const eventData = pickWritableFields(req.body, EVENT_WRITABLE_FIELDS);

    if (!eventData.eventDate) {
      return res.status(400).json({ error: "Event date is required." });
    }

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
    const paginated =
      req.query.limit !== undefined ||
      req.query.offset !== undefined ||
      req.query.paginated === "1";

    const query = db.collection("events").orderBy("eventDate", "desc");

    if (!paginated) {
      const snapshot = await query.get();
      const events = [];
      snapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });

      return res.status(200).json(events);
    }

    const limit = parseBoundedInteger(
      req.query.limit,
      EVENTS_DEFAULT_LIMIT,
      1,
      EVENTS_MAX_LIMIT,
    );
    const offset = parseBoundedInteger(req.query.offset, 0, 0, Number.MAX_SAFE_INTEGER);

    const [totalSnapshot, snapshot] = await Promise.all([
      db.collection("events").count().get(),
      query.limit(limit).offset(offset).get(),
    ]);

    const events = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });

    const total = totalSnapshot.data().count;

    res.status(200).json({
      events,
      total,
      limit,
      offset,
      hasMore: offset + events.length < total,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Update Event
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = pickWritableFields(req.body, EVENT_WRITABLE_FIELDS);

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
