const express = require("express");
const router = express.Router();
const { getHomepageSettings } = require("../../controllers/homepageController");

router.get("/", getHomepageSettings);

module.exports = router;
