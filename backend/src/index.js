require('dotenv').config();
const express = require('express');
const cors = require('cors');

let helmet;
try {
  helmet = require('helmet');
} catch (e) {
  console.warn('⚠️ helmet module not installed yet. Run "npm install" in backend directory to activate.');
}

let rateLimit;
try {
  rateLimit = require('express-rate-limit');
} catch (e) {
  console.warn('⚠️ express-rate-limit module not installed yet. Run "npm install" in backend directory to activate.');
}

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const adminZoneRoutes = require('./routes/adminZoneRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const adminSubscriptionRoutes = require('./routes/adminSubscriptionRoutes');
const customerRoutes = require('./routes/customerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const http = require('http');
const { initSocket } = require('./socket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Initialize Socket.io Server
initSocket(server);

// Security HTTP Headers (if installed)
if (helmet) {
  app.use(helmet({ contentSecurityPolicy: false }));
}

// Rate Limiter for Auth Routes (if installed)
if (rateLimit) {
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      message: 'Too many auth requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use('/api/auth', authLimiter);
}

// Core Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Rasamrat Dairy API',
    timestamp: new Date()
  });
});

// API Routes (Public, Customer & Admin Protected)
app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/api/admin/products', adminProductRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);

app.use('/api/zones', zoneRoutes);
app.use('/api/admin/zones', adminZoneRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);

app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin/subscriptions', adminSubscriptionRoutes);

app.use('/api/customers', customerRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Start HTTP Server Listener (Express + Socket.io)
server.listen(PORT, () => {
  console.log(`🚀 Rasamrat Dairy Backend Server listening at http://localhost:${PORT}`);
});
