const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

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
    const payload = {
      ...req.body,
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
