const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Canonical uploads root (used for validation of served file paths)
const UPLOADS_ROOT = fs.realpathSync(path.resolve('uploads'));

/**
 * Sanitizes a filename to remove unsafe characters
 * @param {string} filename - The original filename
 * @returns {string} The sanitized filename
 */
const sanitizeFilename = (filename) => {
  // Remove any path components
  const basename = path.basename(String(filename || ''));

  // Remove special characters and spaces, keep only alphanumeric, dash, underscore, and dot
  const sanitized = basename.replace(/[^a-zA-Z0-9\-_\.]/g, '_');

  // Ensure the filename doesn't start with a dot (hidden file)
  return sanitized.replace(/^\.+/, '');
};

// Storage configuration for file location and naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    try {
      // Generate a random string for added security
      const randomString = crypto.randomBytes(8).toString('hex');

      // Get the file extension and sanitize it
      const originalExt = path.extname(file.originalname).toLowerCase();
      const safeExt = ['.mp3', '.wav', '.ogg', '.flac', '.m4a'].includes(originalExt)
        ? originalExt
        : '.mp3'; // Default to .mp3 if extension is not recognized

      // Sanitize the original filename (without extension)
      const originalName = path.basename(file.originalname, path.extname(file.originalname));
      const safeName = sanitizeFilename(originalName).substring(0, 50); // Limit length

      // Sanitize requestId to avoid path injection
      const safeRequestId = sanitizeFilename(req.body?.requestId || 'audio').substring(0, 50);

      // Generate the final filename
      const timestamp = Date.now();
      let finalFilename = `${safeRequestId}-${safeName}-${timestamp}-${randomString}${safeExt}`;

      // Belt & suspenders: ensure no path separators slip through
      finalFilename = finalFilename.replace(/[\\/]+/g, '_');

      cb(null, finalFilename);
    } catch (e) {
      cb(e);
    }
  }
});

// File filter for allowed audio formats
const fileFilter = (req, file, cb) => {
  // Expanded list of allowed audio MIME types
  const allowedTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/ogg',
    'audio/flac',
    'audio/x-flac',
    'audio/mp4',
    'audio/m4a',
    'audio/x-m4a'
  ];

  // Check file extension as well
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.m4a'];

  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only MP3, WAV, OGG, FLAC, and M4A files are allowed.');
    error.code = 'VALIDATION_ERROR';
    cb(error, false);
  }
};

// Add file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  }
});

// Middleware to validate file paths (for download/serve routes)
// Ensures the resolved file is inside UPLOADS_ROOT and defends against symlinks
const validateFilePath = (req, res, next) => {
  try {
    const raw = String(req.params.filename || '');

    // quick rejects
    if (!raw || raw.includes('\0')) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Invalid filename' },
      });
    }

    // Disallow absolute paths and drive letters
    if (path.isAbsolute(raw) || /^[A-Za-z]:[\\/]/.test(raw)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Invalid filename' },
      });
    }

    // Normalize separators
    const candidateRel = raw.replace(/\\/g, '/');

    // Build candidate under uploads root
    const candidate = path.join(UPLOADS_ROOT, candidateRel);

    // Resolve real path (follows symlinks)
    const real = fs.realpathSync(candidate);

    // Containment check
    const rel = path.relative(UPLOADS_ROOT, real);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Invalid filename' },
      });
    }

    // Attach the resolved path if the downstream handler wants it
    req.resolvedFilePath = real;
    next();
  } catch {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Invalid filename' },
    });
  }
};

module.exports = { upload, validateFilePath, sanitizeFilename };

