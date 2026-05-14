const express = require("express");
const router = express.Router();
const { verifyToken, requireStaticTypeAccess } = require("../../middleware/auth");
const { getGivingSettings, updateGivingSettings } = require("../../controllers/givingController");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

router.get("/", getGivingSettings);
router.put("/", updateGivingSettings);
router.post("/", updateGivingSettings);

module.exports = router;