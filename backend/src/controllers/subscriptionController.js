const Subscription = require('../models/Subscription');
const Customer = require('../models/Customer');

// @desc    Create a new daily milk subscription
// @route   POST /api/subscriptions
// @access  Private (Customer Only)
const createSubscription = async (req, res, next) => {
  try {
    const { milkTypeId, milkTypeName, litres, slot, address } = req.body;

    if (!milkTypeName || !litres || !slot || !address) {
      return res.status(400).json({
        success: false,
        message: 'Kripya Milk Type, Quantity (litres), Slot (morning/evening) aur Delivery Address bharein.'
      });
    }

    const cleanSlot = slot.trim().toLowerCase();
    if (cleanSlot !== 'morning' && cleanSlot !== 'evening') {
      return res.status(400).json({
        success: false,
        message: 'Slot sirf "morning" (subah) ya "evening" (shaam) ho sakta hai.'
      });
    }

    const numLitres = Number(litres);
    if (isNaN(numLitres) || numLitres <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sahi quantity (litres) specify karein.'
      });
    }

    // Fetch customer details
    const customer = await Customer.findById(req.customer.id);
    const customerName = customer ? customer.name : 'Customer';
    const customerPhone = customer ? customer.phone : '';

    const subscription = await Subscription.create({
      customerId: req.customer.id,
      customerName,
      customerPhone,
      address: address.trim(),
      milkTypeId: milkTypeId || 'full-cream-milk',
      milkTypeName: milkTypeName.trim(),
      litres: numLitres,
      slot: cleanSlot,
      status: 'active',
      pausedDates: [],
      startDate: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Daily Milk Subscription successfully start ho gaya!',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in customer's subscriptions
// @route   GET /api/subscriptions/my
// @access  Private (Customer Only)
const getMySubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ customerId: req.customer.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pause/skip date for customer subscription
// @route   PATCH /api/subscriptions/:id/pause-toggle
// @access  Private (Customer Only)
const togglePauseDate = async (req, res, next) => {
  try {
    const { date } = req.body; // e.g. "2026-08-05"

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Kripya date specify karein.'
      });
    }

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription nahi mili.'
      });
    }

    // Security Check: Customer ownership verification
    if (subscription.customerId.toString() !== req.customer.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Aap sirf apni subscription edit kar sakte hain.'
      });
    }

    if (subscription.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled subscription ko pause/un-pause nahi kiya ja sakta.'
      });
    }

    const cleanDate = date.trim();
    const dateIndex = subscription.pausedDates.indexOf(cleanDate);

    let isPausedNow = false;
    if (dateIndex > -1) {
      // Remove date (Un-pause)
      subscription.pausedDates.splice(dateIndex, 1);
      isPausedNow = false;
    } else {
      // Add date (Pause)
      subscription.pausedDates.push(cleanDate);
      isPausedNow = true;
    }

    await subscription.save();

    return res.status(200).json({
      success: true,
      message: isPausedNow
        ? `${cleanDate} ke liye delivery pause/skip kar di gayi.`
        : `${cleanDate} ke liye delivery resume ho gayi.`,
      isPaused: isPausedNow,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel customer subscription
// @route   PATCH /api/subscriptions/:id/cancel
// @access  Private (Customer Only)
const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription nahi mili.'
      });
    }

    // Security Check: Customer ownership verification
    if (subscription.customerId.toString() !== req.customer.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Aap sirf apni subscription cancel kar sakte hain.'
      });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    return res.status(200).json({
      success: true,
      message: 'Subscription successfully cancel ho gayi.',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscriptions for admin (with optional status/slot filter)
// @route   GET /api/admin/subscriptions
// @access  Private (Admin Only)
const getAllSubscriptions = async (req, res, next) => {
  try {
    const { status, slot } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (slot && slot !== 'all') {
      query.slot = slot;
    }

    const subscriptions = await Subscription.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle subscription status between active and paused (Admin)
// @route   PATCH /api/admin/subscriptions/:id/toggle-status
// @access  Private (Admin Only)
const toggleSubscriptionStatus = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription nahi mili.'
      });
    }

    if (subscription.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled subscription status change nahi ho sakta.'
      });
    }

    subscription.status = subscription.status === 'active' ? 'paused' : 'active';
    await subscription.save();

    return res.status(200).json({
      success: true,
      message: `Subscription status ab '${subscription.status}' set ho gaya.`,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel subscription (Admin)
// @route   PATCH /api/admin/subscriptions/:id/cancel
// @access  Private (Admin Only)
const adminCancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription nahi mili.'
      });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    return res.status(200).json({
      success: true,
      message: 'Subscription cancel kar di gayi hai.',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubscription,
  getMySubscriptions,
  togglePauseDate,
  cancelSubscription,
  getAllSubscriptions,
  toggleSubscriptionStatus,
  adminCancelSubscription
};
