const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

// GET /summary - Get overall summary
router.get('/', summaryController.getSummary);

module.exports = router;
