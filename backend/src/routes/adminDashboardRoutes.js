const express = require('express');
const { getDashboardStats } = require('../controllers/adminDashboardController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protectAdmin);

router.get('/stats', getDashboardStats);

module.exports = router;
