// backend/routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, requireSuperAdmin } = require("../../middleware/auth");
const {
  createExecutive,
  getExecutives,
  getMembersByUnit,
} = require("../../controllers/memberController");

// ==========================================
// PROTECTED ROUTES
// ==========================================
// Apply the token verification middleware to all routes below this line
router.use(verifyToken);

// General Admin Routes
// Used to fetch lists for attendance dropping
router.get("/unit/:unitName", getMembersByUnit);

// Super Admin Only Routes
// Used specifically for managing the Executive roster
router.post("/executives", requireSuperAdmin, createExecutive);
router.get("/executives", getExecutives);

module.exports = router;
