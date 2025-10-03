// Week 8: Secure File Handling
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Allowed file types
const ALLOWED_FILE_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "application/pdf": ".pdf",
};

// File size limits (in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Secure storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generate random filename to prevent directory traversal
    const randomName = crypto.randomBytes(16).toString("hex");
    const extension = ALLOWED_FILE_TYPES[file.mimetype];
    cb(null, `${randomName}${extension}`);
  },
});

// File filter to check file type and size
const fileFilter = (req, file, cb) => {
  // Check file type
  if (!ALLOWED_FILE_TYPES[file.mimetype]) {
    return cb(new Error("Invalid file type"), false);
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error("File size too large"), false);
  }

  cb(null, true);
};

// Configure multer with security settings
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Sanitize filename to prevent path traversal
const sanitizeFilename = (filename) => {
  return path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, "_");
};

module.exports = {
  upload,
  sanitizeFilename,
};
