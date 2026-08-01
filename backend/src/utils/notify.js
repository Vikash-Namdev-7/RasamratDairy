const Notification = require('../models/Notification');
const { getIO } = require('../socket');

/**
 * Send real-time notification to a specific Customer & save to DB
 */
async function notifyCustomer(customerId, { title, message, type = 'order', relatedId = null }) {
  try {
    const notification = await Notification.create({
      recipientType: 'customer',
      recipientId: customerId,
      title,
      message,
      type,
      relatedId,
      isRead: false
    });

    const io = getIO();
    if (io) {
      const room = `customer_${customerId}`;
      io.to(room).emit('notification', notification);
      console.log(`📡 Socket emitted notification to room '${room}': "${title}"`);
    }

    return notification;
  } catch (err) {
    console.error('❌ Failed to create/emit customer notification:', err.message);
    return null;
  }
}

/**
 * Send real-time notification to all Admins & save to DB
 */
async function notifyAdmin({ title, message, type = 'order', relatedId = null }) {
  try {
    const notification = await Notification.create({
      recipientType: 'admin',
      recipientId: null,
      title,
      message,
      type,
      relatedId,
      isRead: false
    });

    const io = getIO();
    if (io) {
      io.to('admin_room').emit('notification', notification);
      console.log(`📡 Socket emitted notification to 'admin_room': "${title}"`);
    }

    return notification;
  } catch (err) {
    console.error('❌ Failed to create/emit admin notification:', err.message);
    return null;
  }
}

module.exports = {
  notifyCustomer,
  notifyAdmin
};
