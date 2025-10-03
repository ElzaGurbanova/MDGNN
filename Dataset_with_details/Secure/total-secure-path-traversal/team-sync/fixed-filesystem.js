const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const authenticate = require('../middlewares/authenticate');

// ---- helpers (minimal additions)
const uploadsRoot = path.resolve(__dirname, '../uploads');

function assertProjectId(id) {
  const pid = String(id || 'default-project');
  if (!/^[A-Za-z0-9_-]+$/.test(pid)) throw new Error('Invalid project id');
  return pid;
}
function safeResolve(base, seg = '') {
  const target = path.resolve(base, seg);
  const rel = path.relative(base, target);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error('Invalid path');
  }
  return target;
}
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const projectId = assertProjectId(req.params.projectId);
      const projectDir = safeResolve(uploadsRoot, projectId);
      ensureDir(projectDir);

      const bodyDir = req.body.directory ? req.body.directory : '';
      let targetDir = projectDir;
      if (bodyDir) {
        targetDir = safeResolve(projectDir, bodyDir);
        ensureDir(targetDir);
      }
      cb(null, targetDir);
    } catch (e) {
      cb(new Error('Invalid upload directory'));
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Helper function to get file info
const getFileInfo = (filePath, basePath) => {
  const stats = fs.statSync(filePath);
  const relativePath = path.relative(basePath, filePath).replace(/\\/g, '/');
  const name = path.basename(filePath);
  return {
    name,
    path: relativePath || name,
    isDirectory: stats.isDirectory(),
    size: stats.size,
    modified: stats.mtime
  };
};

// Helper function to read directory recursively
const readDirRecursive = (dirPath, basePath, maxDepth = 3, currentDepth = 0) => {
  if (currentDepth > maxDepth) return [];
  const items = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const fileInfo = getFileInfo(fullPath, basePath);
    if (entry.isDirectory()) {
      fileInfo.children = currentDepth < maxDepth
        ? readDirRecursive(fullPath, basePath, maxDepth, currentDepth + 1)
        : [];
    }
    items.push(fileInfo);
  }
  return items;
};

// List files in a project directory
router.get('/list/:projectId', authenticate, (req, res) => {
  try {
    const projectId = assertProjectId(req.params.projectId);
    const dir = String(req.query.dir || '');
    const projectDir = safeResolve(uploadsRoot, projectId);
    const targetDir = safeResolve(projectDir, dir);

    if (!fs.existsSync(targetDir)) {
      return res.status(404).json({ success: false, message: 'Directory not found' });
    }
    const files = readDirRecursive(targetDir, projectDir);
    res.json({ success: true, currentDir: dir, files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ success: false, message: 'Failed to list files: ' + error.message });
  }
});

// Get file content
router.get('/content/:projectId', authenticate, (req, res) => {
  try {
    const projectId = assertProjectId(req.params.projectId);
    const relPath = String(req.query.path || '');
    const projectDir = safeResolve(uploadsRoot, projectId);
    const fullPath = safeResolve(projectDir, relPath);

    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    res.json({ success: true, content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ success: false, message: 'Failed to read file: ' + error.message });
  }
});

// Save file content
router.put('/save/:projectId', authenticate, (req, res) => {
  try {
    const projectId = assertProjectId(req.params.projectId);
    const relPath = String(req.body.path || '');
    const content = req.body.content;
    if (relPath === '' || content === undefined) {
      return res.status(400).json({ success: false, message: 'File path and content are required' });
    }
    const projectDir = safeResolve(uploadsRoot, projectId);
    const fullPath = safeResolve(projectDir, relPath);

    ensureDir(path.dirname(fullPath));
    fs.writeFileSync(fullPath, content, 'utf8');
    res.json({ success: true, message: 'File saved successfully' });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ success: false, message: 'Failed to save file: ' + error.message });
  }
});

// Upload a single file
router.post('/upload/:projectId', authenticate, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: req.file.originalname,
        path: req.body.directory ? `${req.body.directory}/${req.file.originalname}` : req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Failed to upload file: ' + error.message });
  }
});

