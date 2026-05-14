const express = require('express');
const router = express.Router();
const { getMinistriesSettings } = require('../../controllers/ministriesController');

router.get('/', getMinistriesSettings);

module.exports = router;
