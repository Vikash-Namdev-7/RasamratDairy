const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ['customer', 'admin'],
      required: true
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['order', 'subscription', 'system'],
      default: 'order'
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
