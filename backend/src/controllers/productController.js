const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products (with optional filtering)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const { category, search, inStock } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.categorySlug = category;
    }

    if (inStock === 'true') {
      query.inStock = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categorySlug: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product nahi mila.'
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private (Admin Only)
const createProduct = async (req, res, next) => {
  try {
    const { name, categorySlug, price, unit, image, badge, description, inStock } = req.body;

    if (!name || !categorySlug || !price || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Kripya required fields (name, categorySlug, price, unit) bharein.'
      });
    }

    // Find linked category
    const categoryDoc = await Category.findOne({ slug: categorySlug });

    const product = await Product.create({
      name: name.trim(),
      categorySlug: categorySlug.trim(),
      categoryId: categoryDoc ? categoryDoc._id : null,
      price: Number(price),
      unit: unit.trim(),
      image: image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
      badge: badge ? badge.trim() : '',
      description: description ? description.trim() : '',
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      rating: 4.8,
      reviewCount: 0
    });

    return res.status(201).json({
      success: true,
      message: 'Product successfully create ho gaya!',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details
// @route   PUT /api/admin/products/:id
// @access  Private (Admin Only)
const updateProduct = async (req, res, next) => {
  try {
    const { name, categorySlug, price, unit, image, badge, description, inStock } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product nahi mila.'
      });
    }

    let categoryId = product.categoryId;
    if (categorySlug) {
      const categoryDoc = await Category.findOne({ slug: categorySlug });
      if (categoryDoc) categoryId = categoryDoc._id;
    }

    const updatedData = {
      ...(name && { name: name.trim() }),
      ...(categorySlug && { categorySlug: categorySlug.trim(), categoryId }),
      ...(price !== undefined && { price: Number(price) }),
      ...(unit && { unit: unit.trim() }),
      ...(image && { image }),
      ...(badge !== undefined && { badge: badge.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(inStock !== undefined && { inStock: Boolean(inStock) })
    };

    product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Product successfully update ho gaya!',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin Only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product nahi mila.'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product successfully delete ho gaya!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product inStock status
// @route   PATCH /api/admin/products/:id/stock
// @access  Private (Admin Only)
const toggleStock = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product nahi mila.'
      });
    }

    product.inStock = !product.inStock;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product ab ${product.inStock ? 'In Stock' : 'Out of Stock'} mark ho gaya!`,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStock
};
