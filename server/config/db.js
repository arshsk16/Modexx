// config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Accept MONGODB_URI or PASSDB (both supported)
    const mongoURI = process.env.MONGODB_URI || process.env.PASSDB;

    if (!mongoURI) {
      throw new Error("MongoDB URI not provided. Add MONGODB_URI or PASSDB to your .env file.");
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI);

    console.log("MongoDB connected ✔");
  } catch (err) {
    console.error("MongoDB connection error ❌", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
