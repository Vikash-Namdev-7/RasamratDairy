const Customer = require('../models/Customer');

// @desc    Get logged-in customer profile & saved addresses
// @route   GET /api/customers/me
// @access  Private (Customer Only)
const getMyProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer.id).select('-passwordHash');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile nahi mili.'
      });
    }

    return res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer profile (Name & Phone)
// @route   PUT /api/customers/me
// @access  Private (Customer Only)
const updateMyProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Kripya Naam aur Phone Number bharein.'
      });
    }

    const customer = await Customer.findByIdAndUpdate(
      req.customer.id,
      {
        name: name.trim(),
        phone: phone.trim()
      },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    return res.status(200).json({
      success: true,
      message: 'Profile successfully update ho gayi!',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new saved address to customer profile
// @route   POST /api/customers/me/addresses
// @access  Private (Customer Only)
const addAddress = async (req, res, next) => {
  try {
    const { label, fullAddress, zoneId } = req.body;

    if (!fullAddress) {
      return res.status(400).json({
        success: false,
        message: 'Pura pata (fullAddress) likhna zaroori hai.'
      });
    }

    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile nahi mili.'
      });
    }

    const newAddress = {
      label: label ? label.trim() : 'Home',
      fullAddress: fullAddress.trim(),
      zoneId: zoneId || null
    };

    customer.addresses.push(newAddress);
    await customer.save();

    return res.status(201).json({
      success: true,
      message: 'Naya address successfully save ho gaya!',
      data: customer.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing saved address
// @route   PUT /api/customers/me/addresses/:addressId
// @access  Private (Customer Only)
const updateAddress = async (req, res, next) => {
  try {
    const { label, fullAddress, zoneId } = req.body;
    const { addressId } = req.params;

    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile nahi mili.'
      });
    }

    const addressSubdoc = customer.addresses.id(addressId);
    if (!addressSubdoc) {
      return res.status(404).json({
        success: false,
        message: 'Address subdocument nahi mila.'
      });
    }

    if (label) addressSubdoc.label = label.trim();
    if (fullAddress) addressSubdoc.fullAddress = fullAddress.trim();
    if (zoneId !== undefined) addressSubdoc.zoneId = zoneId;

    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Saved address update ho gaya!',
      data: customer.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a saved address
// @route   DELETE /api/customers/me/addresses/:addressId
// @access  Private (Customer Only)
const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile nahi mili.'
      });
    }

    customer.addresses = customer.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Address delete ho gaya.',
      data: customer.addresses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  addAddress,
  updateAddress,
  deleteAddress
};
