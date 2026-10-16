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

// Client-writable fields only; server-managed fields (creatorId, timestamps)
// can never be set or overwritten by the request body.
const HEADCOUNT_NUMBER_FIELDS = [
  "maleStudents",
  "femaleStudents",
  "maleVisitors",
  "femaleVisitors",
];

const HEADCOUNT_WRITABLE_FIELDS = [
  ...HEADCOUNT_NUMBER_FIELDS,
  "additionalComments",
];

router.use(verifyToken);
router.use(requireStaticTypeAccess(["executive"]));

// Get all headcounts
router.get("/", async (req, res) => {
  try {
    const headcountsSnapshot = await db.collection("headcounts").get();
    const eventsSnapshot = await db.collection("events").get();

    const eventsMap = {};
    eventsSnapshot.forEach((doc) => {
      eventsMap[doc.id] = doc.data();
    });

    const headcounts = [];
    headcountsSnapshot.forEach((doc) => {
      const data = doc.data();
      headcounts.push({
        id: doc.id,
        ...data,
        eventDetails: eventsMap[data.eventId] || null,
      });
    });

    headcounts.sort((a, b) => {
      const dateA = a.eventDetails
        ? new Date(a.eventDetails.eventDate)
        : new Date(0);
      const dateB = b.eventDetails
        ? new Date(b.eventDetails.eventDate)
        : new Date(0);
      return dateB - dateA;
    });

    res.status(200).json(headcounts);
  } catch (error) {
    console.error("Error fetching global headcounts:", error);
    res.status(500).json({ error: "Failed to fetch global headcounts." });
  }
});

// Get headcount by event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const snapshot = await db
      .collection("headcounts")
      .where("eventId", "==", eventId)
      .get();

    if (snapshot.empty) {
      return res.status(200).json(null);
    }

    const doc = snapshot.docs[0];
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching headcount:", error);
    res.status(500).json({ error: "Failed to fetch headcount" });
  }
});

// Create or update headcount (transactional upsert; deterministic doc ID = eventId)
router.post("/", async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required." });
    }

    const headcountData = pickWritableFields(req.body, HEADCOUNT_WRITABLE_FIELDS);
    HEADCOUNT_NUMBER_FIELDS.forEach((field) => {
      headcountData[field] = toNonNegativeInt(headcountData[field]);
    });

    const payload = {
      eventId,
      ...headcountData,
      creatorId: req.user.uid,
      updatedAt: new Date().toISOString(),
    };

    const query = db.collection("headcounts").where("eventId", "==", eventId);

    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(query);

      if (snapshot.empty) {
        // Deterministic ID prevents duplicate docs from concurrent creates
        const docRef = db.collection("headcounts").doc(String(eventId));
        transaction.set(docRef, {
          ...payload,
          createdAt: new Date().toISOString(),
        });
        return { id: docRef.id, created: true };
      }

      // Update the existing doc (may be a legacy random-ID doc)
      const docRef = snapshot.docs[0].ref;
      transaction.update(docRef, payload);
      return { id: docRef.id, created: false };
    });

    if (result.created) {
      return res.status(201).json({
        message: "Headcount created",
        data: { id: result.id, ...payload },
      });
    }

    return res.status(200).json({
      message: "Headcount updated",
      data: { id: result.id, ...payload },
    });
  } catch (error) {
    console.error("Error saving headcount:", error);
    res.status(500).json({ error: "Failed to save headcount" });
  }
});

module.exports = router;
