const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const router = express.Router();

const { FlagsTbl, ChallengesTbl, ProjectsTbl } = require('../models');
const validateFlag = require('../middleware/flagValidation');

function sha256sum(string) {
  return crypto.createHash('sha256').update(string).digest('hex');
}

function filePathExists(filepath) {
  const absPath = path.resolve(filepath);
  return fs.existsSync(absPath);
}

// Canonical base for downloadable files (defends against symlink escapes)
const FILES_ROOT = fs.realpathSync(path.join(__dirname, '../files'));

router.get('/download/:fileName', (req, res) => {
  try {
    // Keep to a simple basename, strip leading dots to avoid odd hidden names
    const raw = String(req.params.fileName || '');
    const fileName = path.basename(raw).replace(/^\.+/, '');
    if (!fileName) {
      return res.status(400).json({ success: false, message: 'Invalid file name' });
    }

    // Build candidate path under the canonical root
    const candidate = path.join(FILES_ROOT, fileName);
    if (!fs.existsSync(candidate)) {
      return res.status(404).json({ success: false });
    }

    // Resolve the real path (follows symlinks) and ensure containment
    const real = fs.realpathSync(candidate);
    const rel = path.relative(FILES_ROOT, real);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      return res.status(400).json({ success: false, message: 'Invalid file path' });
    }

    const stat = fs.statSync(real);
    if (!stat.isFile()) {
      return res.status(404).json({ success: false });
    }

    // Send as attachment with a safe filename
    return res.download(real, fileName);
  } catch (e) {
    console.error('Download error:', e);
    return res.status(500).json({ success: false });
  }
});

router.get('/challenges', async (req, res) => {
  try {
    const challs = await ChallengesTbl.find();
    res.status(200).json(challs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/projects', async (req, res) => {
  try {
    const projects = await ProjectsTbl.find({});
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/submit-flag', validateFlag, async (req, res) => {
  const flagSign = sha256sum(req.flag);

  try {
    const flagExists = await FlagsTbl.findOne({ ch_id: req.chal_id, flag_sign: flagSign });

    if (flagExists) {
      return res.json({ challenge_id: req.chal_id, success: true });
    }

    return res.json({ challenge_id: req.chal_id, success: false });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error, check back later', success: false });
  }
});

module.exports = router;

