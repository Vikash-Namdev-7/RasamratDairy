const jwt = require('jsonwebtoken');

const protectCustomer = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'rasamrat_dairy_super_secret_jwt_key_2026'
      );

      if (decoded.role !== 'customer') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Customer authentication required.'
        });
      }

      req.customer = decoded;
      return next();
    } catch (error) {
      console.error('JWT Token Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Token missing or invalid.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided.'
    });
  }
};

module.exports = {
  protectCustomer
};
