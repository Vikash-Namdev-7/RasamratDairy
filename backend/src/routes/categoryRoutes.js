const express = require('express');
const { getAllCategories } = require('../controllers/categoryController');

const router = express.Router();

// Public Routes
router.get('/', getAllCategories);

module.exports = router;
