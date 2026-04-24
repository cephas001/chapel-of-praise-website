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
      return res
        .status(201)
        .json({
          message: "Headcount created",
          data: { id: docRef.id, ...payload },
        });
    } else {
      const docId = snapshot.docs[0].id;
      await db.collection("headcounts").doc(docId).update(payload);
      return res
        .status(200)
        .json({
          message: "Headcount updated",
          data: { id: docId, ...payload },
        });
    }
  } catch (error) {
    console.error("Error saving headcount:", error);
    res.status(500).json({ error: "Failed to save headcount" });
  }
};
