const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rasamrat-dairy');
    console.log(`✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failure: ${error.message}`);
    console.error('Ensure local MongoDB service is running or check your MONGODB_URI in .env');
    process.exit(1);
  }
};

module.exports = connectDB;
