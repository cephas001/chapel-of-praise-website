const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");
const {
  pickWritableFields,
  toNonNegativeInt,
} = require("../../utils/payload");

// Client-writable fields only; server-managed fields (creatorId, timestamps,
// followUpStatus) can never be set or overwritten by the request body.
const ALTAR_CALL_WRITABLE_FIELDS = ["eventId", "callType", "additionalComments"];

const ALTAR_CALL_RESPONSE_WRITABLE_FIELDS = [
  "eventId",
  "altarCallId",
  "fullName",
  "gender",
  "phoneNumber",
  "hostel",
  "roomNumber",
  "assignedTo",
  "notes",
];

router.use(verifyToken);
router.use(requireStaticTypeAccess(["executive"]));

// Aggregate Routes
router.get("/event/:eventId", async (req, res) => {
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
});
router.post("/", async (req, res) => {
  try {
    const altarCallData = pickWritableFields(
      req.body,
      ALTAR_CALL_WRITABLE_FIELDS,
    );

    if (!altarCallData.eventId) {
      return res.status(400).json({ error: "Event ID is required." });
    }

    const payload = {
      ...altarCallData,
      totalResponders: toNonNegativeInt(req.body.totalResponders),
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
});

// Individual Response Routes
router.get("/responses/:altarCallId", async (req, res) => {
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
});
router.post("/responses", async (req, res) => {
  try {
    const responseData = pickWritableFields(
      req.body,
      ALTAR_CALL_RESPONSE_WRITABLE_FIELDS,
    );

    if (!responseData.altarCallId) {
      return res.status(400).json({ error: "Altar call ID is required." });
    }

    const payload = {
      ...responseData,
      followUpStatus: "NOT DONE",
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
});

// Update an individual response's follow-up status (NOT DONE <-> DONE)
const VALID_FOLLOW_UP_STATUSES = ["NOT DONE", "DONE"];

router.patch("/responses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { followUpStatus } = req.body;

    if (!VALID_FOLLOW_UP_STATUSES.includes(followUpStatus)) {
      return res
        .status(400)
        .json({ error: "Status must be 'NOT DONE' or 'DONE'." });
    }

    const docRef = db.collection("altarCallResponses").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Altar call response not found." });
    }

    await docRef.update({
      followUpStatus,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      message: "Follow-up status updated successfully.",
      data: { id, ...doc.data(), followUpStatus },
    });
  } catch (error) {
    console.error("Error updating response status:", error);
    res.status(500).json({ error: "Failed to update follow-up status." });
  }
});

router.get("/global", async (req, res) => {
  try {
    const callsSnapshot = await db.collection("altarCalls").get();
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
});

module.exports = router;
