const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

// Helper to generate JWT token
const generateToken = (id, role = 'customer') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'rasamrat_dairy_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Customer Signup
// @route   POST /api/auth/customer/signup
// @access  Public
const customerSignup = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Kripya saare required fields (name, email, phone, password) bharein.'
      });
    }

    // Check if email already registered
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Ye email pehle se registered hai. Kripya login karein ya doosra email use karein.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create Customer
    const customer = await Customer.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      passwordHash
    });

    // Generate Token
    const token = generateToken(customer._id, 'customer');

    return res.status(201).json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer Login
// @route   POST /api/auth/customer/login
// @access  Public
const customerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Kripya Email aur Password dono bharein.'
      });
    }

    // Find Customer by email
    const customer = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai.'
      });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, customer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai.'
      });
    }

    // Generate Token
    const token = generateToken(customer._id, 'customer');

    return res.status(200).json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  customerSignup,
  customerLogin
};
