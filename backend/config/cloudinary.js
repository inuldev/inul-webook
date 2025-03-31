// Import required modules
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Load environment variables from .env file
require("dotenv").config();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create uploads directory in the backend root
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads directory at:", uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Unique filename
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to allow only image and video files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/quicktime",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, WEBP, and MP4 files are allowed."
      ),
      false
    );
  }
};

// Configure multer middleware with custom options
const multerMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
});

// Upload file to Cloudinary and delete the temporary file
const uploadFileToCloudinary = async (file) => {
  try {
    if (!file || !file.path) {
      throw new Error("No file provided");
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
    });

    // Clean up the temporary file
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });

    return result;
  } catch (error) {
    // Clean up the temporary file in case of error
    if (file && file.path) {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    }
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

// Delete file from Cloudinary
const deleteFileFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw error;
  }
};

// Extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  try {
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split(".")[0]; // Remove file extension
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
};

module.exports = {
  multerMiddleware,
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
  getPublicIdFromUrl,
};
