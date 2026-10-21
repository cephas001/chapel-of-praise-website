const express = require("express");
const router = express.Router();
const { db, admin } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");
const { pickWritableFields } = require("../../utils/payload");
const { encodeCursor, decodeCursor } = require("../../utils/cursor");

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
const EVENT_SEARCH_FIELDS = [
  "service",
  "specialProgram",
  "eventDescription",
  "programDay",
];

const parseBoundedInteger = (value, fallback, min, max) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) return fallback;

  return Math.min(Math.max(parsed, min), max);
};

const parseEventSort = (value) => {
  const [field, direction] = String(value || "date:desc").split(":");

  return {
    field: field === "name" ? "name" : "date",
    direction: direction === "asc" ? "asc" : "desc",
  };
};

const eventLabel = (event) =>
  event.service === "SPECIAL PROGRAM"
    ? event.specialProgram || event.service
    : event.service;

const compareEvents = (sort) => (left, right) => {
  const leftValue =
    sort.field === "name" ? eventLabel(left) : left.eventDate;
  const rightValue =
    sort.field === "name" ? eventLabel(right) : right.eventDate;
  const result = String(leftValue || "").localeCompare(
    String(rightValue || ""),
  );

  return sort.direction === "asc" ? result : -result;
};

const filterEvents = (events, { search, service, time, today }) => {
  const term = search.toLowerCase();

  return events.filter((event) => {
    if (service && service !== "ALL" && event.service !== service) {
      return false;
    }

    if (time === "upcoming" && String(event.eventDate || "") < today) {
      return false;
    }

    if (time === "past" && String(event.eventDate || "") >= today) {
      return false;
    }

    if (!term) return true;

    return EVENT_SEARCH_FIELDS.some((field) =>
      String(event[field] || "")
        .toLowerCase()
        .includes(term),
    );
  });
};

const todayStamp = () => {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
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
    const cursorParam =
      typeof req.query.cursor === "string" ? req.query.cursor.trim() : "";
    const cursor = cursorParam ? decodeCursor(cursorParam) : null;

    if (cursorParam && (!cursor || typeof cursor.id !== "string")) {
      return res.status(400).json({ error: "Invalid pagination cursor." });
    }

    const usesOffset = req.query.offset !== undefined;
    const paginated =
      req.query.limit !== undefined ||
      usesOffset ||
      Boolean(cursorParam) ||
      req.query.paginated === "1";
    const limit = parseBoundedInteger(
      req.query.limit,
      EVENTS_DEFAULT_LIMIT,
      1,
      EVENTS_MAX_LIMIT,
    );
    const offset = parseBoundedInteger(
      req.query.offset,
      0,
      0,
      Number.MAX_SAFE_INTEGER,
    );
    const search = String(req.query.search || "").trim();
    const service = String(req.query.service || "ALL").trim();
    const time = String(req.query.time || "all").trim();
    const sort = parseEventSort(req.query.sort);
    const hasCriteria =
      search.length > 0 ||
      (service && service !== "ALL") ||
      time === "upcoming" ||
      time === "past" ||
      sort.field === "name";

    if (hasCriteria) {
      const snapshot = await db.collection("events").get();
      const results = [];

      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      const filtered = filterEvents(results, {
        search,
        service,
        time,
        today: todayStamp(),
      });
      filtered.sort(compareEvents(sort));

      const total = filtered.length;

      if (!paginated) {
        return res.status(200).json(filtered);
      }

      if (usesOffset) {
        const events = filtered.slice(offset, offset + limit);

        return res.status(200).json({
          events,
          total,
          limit,
          offset,
          hasMore: offset + events.length < total,
        });
      }

      const cursorIndex = cursor
        ? filtered.findIndex((event) => event.id === cursor.id)
        : -1;

      if (cursor && cursorIndex === -1) {
        return res.status(400).json({ error: "Invalid pagination cursor." });
      }

      const startIndex = cursorIndex + 1;
      const events = filtered.slice(startIndex, startIndex + limit);
      const hasMore = startIndex + events.length < total;
      const lastEvent = events[events.length - 1];

      return res.status(200).json({
        events,
        limit,
        hasMore,
        nextCursor:
          hasMore && lastEvent
            ? encodeCursor({ id: lastEvent.id })
            : null,
      });
    }

    if (!paginated) {
      const snapshot = await db
        .collection("events")
        .orderBy("eventDate", sort.direction)
        .get();
      const events = [];
      snapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });

      return res.status(200).json(events);
    }

    if (usesOffset) {
      const query = db
        .collection("events")
        .orderBy("eventDate", sort.direction);

      const [totalSnapshot, snapshot] = await Promise.all([
        db.collection("events").count().get(),
        query.limit(limit).offset(offset).get(),
      ]);

      const events = [];
      snapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });

      const total = totalSnapshot.data().count;

      return res.status(200).json({
        events,
        total,
        limit,
        offset,
        hasMore: offset + events.length < total,
      });
    }

    if (cursor && typeof cursor.eventDate !== "string") {
      return res.status(400).json({ error: "Invalid pagination cursor." });
    }

    let query = db
      .collection("events")
      .orderBy("eventDate", sort.direction)
      .orderBy(admin.firestore.FieldPath.documentId(), sort.direction);

    if (cursor) {
      query = query.startAfter(cursor.eventDate, cursor.id);
    }

    const snapshot = await query.limit(limit + 1).get();
    const pageDocs = snapshot.docs.slice(0, limit);
    const events = pageDocs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const hasMore = snapshot.size > limit;
    const lastDoc = pageDocs[pageDocs.length - 1];

    res.status(200).json({
      events,
      limit,
      hasMore,
      nextCursor:
        hasMore && lastDoc
          ? encodeCursor({
              id: lastDoc.id,
              eventDate: lastDoc.get("eventDate"),
            })
          : null,
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
