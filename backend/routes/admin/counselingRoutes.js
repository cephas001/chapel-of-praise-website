const express = require("express");
const router = express.Router();
const { verifyToken, requireStaticTypeAccess } = require("../../middleware/auth");
const { getCounselingSettings, updateCounselingSettings } = require("../../controllers/counselingController");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

router.get("/", getCounselingSettings);
router.put("/", updateCounselingSettings);
router.post("/", updateCounselingSettings);

module.exports = router;