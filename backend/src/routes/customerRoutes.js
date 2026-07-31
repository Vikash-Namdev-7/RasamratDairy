const express = require('express');
const {
  getMyProfile,
  updateMyProfile,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/customerController');
const { protectCustomer } = require('../middleware/authMiddleware');

const router = express.Router();

// All Customer routes require protectCustomer
router.use(protectCustomer);

router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);
router.post('/me/addresses', addAddress);
router.put('/me/addresses/:addressId', updateAddress);
router.delete('/me/addresses/:addressId', deleteAddress);

module.exports = router;
