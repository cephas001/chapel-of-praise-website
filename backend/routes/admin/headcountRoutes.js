const express = require("express");
const router = express.Router();
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");
const {
  getHeadcountByEvent,
  upsertHeadcount,
} = require("../../controllers/headcountController");

router.use(verifyToken);
router.use(requireStaticTypeAccess("executive"));

router.get("/event/:eventId", getHeadcountByEvent);
router.post("/", upsertHeadcount);

module.exports = router;
