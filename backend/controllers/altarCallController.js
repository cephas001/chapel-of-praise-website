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
