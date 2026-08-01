const express = require('express');
const {
  getMyNotifications,
  getAdminNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');
const { protectCustomer, protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protectCustomer, getMyNotifications);
router.get('/admin', protectAdmin, getAdminNotifications);

// Helper middleware for combined routes (accepts either customer or admin)
const protectAny = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  // Try customer first, fallback to admin
  protectCustomer(req, res, (err) => {
    if (!err && req.customer) return next();
    protectAdmin(req, res, next);
  });
};

router.patch('/:id/read', protectAny, markAsRead);
router.patch('/read-all', protectAny, markAllAsRead);

module.exports = router;
