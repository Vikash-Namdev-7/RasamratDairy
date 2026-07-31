const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

// Helper to generate JWT token for Customers
const generateCustomerToken = (id) => {
  return jwt.sign(
    { id, role: 'customer' },
    process.env.JWT_SECRET || 'rasamrat_dairy_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// Helper to generate JWT token for Admins (1-day expiry)
const generateAdminToken = (id) => {
  return jwt.sign(
    { id, role: 'admin' },
    process.env.JWT_SECRET || 'rasamrat_dairy_super_secret_jwt_key_2026',
    { expiresIn: '1d' }
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

    const existingCustomer = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Ye email pehle se registered hai. Kripya login karein ya doosra email use karein.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const customer = await Customer.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      passwordHash
    });

    const token = generateCustomerToken(customer._id);

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

    const customer = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai.'
      });
    }

    const isMatch = await bcrypt.compare(password, customer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai.'
      });
    }

    const token = generateCustomerToken(customer._id);

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

// @desc    Admin Login
// @route   POST /api/auth/admin/login
// @access  Public (Store Staff/Management)
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Kripya Admin Email aur Password dono bharein.'
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai.'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai.'
      });
    }

    const token = generateAdminToken(admin._id);

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  customerSignup,
  customerLogin,
  adminLogin
};
