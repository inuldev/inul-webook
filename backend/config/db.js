// Import required modules and configuration files
const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = false;

const connectDb = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
      socketTimeoutMS: 45000, // Increase socket timeout
    });

    isConnected = true;
    console.log("Database connection established");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    isConnected = false;
    throw error; // Propagate the error
  }
};

module.exports = connectDb;
