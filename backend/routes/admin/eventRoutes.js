const express = require("express");
const router = express.Router();
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventById,
} = require("../../controllers/eventController");

// Apply verifyToken middleware to all event routes
router.use(verifyToken);
router.use(requireStaticTypeAccess("executive")); // Only allow users with type 'executive' or 'all' to access these routes

router.post("/", createEvent);
router.get("/", getEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/:id", getEventById);

module.exports = router;
