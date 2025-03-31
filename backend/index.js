// Import required modules and configuration files
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDb = require("./config/db");
require("dotenv").config();
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");
const passport = require("./controllers/googleController");

// Create an Express app instance and configure middleware
const app = express();

// Connect to MongoDB only when handling requests
let isConnected = false;
const connectToDatabase = async () => {
  if (!isConnected) {
    await connectDb();
    isConnected = true;
  }
};

app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(passport.initialize());

app.use("/auth", authRoute);
app.use("/users", postRoute);
app.use("/users", userRoute);

// Handle root route
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running" });
});

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`server listening on ${PORT}`));
}

// Export for Vercel
module.exports = app;
