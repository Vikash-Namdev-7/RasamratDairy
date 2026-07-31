const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    addresses: [
      {
        label: { type: String, default: 'Home' },
        fullAddress: { type: String, required: true },
        zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
