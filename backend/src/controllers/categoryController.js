const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/admin/categories
// @access  Private (Admin Only)
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, image, tagline } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Kripya Category Name aur Slug bharein.'
      });
    }

    const cleanSlug = slug.trim().toLowerCase();
    const existingCategory = await Category.findOne({ slug: cleanSlug });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Is slug ki category pehle se exist karti hai. Kripya naya slug use karein.'
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: cleanSlug,
      image: image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
      tagline: tagline ? tagline.trim() : ''
    });

    return res.status(201).json({
      success: true,
      message: 'Category successfully create ho gayi!',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category details
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin Only)
const updateCategory = async (req, res, next) => {
  try {
    const { name, slug, image, tagline } = req.body;

    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category nahi mili.'
      });
    }

    if (slug && slug.trim().toLowerCase() !== category.slug) {
      const cleanSlug = slug.trim().toLowerCase();
      const existing = await Category.findOne({ slug: cleanSlug });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Naya slug pehle se kisi doosri category me exist karta hai.'
        });
      }
    }

    const updatedData = {
      ...(name && { name: name.trim() }),
      ...(slug && { slug: slug.trim().toLowerCase() }),
      ...(image && { image }),
      ...(tagline !== undefined && { tagline: tagline.trim() })
    };

    category = await Category.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Category successfully update ho gayi!',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (blocked if linked products exist)
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin Only)
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category nahi mili.'
      });
    }

    // Check if any products belong to this category
    const linkedProductsCount = await Product.countDocuments({
      $or: [
        { categoryId: category._id },
        { categorySlug: category.slug }
      ]
    });

    if (linkedProductsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Is category se ${linkedProductsCount} linked products exist karte hain. Category delete karne se pehle un products ko doosri category me shift ya delete karein.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Category successfully delete ho gayi!'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
