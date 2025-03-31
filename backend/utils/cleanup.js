const fs = require("fs");
const path = require("path");

// Cleanup temporary files older than 1 hour
const cleanupTempFiles = () => {
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) return;

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading upload directory:", err);
      return;
    }

    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        if (stats.mtimeMs < oneHourAgo) {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting old file:", err);
          });
        }
      });
    });
  });
};

module.exports = { cleanupTempFiles };
