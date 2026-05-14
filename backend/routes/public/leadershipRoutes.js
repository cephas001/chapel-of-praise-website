const express = require('express');
const router = express.Router();
const { getLeadershipSettings } = require('../../controllers/leadershipController');

router.get('/', getLeadershipSettings);

module.exports = router;
