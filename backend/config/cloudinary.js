const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads directory at:", uploadDir);
}

const storage =
  process.env.NODE_ENV === "production"
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: function (req, file, cb) {
          const uploadDir = path.join(__dirname, "..", "uploads");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      });

const multerMiddleware = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
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
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
});

const uploadFileToCloudinary = async (file) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    let uploadResult;

    if (process.env.NODE_ENV === "production") {
      // For production (Vercel), upload buffer directly
      uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: file.mimetype.startsWith("video")
              ? "video"
              : "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
    } else {
      // For development, upload file path
      uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      });
      // Clean up the temporary file in development
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    }

    return uploadResult;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

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
