const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

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

// Create or update headcount
router.post("/", async (req, res) => {
  try {
    const { eventId, ...headcountData } = req.body;

    const payload = {
      eventId,
      ...headcountData,
      creatorId: req.user.uid,
      updatedAt: new Date().toISOString(),
    };

    const snapshot = await db
      .collection("headcounts")
      .where("eventId", "==", eventId)
      .get();

    if (snapshot.empty) {
      payload.createdAt = new Date().toISOString();
      const docRef = await db.collection("headcounts").add(payload);
      return res.status(201).json({
        message: "Headcount created",
        data: { id: docRef.id, ...payload },
      });
    } else {
      const docId = snapshot.docs[0].id;
      await db.collection("headcounts").doc(docId).update(payload);
      return res.status(200).json({
        message: "Headcount updated",
        data: { id: docId, ...payload },
      });
    }
  } catch (error) {
    console.error("Error saving headcount:", error);
    res.status(500).json({ error: "Failed to save headcount" });
  }
});

module.exports = router;
