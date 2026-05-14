const express = require("express");
const router = express.Router();
const { verifyToken, requireStaticTypeAccess } = require("../../middleware/auth");
const { getAboutSettings, updateAboutSettings } = require("../../controllers/aboutController");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

router.get("/", getAboutSettings);
router.put("/", updateAboutSettings);
router.post("/", updateAboutSettings);

module.exports = router;
