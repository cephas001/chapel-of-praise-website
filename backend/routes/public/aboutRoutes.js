const express = require('express');
const router = express.Router();
const { getAboutSettings } = require('../../controllers/aboutController');

router.get('/', getAboutSettings);

module.exports = router;
