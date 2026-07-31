const express = require('express');
const { getAllZones } = require('../controllers/zoneController');

const router = express.Router();

// Public Routes
router.get('/', getAllZones);

module.exports = router;
