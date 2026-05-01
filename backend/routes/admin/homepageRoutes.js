const express = require("express");
const router = express.Router();
const { verifyToken, requireStaticTypeAccess } = require("../../middleware/auth");
const { getHomepageSettings, updateHomepageSettings } = require("../../controllers/homepageController");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

router.get("/", getHomepageSettings);
router.put("/", updateHomepageSettings);
router.post("/", updateHomepageSettings);

module.exports = router;
