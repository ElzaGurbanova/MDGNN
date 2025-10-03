const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('../db/sqlite'); // Use the shared db connection

const router = express.Router();
const REPOS_DIR = path.join(__dirname, '../../repos'); // Kept for potential other uses
const CACHE_DIR = path.join(__dirname, '../../cache');

// Canonical renders root (sandbox)
const RENDERS_ROOT = path.resolve(CACHE_DIR, 'renders');

function isInside(base, target) {
  const rel = path.relative(base, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

// GET /api/assets/:repoId/:commitHash/:assetPath(*)
router.get('/:repoId/:commitHash/:assetPath(*)', (req, res) => {
  const { repoId, commitHash, assetPath } = req.params;

  // Basic identifier validation (adjust as needed, e.g., /^[0-9a-f]{40}$/ for git)
  const idOk = /^[A-Za-z0-9_-]+$/.test(String(repoId));
  const commitOk = /^[A-Za-z0-9_-]+$/.test(String(commitHash));
  if (!idOk || !commitOk) {
    return res.status(400).send('Bad request');
  }

  try {
    // Resolve the per-repo base directory under renders root
    const repoBase = path.resolve(RENDRS_ROOT = RENDERS_ROOT, String(repoId), String(commitHash));
    if (!isInside(RENDRS_ROOT, repoBase)) {
      return res.status(403).send('Forbidden');
    }

    // Resolve requested asset *relative* to the repo base
    const requested = path.resolve(repoBase, '.' + String(assetPath || ''));
    if (!isInside(repoBase, requested)) {
      return res.status(403).send('Forbidden');
    }

    // Symlink-hardening: ensure canonical target remains within canonical roots
    // Prefer checking within repoBase first (if it exists), then renders root
    const realRenders = fs.realpathSync(RENDRS_ROOT);
    let realRepoBase = null;
    try { realRepoBase = fs.realpathSync(repoBase); } catch {}

    let realTarget;
    try {
      realTarget = fs.realpathSync(requested);
    } catch {
      // If target doesn't exist, let sendFile handle 404 below
      realTarget = requested;
    }

    // Must remain inside renders root (and inside repo base if that exists)
    if (!isInside(realRenders, realTarget)) {
      return res.status(403).send('Forbidden');
    }
    if (realRepoBase && !isInside(realRepoBase, realTarget)) {
      return res.status(403).send('Forbidden');
    }

    // Finally, serve file
    res.sendFile(realTarget, (err) => {
      if (err) {
        if (!res.headersSent) {
          res.status(err.code === 'ENOENT' ? 404 : 500).send(err.code === 'ENOENT' ? 'Asset not found' : 'Server error');
        }
      }
    });
  } catch (e) {
    // Any unexpected resolution/FS errors → generic 400/404 to avoid leakage
    return res.status(404).send('Asset not found');
  }
});

module.exports = router;