// Upload multiple files (for folder upload)
router.post('/upload-multiple/:projectId', authenticate, (req, res) => {
  try {
    const projectId = assertProjectId(req.params.projectId);
    const baseDir = safeResolve(uploadsRoot, projectId);
    ensureDir(baseDir);

    const customStorage = multer.diskStorage({
      destination: function (req, file, cb) {
        try {
          let filePath = file.originalname;
          const filePaths = req.body.filePaths;

          const idx = filePaths
            ? (Array.isArray(filePaths)
                ? filePaths.findIndex(p => p.endsWith(file.originalname))
                : (String(filePaths).endsWith(file.originalname) ? 0 : -1))
            : -1;

          if (idx !== -1) {
            filePath = Array.isArray(filePaths) ? filePaths[idx] : filePaths;
          }

          const directory = path.dirname(filePath);
          const combined = path.join(req.body.directory || '', directory === '.' ? '' : directory);
          const targetDir = safeResolve(baseDir, combined);
          ensureDir(targetDir);
          cb(null, targetDir);
        } catch (e) {
          cb(new Error('Invalid upload path'));
        }
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      }
    });

    const upload = multer({ storage: customStorage }).array('files');

    upload(req, res, function (err) {
      if (err) {
        console.error('Error in multer upload:', err);
        return res.status(500).json({ success: false, message: 'Failed to upload files: ' + err.message });
      }
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
      }
      const uploadedFiles = req.files.map(file => {
        const relativePath = path.relative(baseDir, file.path).replace(/\\/g, '/');
        return { name: file.originalname, path: relativePath, size: file.size };
      });
      res.json({ success: true, message: `${req.files.length} files uploaded successfully`, files: uploadedFiles });
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ success: false, message: 'Failed to upload files: ' + error.message });
  }
});

// Create a new directory
router.post('/mkdir/:projectId', authenticate, (req, res) => {
  try {
    const projectId = assertProjectId(req.params.projectId);
    const relDir = String(req.body.path || '');
    const fullPath = safeResolve(safeResolve(uploadsRoot, projectId), relDir);

    if (fs.existsSync(fullPath)) {
      return res.status(400).json({ success: false, message: 'Directory already exists' });
    }
    fs.mkdirSync(fullPath, { recursive: true });
    res.json({ success: true, message: 'Directory created successfully', path: relDir });
  } catch (error) {
    console.error('Error creating directory:', error);
    res.status(500).json({ success: false, message: 'Failed to create directory: ' + error.message });
  }
});

// Delete a file or directory
router.delete('/:projectId', authenticate, (req, res) => {
  try {
    const projectId = assertProjectId(req.params.projectId);
    const relPath = String(req.body.path || '');
    const isDirectory = !!req.body.isDirectory;
    const fullPath = safeResolve(safeResolve(uploadsRoot, projectId), relPath);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    if (isDirectory) {
      fs.rmdirSync(fullPath, { recursive: true });
    } else {
      fs.unlinkSync(fullPath);
    }
    res.json({ success: true, message: `${isDirectory ? 'Directory' : 'File'} deleted successfully` });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete item: ' + error.message });
  }
});

// Rename a file or directory
router.put('/rename/:projectId', authenticate, (req, res) => {
  try {
    const projectId = assertProjectId(req.params.projectId);
    const oldRel = String(req.body.oldPath || '');
    const newRel = String(req.body.newPath || '');
    const base = safeResolve(uploadsRoot, projectId);
    const fullOldPath = safeResolve(base, oldRel);
    const fullNewPath = safeResolve(base, newRel);

    if (!fs.existsSync(fullOldPath)) {
      return res.status(404).json({ success: false, message: 'Source item not found' });
    }
    if (fs.existsSync(fullNewPath)) {
      return res.status(400).json({ success: false, message: 'Destination already exists' });
    }
    ensureDir(path.dirname(fullNewPath));
    fs.renameSync(fullOldPath, fullNewPath);
    res.json({ success: true, message: 'Item renamed successfully', oldPath: oldRel, newPath: newRel });
  } catch (error) {
    console.error('Error renaming item:', error);
    res.status(500).json({ success: false, message: 'Failed to rename item: ' + error.message });
  }
});

module.exports = router;

