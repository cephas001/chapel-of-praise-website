// backend/routes/unitMeetingRoutes.js
const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

router.use(verifyToken);
router.use(requireStaticTypeAccess(["executive"]));

// GET / — list all unit meetings sorted by meetingDate descending
router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection("unitMeetings")
      .orderBy("meetingDate", "desc")
      .get();

    const records = [];
    snapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching unit meetings:", error);
    res.status(500).json({ error: "Failed to fetch unit meetings." });
  }
});

// GET /:unitName/:meetingDate — get a specific unit meeting record
router.get("/:unitName/:meetingDate", async (req, res) => {
  try {
    const { unitName, meetingDate } = req.params;

    const snapshot = await db
      .collection("unitMeetings")
      .where("unitName", "==", unitName)
      .where("meetingDate", "==", meetingDate)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({
        unitName,
        meetingDate,
        attendanceByMember: {},
        presentIds: [],
        pardonedIds: [],
        additionalComments: "",
      });
    }

    const doc = snapshot.docs[0];
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching unit meeting:", error);
    res.status(500).json({ error: "Failed to fetch unit meeting record." });
  }
});

// POST / — upsert a unit meeting record (create or update)
router.post("/", async (req, res) => {
  try {
    const {
      unitName,
      meetingDate,
      attendanceByMember = {},
      presentIds = [],
      pardonedIds = [],
      additionalComments = "",
    } = req.body;

    if (!unitName || !meetingDate) {
      return res
        .status(400)
        .json({ error: "Unit name and meeting date are required." });
    }

    const payload = {
      unitName,
      meetingDate,
      attendanceByMember,
      presentIds,
      pardonedIds,
      additionalComments,
      recordedBy: req.user.uid,
      updatedAt: new Date().toISOString(),
    };

    const query = db
      .collection("unitMeetings")
      .where("unitName", "==", unitName)
      .where("meetingDate", "==", meetingDate);

    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(query);

      if (snapshot.empty) {
        // Deterministic ID prevents duplicate docs from concurrent creates
        const docRef = db
          .collection("unitMeetings")
          .doc(`${unitName}__${meetingDate}`);
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
        message: "Unit meeting attendance recorded successfully.",
        id: result.id,
        data: payload,
      });
    }

    return res.status(200).json({
      message: "Unit meeting attendance updated successfully.",
      id: result.id,
      data: payload,
    });
  } catch (error) {
    console.error("Error saving unit meeting:", error);
    res.status(500).json({ error: "Failed to save unit meeting attendance." });
  }
});

// DELETE /:unitName/:meetingDate — delete a unit meeting record
router.delete("/:unitName/:meetingDate", async (req, res) => {
  try {
    const { unitName, meetingDate } = req.params;

    const snapshot = await db
      .collection("unitMeetings")
      .where("unitName", "==", unitName)
      .where("meetingDate", "==", meetingDate)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Unit meeting record not found." });
    }

    const docId = snapshot.docs[0].id;
    await db.collection("unitMeetings").doc(docId).delete();

    res.status(200).json({ message: "Unit meeting record deleted successfully." });
  } catch (error) {
    console.error("Error deleting unit meeting:", error);
    res.status(500).json({ error: "Failed to delete unit meeting record." });
  }
});

module.exports = router;
