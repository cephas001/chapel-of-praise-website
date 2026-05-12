const express = require('express');
const router = express.Router();
const { getPrayerSettings } = require('../../controllers/prayerController');

router.get('/', getPrayerSettings);

module.exports = router;
