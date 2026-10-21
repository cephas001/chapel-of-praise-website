const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");
const { toNonNegativeInt } = require("../../utils/payload");

router.use(verifyToken);
router.use(requireStaticTypeAccess(["executive"]));

const padMonth = (value) => String(value).padStart(2, "0");

const getMonthRange = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const nextMonth = new Date(year, month + 1, 1);

  return {
    start: `${year}-${padMonth(month + 1)}-01`,
    end: `${nextMonth.getFullYear()}-${padMonth(nextMonth.getMonth() + 1)}-01`,
  };
};

const sumHeadcount = (data) =>
  toNonNegativeInt(data.maleStudents) +
  toNonNegativeInt(data.femaleStudents) +
  toNonNegativeInt(data.maleVisitors) +
  toNonNegativeInt(data.femaleVisitors);

router.get("/summary", async (req, res) => {
  try {
    const { start, end } = getMonthRange();

    const [eventsSnapshot, pendingFollowUpsSnapshot] = await Promise.all([
      db
        .collection("events")
        .where("eventDate", ">=", start)
        .where("eventDate", "<", end)
        .get(),
      db.collection("followUps").where("status", "==", "Pending").count().get(),
    ]);

    const eventIds = eventsSnapshot.docs.map((doc) => doc.id);
    let attendanceThisMonth = 0;

    for (let index = 0; index < eventIds.length; index += 10) {
      const chunk = eventIds.slice(index, index + 10);
      const headcountsSnapshot = await db
        .collection("headcounts")
        .where("eventId", "in", chunk)
        .get();

      headcountsSnapshot.forEach((doc) => {
        attendanceThisMonth += sumHeadcount(doc.data());
      });
    }

    res.status(200).json({
      eventsThisMonth: eventsSnapshot.size,
      attendanceThisMonth,
      pendingFollowUps: pendingFollowUpsSnapshot.data().count,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ error: "Failed to fetch dashboard summary." });
  }
});

module.exports = router;
