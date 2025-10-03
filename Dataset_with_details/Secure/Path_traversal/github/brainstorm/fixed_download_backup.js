/**
 * Download Backup API Handler
 * GET /api/backups/download?file=<name>.zip
 *
 * Streams the requested .zip file from the backups directory.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function defaultBackupBaseDir() {
  const base = '/var/lib/brainstorm/backups';
  try {
    if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
    return base;
  } catch (e) {
    const homeBase = path.join(os.homedir(), 'brainstorm-backups');
    if (!fs.existsSync(homeBase)) fs.mkdirSync(homeBase, { recursive: true });
    return homeBase;
  }
}

async function handleDownloadBackup(req, res) {
  try {
    const { file } = req.query || {};
    if (!file) return res.status(400).json({ success: false, error: 'Missing file parameter' });

    // Prevent path traversal; only allow basename and .zip files
    const safeName = path.basename(String(file));
    if (!safeName.toLowerCase().endsWith('.zip')) {
      return res.status(400).json({ success: false, error: 'Only .zip files are downloadable' });
    }

    const dir = defaultBackupBaseDir();
    const base = path.resolve(dir);
    const target = path.resolve(base, safeName);

    if (!fs.existsSync(target)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    // **Fix 1: reject symlinks**
    const lst = fs.lstatSync(target);
    if (lst.isSymbolicLink()) {
      return res.status(400).json({ success: false, error: 'Invalid file (symlink not allowed)' });
    }

    // **Fix 2: canonicalize and ensure still inside base**
    const realBase = fs.realpathSync(base);
    const realTarget = fs.realpathSync(target);
    const rel = path.relative(realBase, realTarget);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      return res.status(400).json({ success: false, error: 'Invalid file path' });
    }

    // Must be a regular file after resolving
    if (!fs.statSync(realTarget).isFile()) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    return res.download(realTarget, safeName);
  } catch (error) {
    console.error('Error downloading backup:', error);
    return res.status(500).json({ success: false, error: 'Failed to download backup' });
  }
}

module.exports = { handleDownloadBackup };

