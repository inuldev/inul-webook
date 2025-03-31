const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileToCloudinary = (file) => {
  const options = {
    resource_type: file.mimetype.startsWith("video") ? "video" : "image",
    chunk_size: 6000000, // 6MB chunks for better upload handling
  };

  return new Promise((resolve, reject) => {
    if (file.mimetype.startsWith("video")) {
      // For videos, use upload_large with a higher limit
      cloudinary.uploader.upload_large(
        file.path,
        {
          ...options,
          resource_type: "video",
          max_bytes: 100 * 1024 * 1024, // 100MB limit for videos
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    } else {
      // For images, use regular upload with a lower limit
      cloudinary.uploader.upload(
        file.path,
        {
          ...options,
          resource_type: "image",
          max_bytes: 10 * 1024 * 1024, // 10MB limit for images
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    }
  });
};

// Use Cloudinary storage instead of local storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov"],
  },
});

const multerMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

module.exports = { multerMiddleware, uploadFileToCloudinary };
