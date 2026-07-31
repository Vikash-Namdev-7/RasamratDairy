const express = require('express');
const {
  getAllSubscriptions,
  toggleSubscriptionStatus,
  adminCancelSubscription
} = require('../controllers/subscriptionController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All Admin Subscription routes require protectAdmin
router.use(protectAdmin);

router.get('/', getAllSubscriptions);
router.patch('/:id/toggle-status', toggleSubscriptionStatus);
router.patch('/:id/cancel', adminCancelSubscription);

module.exports = router;
