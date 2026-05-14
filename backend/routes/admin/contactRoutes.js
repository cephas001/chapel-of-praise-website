const express = require("express");
const router = express.Router();
const { verifyToken, requireStaticTypeAccess } = require("../../middleware/auth");
const { getContactSettings, updateContactSettings } = require("../../controllers/contactController");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

router.get("/", getContactSettings);
router.put("/", updateContactSettings);
router.post("/", updateContactSettings);

module.exports = router;