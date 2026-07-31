const express = require('express');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStock,
  getAllProducts
} = require('../controllers/productController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All Admin Product routes require protectAdmin
router.use(protectAdmin);

router.get('/', getAllProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/stock', toggleStock);

module.exports = router;
