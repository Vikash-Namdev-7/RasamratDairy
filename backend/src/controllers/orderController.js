const Order = require('../models/Order');
const Product = require('../models/Product');
const Zone = require('../models/Zone');
const Customer = require('../models/Customer');

// @desc    Create a new order (Server-side price & stock validation)
// @route   POST /api/orders
// @access  Private (Customer Only)
const createOrder = async (req, res, next) => {
  try {
    const { items, zoneId, address, deliveryTimeOption, customTimeNote } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order me kam se kam 1 item hona zaroori hai.'
      });
    }

    if (!zoneId || !address) {
      return res.status(400).json({
        success: false,
        message: 'Kripya Delivery Zone aur Pura Pata (address) bharein.'
      });
    }

    // 1. Fetch customer details
    const customer = await Customer.findById(req.customer.id);
    const customerName = customer ? customer.name : 'Customer';
    const customerPhone = customer ? customer.phone : '';

    // 2. Validate items & calculate subtotal on server-side
    let calculatedSubtotal = 0;
    const itemSnapshots = [];

    for (const item of items) {
      const prodId = item.productId || item.id;
      const product = await Product.findById(prodId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ID '${prodId}' catalogue me nahi mila.`
        });
      }

      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: `"${product.name}" filhal Out of Stock hai. Kripya use cart se remove karein.`
        });
      }

      const itemQty = Number(item.qty) || 1;
      const itemPrice = Number(product.price);
      calculatedSubtotal += itemPrice * itemQty;

      itemSnapshots.push({
        productId: product._id,
        name: product.name,
        price: itemPrice,
        qty: itemQty
      });
    }

    // 3. Validate delivery zone & minimum order limit
    const zone = await Zone.findById(zoneId);
    if (!zone) {
      return res.status(400).json({
        success: false,
        message: 'Sahi Delivery Zone select karein.'
      });
    }

    if (calculatedSubtotal < zone.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Is area (${zone.name}) me delivery ke liye minimum order amount ₹${zone.minOrderAmount} hai. Aapka order ₹${calculatedSubtotal} ka hai.`
      });
    }

    const deliveryFee = Number(zone.deliveryFee || 0);
    const totalPayable = calculatedSubtotal + deliveryFee;

    // 4. Generate unique collision-proof order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `RD-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // 5. Create Order document in MongoDB
    const order = await Order.create({
      orderNumber,
      customerId: req.customer.id,
      customerName,
      customerPhone,
      items: itemSnapshots,
      subtotal: calculatedSubtotal,
      deliveryFee,
      totalPayable,
      zoneId: zone._id,
      zoneName: zone.name,
      address: address.trim(),
      status: 'pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Order successfully place ho gaya!',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in customer's order history
// @route   GET /api/orders/my
// @access  Private (Customer Only)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.customer.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private (Customer / Admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order nahi mila.'
      });
    }

    // Security Check: Customer can only view their own order
    if (
      req.customer &&
      order.customerId &&
      order.customerId.toString() !== req.customer.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Aap sirf apna order dekh sakte hain.'
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid order ID format.'
      });
    }
    next(error);
  }
};

// @desc    Get all orders for admin (with status filter)
// @route   GET /api/admin/orders
// @access  Private (Admin Only)
const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Accept/Reject/Deliver)
// @route   PATCH /api/admin/orders/:id/status
// @access  Private (Admin Only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, deliveryTime, rejectReason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Kripya Naya Status specify karein.'
      });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order nahi mila.'
      });
    }

    // Validation for Accept action
    if (status === 'accepted' && !deliveryTime) {
      return res.status(400).json({
        success: false,
        message: 'Order accept karte waqt Delivery Time specify karna zaroori hai.'
      });
    }

    // Validation for Reject action
    if (status === 'rejected' && !rejectReason) {
      return res.status(400).json({
        success: false,
        message: 'Order reject karte waqt Reason likhna zaroori hai.'
      });
    }

    order.status = status;
    if (deliveryTime) order.deliveryTime = deliveryTime.trim();
    if (rejectReason) order.rejectReason = rejectReason.trim();

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order #${order.orderNumber} status '${status}' update ho gaya!`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
