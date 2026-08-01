const Notification = require('../models/Notification');

// @desc    Get logged-in customer's notifications
// @route   GET /api/notifications/me
// @access  Private (Customer Only)
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipientType: 'customer',
      recipientId: req.customer.id
    }).sort({ createdAt: -1 }).limit(50);

    const unreadCount = await Notification.countDocuments({
      recipientType: 'customer',
      recipientId: req.customer.id,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin notifications
// @route   GET /api/notifications/admin
// @access  Private (Admin Only)
const getAdminNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipientType: 'admin'
    }).sort({ createdAt: -1 }).limit(50);

    const unreadCount = await Notification.countDocuments({
      recipientType: 'admin',
      isRead: false
    });

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private (Customer or Admin)
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification nahi mili.'
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read for current user/admin
// @route   PATCH /api/notifications/read-all
// @access  Private (Customer or Admin)
const markAllAsRead = async (req, res, next) => {
  try {
    let query = {};
    if (req.customer) {
      query = { recipientType: 'customer', recipientId: req.customer.id, isRead: false };
    } else if (req.admin) {
      query = { recipientType: 'admin', isRead: false };
    }

    await Notification.updateMany(query, { $set: { isRead: true } });

    return res.status(200).json({
      success: true,
      message: 'Saare notifications read mark ho gaye.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  getAdminNotifications,
  markAsRead,
  markAllAsRead
};
