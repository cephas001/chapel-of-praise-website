// backend/routes/eventAttendanceRoutes.js
const express = require("express");
const router = express.Router();
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");
const {
  getUnitAttendance,
  saveUnitAttendance,
} = require("../../controllers/eventAttendanceController");

router.use(verifyToken);
// Ensure only executives/admins can modify attendance
router.use(requireStaticTypeAccess("executive"));

router.get("/:eventId/:unitName", getUnitAttendance);
router.post("/", saveUnitAttendance);

module.exports = router;
