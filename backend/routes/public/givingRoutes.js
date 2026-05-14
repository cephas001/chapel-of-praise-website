const express = require('express');
const router = express.Router();
const { getGivingSettings } = require('../../controllers/givingController');

router.get('/', getGivingSettings);

module.exports = router;
