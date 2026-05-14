const express = require("express");
const router = express.Router();
const { verifyToken, requireStaticTypeAccess } = require("../../middleware/auth");
const { getLeadershipSettings, updateLeadershipSettings } = require("../../controllers/leadershipController");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

router.get("/", getLeadershipSettings);
router.put("/", updateLeadershipSettings);
router.post("/", updateLeadershipSettings);

module.exports = router;
