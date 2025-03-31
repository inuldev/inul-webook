const express = require("express");
const cron = require("node-cron");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { cleanupTempFiles } = require("./utils/cleanup");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");
const passport = require("./controllers/googleController");
const StoryCleanupService = require("./services/storyCleanupService");

require("dotenv").config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

// Passport setup
app.use(passport.initialize());

// Routes
app.use("/auth", authRoute);
app.use("/users", postRoute);
app.use("/users", userRoute);
app.use(errorHandler);

// Handle root route
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running" });
});

// Initialize database, story cleanup, and temporary file cleanup
async function initializeServer() {
  try {
    await connectDb();

    // Clean up temporary files and expired stories every hour
    cron.schedule("0 * * * *", () => {
      cleanupTempFiles();
      console.log("Temporary files cleaned up");
      StoryCleanupService.cleanupExpiredStories();
      console.log("Expired stories cleaned up");
    });

    // Initial cleanup
    cleanupTempFiles();
    StoryCleanupService.cleanupExpiredStories();

    // Start server if not in production
    if (process.env.NODE_ENV !== "production") {
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
    }
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

initializeServer();

// Export app for Vercel deployment
module.exports = app;
