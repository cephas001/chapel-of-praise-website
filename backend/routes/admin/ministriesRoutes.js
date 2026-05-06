const express = require("express");
const router = express.Router();
const { verifyToken, requireStaticTypeAccess } = require("../../middleware/auth");
const { getMinistriesSettings, updateMinistriesSettings } = require("../../controllers/ministriesController");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

router.get("/", getMinistriesSettings);
router.put("/", updateMinistriesSettings);
router.post("/", updateMinistriesSettings);

module.exports = router;