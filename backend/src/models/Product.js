const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categorySlug: { type: String, required: true, lowercase: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    gallery: [{ type: String }],
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 1 },
    inStock: { type: Boolean, default: true },
    badge: { type: String, default: '' },
    description: { type: String, default: '' },
    nutrition: {
      fat: { type: String, default: '' },
      protein: { type: String, default: '' },
      calories: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
