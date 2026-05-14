const { db } = require("../config/firebase");

// @desc    Get headcount for a specific event
// @route   GET /api/headcounts/event/:eventId
exports.getHeadcountByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const snapshot = await db
      .collection("headcounts")
      .where("eventId", "==", eventId)
      .get();

    if (snapshot.empty) {
      return res.status(200).json(null); // Return null so the frontend knows to show "Add" button
    }

    const doc = snapshot.docs[0];
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching headcount:", error);
    res.status(500).json({ error: "Failed to fetch headcount" });
  }
};

// @desc    Create or Update headcount for an event
// @route   POST /api/headcounts
exports.upsertHeadcount = async (req, res) => {
  try {
    const { eventId, ...headcountData } = req.body;

    const payload = {
      eventId,
      ...headcountData,
      creatorId: req.user.uid,
      updatedAt: new Date().toISOString(),
    };

    // Check if one already exists
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
};

// @desc    Get all headcounts globally, enriched with Event details
// @route   GET /api/headcounts
exports.getAllHeadcounts = async (req, res) => {
  try {
    // 1. Fetch all headcounts
    const headcountsSnapshot = await db.collection("headcounts").get();

    // 2. Fetch all events
    const eventsSnapshot = await db.collection("events").get();

    // 3. Create a lookup map for events for instant O(1) matching
    const eventsMap = {};
    eventsSnapshot.forEach((doc) => {
      eventsMap[doc.id] = doc.data();
    });

    // console.log(eventsMap);

    // 4. Merge the data
    const headcounts = [];
    headcountsSnapshot.forEach((doc) => {
      const data = doc.data();
      headcounts.push({
        id: doc.id,
        ...data,
        // Attach the specific event details to this headcount
        eventDetails: eventsMap[data.eventId] || null,
      });
    });

    // 5. Sort descending by Event Date
    headcounts.sort((a, b) => {
      const dateA = a.eventDetails
        ? new Date(a.eventDetails.eventDate)
        : new Date(0);
      const dateB = b.eventDetails
        ? new Date(b.eventDetails.eventDate)
        : new Date(0);
      return dateB - dateA; // Newest first
    });

    res.status(200).json(headcounts);
  } catch (error) {
    console.error("Error fetching global headcounts:", error);
    res.status(500).json({ error: "Failed to fetch global headcounts." });
  }
};
