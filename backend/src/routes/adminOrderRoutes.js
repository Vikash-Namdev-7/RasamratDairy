const express = require('express');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All Admin Order routes require protectAdmin
router.use(protectAdmin);

router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
