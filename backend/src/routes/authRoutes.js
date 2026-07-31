const express = require('express');
const { customerSignup, customerLogin } = require('../controllers/authController');

const router = express.Router();

// Customer Auth Routes
router.post('/customer/signup', customerSignup);
router.post('/customer/login', customerLogin);

module.exports = router;
