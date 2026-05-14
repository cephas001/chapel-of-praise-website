// backend/routes/followUpRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const {
  getFollowUps,
  createFollowUp,
  addNote,
  updateStatus,
} = require("../../controllers/followUpController");

router.use(verifyToken);

router.get("/", getFollowUps);
router.post("/", createFollowUp);
router.post("/:id/notes", addNote);
router.patch("/:id/status", updateStatus);

module.exports = router;
