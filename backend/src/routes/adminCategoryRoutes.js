const express = require('express');
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories
} = require('../controllers/categoryController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All Admin Category routes require protectAdmin
router.use(protectAdmin);

router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
