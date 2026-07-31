require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');

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

// API Routes
app.use('/api/auth', authRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server Listener
app.listen(PORT, () => {
  console.log(`🚀 Rasamrat Dairy Backend Server listening at http://localhost:${PORT}`);
});
