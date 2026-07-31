const express = require('express');
const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protectCustomer } = require('../middleware/authMiddleware');

const router = express.Router();

// All Customer Order routes require protectCustomer
router.use(protectCustomer);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
