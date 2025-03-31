const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File is too large. Maximum size is 100MB",
      });
    }
    return res.status(400).json({
      success: false,
      message: "File upload error: " + err.message,
    });
  }

  if (err.message.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

module.exports = errorHandler;
