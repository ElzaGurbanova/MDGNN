const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

// Set the view engine to pug
app.set('view engine', 'pug');
app.set('views', 'views');

// Canonical base for .well-known
const WELL_KNOWN_ROOT = require('fs').realpathSync(
  path.join(__dirname, '../.well-known')
);

// Route to serve files from the .well-known directory
router.get('/:path', (req, res) => {
  const raw = String(req.params.path || '');
  // Keep only a simple basename; disallow dot-only, traversal, weird chars
  const name = path.basename(raw);
  if (
    !name ||
    name === '.' ||
    name === '..' ||
    !/^[A-Za-z0-9._-]+$/.test(name)
  ) {
    return res.status(400).send('Invalid filename');
  }

  // Safely serve from fixed root; Express prevents traversal with `root`
  res.sendFile(name, { root: WELL_KNOWN_ROOT }, (err) => {
    if (err) return res.status(err.statusCode || 404).end();
  });
});

module.exports = router;

