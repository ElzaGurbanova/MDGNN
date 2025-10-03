/**
 * File System Router
 *
 * Handles routes related to file system operations like browsing directories
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// ---- NEW: restrict browsing to a base directory (env-settable)
const BASE_DIR = path.resolve(process.env.MEMGRAPH_ROOT || path.join(__dirname, '..')); // choose an app-owned root

function safeInsideBase(candidate) {
  const baseReal = fs.realpathSync(BASE_DIR);
  const candReal = fs.existsSync(candidate) ? fs.realpathSync(candidate) : candidate;
  const rel = path.relative(baseReal, candReal);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

/**
 * @route   GET /browse
 * @desc    Browse directory and list files with optional filtering
 * @access  Public (but sandboxed to BASE_DIR)
 */
router.get('/browse', (req, res) => {
  console.log('==== [API] GET /api/browse request received ====');

  const requestedPath = String(req.query.path || '/');
  const filter = String(req.query.filter || '');
  console.log(`[API] Browsing directory: ${requestedPath}, filter: ${filter}`);

  // Map client path to BASE_DIR safely; '.' prevents absolute override
  const targetDir = path.resolve(BASE_DIR, '.' + requestedPath.replace(/\\/g, '/'));

  // Enforce containment (no traversal outside BASE_DIR)
  if (!safeInsideBase(targetDir)) {
    console.error('[API] Error: Path outside allowed base');
    return res.status(400).json({
      error: 'Invalid path',
      details: 'Path is outside the allowed base directory'
    });
  }

  // Read directory contents
  fs.readdir(targetDir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error('[API] Error reading directory:', err.message);
      return res.status(500).json({
        error: 'Cannot read directory',
        details: err.message
      });
    }

    const files = [];
    const directories = [];

    // Add parent directory if not at base
    const baseReal = fs.realpathSync(BASE_DIR);
    const hereReal = fs.realpathSync(targetDir);
    if (hereReal !== baseReal) {
      const parent = path.dirname(hereReal);
      // only add parent if still inside base
      if (safeInsideBase(parent)) {
        directories.push({
          name: '..',
          path: parent,
          type: 'directory',
          isParent: true
        });
      }
    }

    entries.forEach(entry => {
      try {
        const entryPath = path.join(targetDir, entry.name);

        // Skip hidden files/dirs
        if (entry.name.startsWith('.')) return;

        // Only include entries that stay under base (symlink defense)
        if (!safeInsideBase(entryPath)) return;

        if (entry.isDirectory()) {
          directories.push({
            name: entry.name,
            path: entryPath,
            type: 'directory'
          });
        } else if (entry.isFile()) {
          if (filter && !entry.name.endsWith(filter)) return;

          const stat = fs.statSync(entryPath);
          files.push({
            name: entry.name,
            path: entryPath,
            type: 'file',
            size: stat.size,
            extension: path.extname(entry.name)
          });
        }
      } catch (error) {
        console.warn(`[API] Error processing entry ${entry.name}:`, error.message);
      }
    });

    directories.sort((a, b) => {
      if (a.isParent) return -1;
      if (b.isParent) return 1;
      return a.name.localeCompare(b.name);
    });
    files.sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      current_path: hereReal,
      is_root: hereReal === baseReal,
      parent_path: hereReal !== baseReal ? path.dirname(hereReal) : null,
      directories,
      files,
      filter
    });
  });
});

module.exports = router;

