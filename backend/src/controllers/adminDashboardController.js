const Order = require('../models/Order');
const Subscription = require('../models/Subscription');

// @desc    Get Admin Dashboard Stats & Recent Orders
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin Only)
const getDashboardStats = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      ordersToday,
      activeSubscriptions,
      pendingOrders,
      todayOrdersList,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Subscription.countDocuments({ status: 'active' }),
      Order.countDocuments({ status: 'pending' }),
      Order.find({ createdAt: { $gte: startOfDay }, status: { $ne: 'rejected' } }),
      Order.find().sort({ createdAt: -1 }).limit(6)
    ]);

    const salesToday = todayOrdersList.reduce((sum, ord) => sum + (ord.totalPayable || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalOrders,
          ordersToday,
          salesToday,
          activeSubscriptions,
          pendingOrders
        },
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
