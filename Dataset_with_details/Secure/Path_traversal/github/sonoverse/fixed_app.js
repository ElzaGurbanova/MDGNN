const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ------------------------------------------------------------------
// Uploads base (canonical) and helpers for containment checks
const fs = require('fs');
const uploadsBase = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsBase)) {
  fs.mkdirSync(uploadsBase, { recursive: true });
}

function isInside(base, target) {
  const rel = path.relative(base, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}
// ------------------------------------------------------------------

// Guard: prevent path/symlink traversal for static /uploads
function uploadsStaticGuard(req, res, next) {
  try {
    // In a mounted middleware, req.url is the path *below* /uploads
    const urlPath = decodeURIComponent((req.url || '').split('?')[0] || '/');
    const candidate = path.resolve(uploadsBase, '.' + urlPath);

    // First-level containment (blocks absolute override / ..)
    if (!isInside(uploadsBase, candidate)) {
      return res.status(400).json({ success: false, error: { message: 'Invalid uploads path' } });
    }

    // If the target exists, ensure its *real* path remains inside base (blocks symlink escape)
    try {
      const realBase = fs.realpathSync(uploadsBase);
      const realTarget = fs.realpathSync(candidate);
      if (!isInside(realBase, realTarget)) {
        return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
      }
    } catch (e) {
      // If it doesn't exist yet, let express.static handle 404 later.
      // We still validated the resolved (non-real) path above.
    }

    return next();
  } catch (e) {
    return res.status(400).json({ success: false, error: { message: 'Bad request' } });
  }
}

// Serve static files from uploads directory, with guard
app.use('/uploads', uploadsStaticGuard, express.static(uploadsBase));

// Routes
const requestsRouter = require('./routes/requests');
const uploadController = require('./controllers/uploadController');
const upload = require('./middleware/uploadMiddleware');

// Path traversal protection middleware (hardened with realpath check)
const pathTraversalProtection = (req, res, next) => {
  const name = req.params.filename;

  // Basic segment validation (single file name, no separators)
  if (
    !name ||
    typeof name !== 'string' ||
    name.includes('..') ||
    name.includes('/') ||
    name.includes('\\')
  ) {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid filename - path traversal attempt detected', code: 'VALIDATION_ERROR' }
    });
  }

  // Symlink/escape check for the final target
  try {
    const target = path.resolve(uploadsBase, name);
    if (!isInside(uploadsBase, target)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid filename', code: 'VALIDATION_ERROR' }
      });
    }

    // If file exists, ensure the *real* target is still under uploads (blocks symlink escape)
    if (fs.existsSync(target)) {
      const realBase = fs.realpathSync(uploadsBase);
      const realTarget = fs.realpathSync(target);
      if (!isInside(realBase, realTarget)) {
        return res.status(403).json({
          success: false,
          error: { message: 'Forbidden', code: 'FORBIDDEN' }
        });
      }
    }

    // Optionally expose a safe absolute path for downstream controller
    res.locals.safeUploadPath = target;
    return next();
  } catch (e) {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid filename', code: 'VALIDATION_ERROR' }
    });
  }
};

// API Routes
app.use('/api/v1/requests', requestsRouter);
app.post('/api/v1/uploads', upload.upload.single('audio'), uploadController.uploadAudio);
app.get('/api/v1/uploads/:filename', pathTraversalProtection, uploadController.streamAudio);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;

