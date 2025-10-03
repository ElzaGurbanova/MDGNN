const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { execFile } = require('child_process');
const execFileAsync = promisify(execFile);
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Not an image! Please upload an image.'), false);
  }
});

router.post('/', protect, upload.single('file'), async (req, res) => {
  let imagePath;
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });

    imagePath = req.file.path;
    const language = (req.body.language || 'eng').toLowerCase();

    console.log('OCR Request:', {
      imagePath,
      language,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    // Three-letter language code (basic guard)
    if (!/^[a-z]{3}$/.test(language)) {
      return res.status(400).json({ message: 'Invalid language code' });
    }

    console.log(`Running tesseract with language: ${language}`);

    // Run tesseract without shell
    const { stdout, stderr } = await execFileAsync(
      'tesseract',
      [imagePath, 'stdout', '-l', language, '--psm', '3'],
      { windowsHide: true }
    );

    if (stderr && stderr.trim().length > 0) {
      console.warn('Tesseract stderr:', stderr);
    }

    const words = stdout.trim().split(/\s+/).filter(Boolean);
    const confidence = Math.min(100, Math.max(0, words.length * 5));

    console.log('OCR processing complete:', {
      confidence,
      wordCount: words.length,
      textLength: stdout.trim().length
    });

    return res.status(200).json({
      text: stdout.trim(),
      confidence
    });
  } catch (error) {
    console.error('OCR Error details:', error);
    return res.status(500).json({
      message: 'Error processing image',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (imagePath && fs.existsSync(imagePath)) {
      try { fs.unlinkSync(imagePath); } catch (_) {}
    }
  }
});

module.exports = router;

