const { db } = require("../config/firebase");

// ==========================================
// ALTAR CALLS (AGGREGATES)
// ==========================================

// @desc    Get all altar call aggregates for an event
// @route   GET /api/altar-calls/event/:eventId
exports.getAltarCallsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const snapshot = await db
      .collection("altarCalls")
      .where("eventId", "==", eventId)
      .get();

    const calls = [];
    snapshot.forEach((doc) => calls.push({ id: doc.id, ...doc.data() }));

    res.status(200).json(calls);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch altar calls" });
  }
};

// @desc    Get all altar calls globally, enriched with Event details
// @route   GET /api/altar-calls/global
exports.getGlobalAltarCalls = async (req, res) => {
  try {
    // 1. Fetch all altar call categories recorded
    const callsSnapshot = await db.collection("altarCalls").get();

    // 2. Fetch all events for the join
    const eventsSnapshot = await db.collection("events").get();

    const eventsMap = {};
    eventsSnapshot.forEach((doc) => {
      eventsMap[doc.id] = doc.data();
    });

    const altarCalls = [];
    callsSnapshot.forEach((doc) => {
      const data = doc.data();
      altarCalls.push({
        id: doc.id,
        ...data,
        eventDetails: eventsMap[data.eventId] || null,
      });
    });

    // Sort descending by Event Date
    altarCalls.sort((a, b) => {
      const dateA = a.eventDetails
        ? new Date(a.eventDetails.eventDate)
        : new Date(0);
      const dateB = b.eventDetails
        ? new Date(b.eventDetails.eventDate)
        : new Date(0);
      return dateB - dateA;
    });

    res.status(200).json(altarCalls);
  } catch (error) {
    console.error("Error fetching global altar calls:", error);
    res.status(500).json({ error: "Failed to fetch global altar calls." });
  }
};

// @desc    Record a new altar call aggregate (e.g. Salvation - 25)
// @route   POST /api/altar-calls
exports.createAltarCall = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      creatorId: req.user.uid,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("altarCalls").add(payload);
    res.status(201).json({
      message: "Altar call recorded",
      data: { id: docRef.id, ...payload },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to record altar call" });
  }
};

// ==========================================
// ALTAR CALL RESPONSES (INDIVIDUALS)
// ==========================================

// @desc    Get individual responses for a specific altar call aggregate
// @route   GET /api/altar-calls/responses/:altarCallId
exports.getResponsesByAltarCall = async (req, res) => {
  try {
    const { altarCallId } = req.params;
    const snapshot = await db
      .collection("altarCallResponses")
      .where("altarCallId", "==", altarCallId)
      .get();

    const responses = [];
    snapshot.forEach((doc) => responses.push({ id: doc.id, ...doc.data() }));

    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch responses" });
  }
};

// @desc    Record an individual response details
// @route   POST /api/altar-calls/responses
exports.createResponse = async (req, res) => {
  try {
    const payload = {
      ...req.body, // Contains eventId, altarCallId, fullName, hostel, etc.
      followUpStatus: "NOT DONE", // Default status
      creatorId: req.user.uid,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("altarCallResponses").add(payload);
    res.status(201).json({
      message: "Response recorded",
      data: { id: docRef.id, ...payload },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to record response" });
  }
};
