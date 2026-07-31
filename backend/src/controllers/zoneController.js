const Zone = require('../models/Zone');

// @desc    Get all delivery zones
// @route   GET /api/zones
// @access  Public
const getAllZones = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const query = includeInactive === 'true' ? {} : { isActive: true };
    const zones = await Zone.find(query).sort({ minOrderAmount: 1 });

    return res.status(200).json({
      success: true,
      count: zones.length,
      data: zones
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new delivery zone
// @route   POST /api/admin/zones
// @access  Private (Admin Only)
const createZone = async (req, res, next) => {
  try {
    const { name, distanceLabel, minOrderAmount, deliveryFee, description, isActive } = req.body;

    if (!name || minOrderAmount === undefined || deliveryFee === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Kripya required fields (name, minOrderAmount, deliveryFee) bharein.'
      });
    }

    const zone = await Zone.create({
      name: name.trim(),
      distanceLabel: distanceLabel ? distanceLabel.trim() : '0-1 km',
      minOrderAmount: Number(minOrderAmount),
      deliveryFee: Number(deliveryFee),
      description: description ? description.trim() : '',
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    return res.status(201).json({
      success: true,
      message: 'Delivery Zone successfully add ho gayi!',
      data: zone
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery zone details
// @route   PUT /api/admin/zones/:id
// @access  Private (Admin Only)
const updateZone = async (req, res, next) => {
  try {
    const { name, distanceLabel, minOrderAmount, deliveryFee, description, isActive } = req.body;

    let zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Delivery Zone nahi mili.'
      });
    }

    const updatedData = {
      ...(name && { name: name.trim() }),
      ...(distanceLabel && { distanceLabel: distanceLabel.trim() }),
      ...(minOrderAmount !== undefined && { minOrderAmount: Number(minOrderAmount) }),
      ...(deliveryFee !== undefined && { deliveryFee: Number(deliveryFee) }),
      ...(description !== undefined && { description: description.trim() }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) })
    };

    zone = await Zone.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Delivery Zone successfully update ho gayi!',
      data: zone
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete delivery zone
// @route   DELETE /api/admin/zones/:id
// @access  Private (Admin Only)
const deleteZone = async (req, res, next) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Delivery Zone nahi mili.'
      });
    }

    await Zone.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Delivery Zone successfully delete ho gayi!'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllZones,
  createZone,
  updateZone,
  deleteZone
};
