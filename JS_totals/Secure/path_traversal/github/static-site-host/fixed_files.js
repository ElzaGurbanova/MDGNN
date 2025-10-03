const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

// Configure and canonicalize storage directory
const siteFilesDir = process.env.SITE_FILES_DIR || './site_files';
const SITE_ROOT = fsSync.realpathSync(path.resolve(siteFilesDir));
fsSync.mkdirSync(SITE_ROOT, { recursive: true });

// Strict filename sanitizer: strip path parts + tame chars
function sanitizeName(name) {
  const base = path.basename(name || 'file');               // drop any path
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200); // squash weird chars & cap length
}

// Allowed web file types
const allowedTypes = [
  '.html', '.css', '.js', '.json', '.txt', '.md',
  '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
  '.pdf', '.ico', '.xml', '.woff', '.woff2', '.ttf', '.eot'
];

// Multer storage (locked to SITE_ROOT)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, SITE_ROOT),
  filename: (req, file, cb) => cb(null, sanitizeName(file.originalname))
});

// File filter: decide by sanitized basename’s extension
const fileFilter = (req, file, cb) => {
  const ext = path.extname(sanitizeName(file.originalname)).toLowerCase();
  if (allowedTypes.includes(ext)) cb(null, true);
  else cb(new Error(`File type not allowed: ${ext}`));
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

/**
 * @route GET /api/files
 * @desc Get a list of all files in the site directory
 */
router.get('/', async (req, res, next) => {
  try {
    const files = await fs.readdir(SITE_ROOT);
    const fileDetails = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(SITE_ROOT, filename);
        const stats = await fs.stat(filePath);
        return {
          name: filename,
          size: stats.size,
          modified: stats.mtime,
          url: `/site/${filename}`
        };
      })
    );
    res.json(fileDetails);
  } catch (err) { next(err); }
});

/**
 * @route POST /api/files/upload
 * @desc Upload one or more files for the static site
 */
router.post('/upload', upload.array('files'), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    // Use file.filename (the sanitized on-disk name), not originalname
    const uploadedFiles = req.files.map(file => ({
      name: file.filename,
      size: file.size,
      url: `/site/${file.filename}`
    }));
    res.status(201).json({
      message: `Successfully uploaded ${req.files.length} file(s)`,
      files: uploadedFiles
    });
  } catch (err) { next(err); }
});

/**
 * @route DELETE /api/files/:filename
 * @desc Delete a specific file from the static site
 */
router.delete('/:filename', async (req, res, next) => {
  try {
    const sanitizedFilename = sanitizeName(req.params.filename);
    const filePath = path.join(SITE_ROOT, sanitizedFilename);
    await fs.access(filePath);
    await fs.unlink(filePath);
    res.json({ message: `Successfully deleted ${sanitizedFilename}` });
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).json({ error: 'File not found' });
    next(err);
  }
});

/**
 * @route GET /api/files/:filename
 * @desc Get information about a specific file
 */
router.get('/:filename', async (req, res, next) => {
  try {
    const sanitizedFilename = sanitizeName(req.params.filename);
    const filePath = path.join(SITE_ROOT, sanitizedFilename);
    const stats = await fs.stat(filePath);
    res.json({
      name: sanitizedFilename,
      size: stats.size,
      modified: stats.mtime,
      url: `/site/${sanitizedFilename}`
    });
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).json({ error: 'File not found' });
    next(err);
  }
});

module.exports = router;

