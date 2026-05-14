const express = require("express");
const router = express.Router();
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");
const {
  getAltarCallsByEvent,
  createAltarCall,
  getResponsesByAltarCall,
  createResponse,
  getGlobalAltarCalls,
} = require("../../controllers/altarCallController");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

// Aggregate Routes
router.get("/event/:eventId", getAltarCallsByEvent);
router.post("/", createAltarCall);

// Individual Response Routes
router.get("/responses/:altarCallId", getResponsesByAltarCall);
router.post("/responses", createResponse);

router.get("/global", getGlobalAltarCalls);

module.exports = router;
