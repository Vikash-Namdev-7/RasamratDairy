const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    milkTypeId: { type: String, required: true },
    milkTypeName: { type: String, default: '' },
    litres: { type: Number, required: true },
    slot: { type: String, enum: ['morning', 'evening'], required: true },
    status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
    pausedDates: [{ type: String }],
    startDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
