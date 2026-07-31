const express = require('express');
const { customerSignup, customerLogin, adminLogin } = require('../controllers/authController');

const router = express.Router();

// Customer Auth Routes
router.post('/customer/signup', customerSignup);
router.post('/customer/login', customerLogin);

// Admin Auth Routes
router.post('/admin/login', adminLogin);

module.exports = router;
