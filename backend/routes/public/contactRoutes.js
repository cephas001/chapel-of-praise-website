const express = require('express');
const router = express.Router();
const { getContactSettings } = require('../../controllers/contactController');

router.get('/', getContactSettings);

module.exports = router;
