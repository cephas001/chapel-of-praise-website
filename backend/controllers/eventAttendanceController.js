// backend/controllers/eventAttendanceController.js
const { db } = require("../config/firebase");

// @desc    Get attendance record for a specific event and unit
// @route   GET /api/event-attendance/:eventId/:unitName
exports.getUnitAttendance = async (req, res) => {
  try {
    const { eventId, unitName } = req.params;

    // Query for the specific document
    const snapshot = await db
      .collection("eventUnitAttendance")
      .where("eventId", "==", eventId)
      .where("unitName", "==", unitName)
      .get();

    if (snapshot.empty) {
      // Return a blank template so the frontend knows no one has been marked yet
      return res.status(200).json({ presentIds: [], absentIds: [] });
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
    const { eventId, unitName, presentIds, absentIds } = req.body;

    if (!eventId || !unitName) {
      return res
        .status(400)
        .json({ error: "Event ID and Unit Name are required." });
    }

    const payload = {
      eventId,
      unitName,
      presentIds: presentIds || [],
      absentIds: absentIds || [],
      recordedBy: req.user.uid,
      updatedAt: new Date().toISOString(),
    };

    // Check if a record already exists
    const snapshot = await db
      .collection("eventUnitAttendance")
      .where("eventId", "==", eventId)
      .where("unitName", "==", unitName)
      .get();

    if (snapshot.empty) {
      // CREATE: No record exists yet
      payload.createdAt = new Date().toISOString();
      const docRef = await db.collection("eventUnitAttendance").add(payload);
      return res
        .status(201)
        .json({ message: "Attendance recorded successfully.", id: docRef.id });
    } else {
      // UPDATE: Overwrite the existing arrays
      const docId = snapshot.docs[0].id;
      await db.collection("eventUnitAttendance").doc(docId).update(payload);
      return res
        .status(200)
        .json({ message: "Attendance updated successfully.", id: docId });
    }
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Failed to save attendance records." });
  }
};
