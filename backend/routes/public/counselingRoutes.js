const express = require('express');
const router = express.Router();
const { getCounselingSettings } = require('../../controllers/counselingController');

router.get('/', getCounselingSettings);

module.exports = router;
