const express = require("express");
const router = express.Router();
const { verifyToken, requireStaticTypeAccess } = require("../../middleware/auth");
const { getPrayerSettings, updatePrayerSettings } = require("../../controllers/prayerController");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

router.get("/", getPrayerSettings);
router.put("/", updatePrayerSettings);
router.post("/", updatePrayerSettings);

module.exports = router;
