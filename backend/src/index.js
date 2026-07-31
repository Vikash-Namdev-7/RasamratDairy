require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const adminZoneRoutes = require('./routes/adminZoneRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

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

// API Routes (Public & Admin Protected)
app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/api/admin/products', adminProductRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);

app.use('/api/zones', zoneRoutes);
app.use('/api/admin/zones', adminZoneRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server Listener
app.listen(PORT, () => {
  console.log(`🚀 Rasamrat Dairy Backend Server listening at http://localhost:${PORT}`);
});
