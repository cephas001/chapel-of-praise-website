// backend/routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const { registerWorker } = require("../../controllers/memberController");

// ==========================================
// PUBLIC ROUTES
// ==========================================
// Used by the main frontend website (chapelpraise.com)
router.post("/register-worker", registerWorker);

module.exports = router;
