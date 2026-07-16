// backend/routes/eventAttendanceRoutes.js
const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

router.use(verifyToken);
// Ensure only executives/admins can modify attendance
router.use(requireStaticTypeAccess(["executive"]));

router.get("/:eventId/:unitName", async (req, res) => {
  try {
    const { eventId, unitName } = req.params;

    const snapshot = await db
      .collection("eventUnitAttendance")
      .where("eventId", "==", eventId)
      .where("unitName", "==", unitName)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({
        officiatingIds: [],
        presentIds: [],
        pardonedIds: [],
        absentIds: [],
        additionalComments: "",
      });
    }

    const doc = snapshot.docs[0];
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance records." });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      eventId,
      unitName,
      officiatingIds = [],
      presentIds = [],
      pardonedIds = [],
      additionalComments = "",
    } = req.body;

    if (!eventId || !unitName) {
      return res
        .status(400)
        .json({ error: "Event ID and Unit Name are required." });
    }

    const presentOrPardoned = new Set([...presentIds, ...pardonedIds]);
    const absentIds = officiatingIds.filter((id) => !presentOrPardoned.has(id));

    const payload = {
      eventId,
      unitName,
      officiatingIds,
      presentIds,
      pardonedIds,
      absentIds,
      additionalComments,
      recordedBy: req.user.uid,
      updatedAt: new Date().toISOString(),
    };

    const snapshot = await db
      .collection("eventUnitAttendance")
      .where("eventId", "==", eventId)
      .where("unitName", "==", unitName)
      .get();

    if (snapshot.empty) {
      payload.createdAt = new Date().toISOString();
      const docRef = await db.collection("eventUnitAttendance").add(payload);
      return res.status(201).json({
        message: "Attendance recorded successfully.",
        id: docRef.id,
        data: payload,
      });
    } else {
      const docId = snapshot.docs[0].id;
      await db.collection("eventUnitAttendance").doc(docId).update(payload);
      return res.status(200).json({
        message: "Attendance updated successfully.",
        id: docId,
        data: payload,
      });
    }
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Failed to save attendance records." });
  }
});

module.exports = router;
