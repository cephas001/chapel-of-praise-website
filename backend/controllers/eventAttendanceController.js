// backend/controllers/eventAttendanceController.js
const { db } = require("../config/firebase");

// @desc    Get attendance record for a specific event and unit
// @route   GET /api/event-attendance/:eventId/:unitName
exports.getUnitAttendance = async (req, res) => {
  try {
    const { eventId, unitName } = req.params;

    const snapshot = await db
      .collection("eventUnitAttendance")
      .where("eventId", "==", eventId)
      .where("unitName", "==", unitName)
      .get();

    if (snapshot.empty) {
      // Return empty arrays if no record exists yet
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
};

// @desc    Save or Update attendance for a specific event and unit
// @route   POST /api/event-attendance
exports.saveUnitAttendance = async (req, res) => {
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

    // CORE LOGIC: Calculate absentees dynamically
    // Absent = Officiating minus (Present + Pardoned)
    const presentOrPardoned = new Set([...presentIds, ...pardonedIds]);
    const absentIds = officiatingIds.filter((id) => !presentOrPardoned.has(id));

    const payload = {
      eventId,
      unitName,
      officiatingIds,
      presentIds,
      pardonedIds,
      absentIds, // Save the calculated result
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
};
