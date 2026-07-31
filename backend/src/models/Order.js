const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, default: 1 }
      }
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    totalPayable: { type: Number, required: true },
    zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
    zoneName: { type: String, default: '' },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'out-for-delivery', 'delivered', 'rejected'],
      default: 'pending'
    },
    deliveryTime: { type: String, default: null },
    rejectReason: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
