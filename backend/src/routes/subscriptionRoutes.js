const express = require('express');
const {
  createSubscription,
  getMySubscriptions,
  togglePauseDate,
  cancelSubscription
} = require('../controllers/subscriptionController');
const { protectCustomer } = require('../middleware/authMiddleware');

const router = express.Router();

// All Customer Subscription routes require protectCustomer
router.use(protectCustomer);

router.post('/', createSubscription);
router.get('/my', getMySubscriptions);
router.patch('/:id/pause-toggle', togglePauseDate);
router.patch('/:id/cancel', cancelSubscription);

module.exports = router;
