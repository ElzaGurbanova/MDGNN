const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));  // EJS files should be in /public

// Serve static files (like CSS, JS, images)
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Safe page route
app.get('/page', (req, res) => {
  const raw = typeof req.query.page === 'string' ? req.query.page : 'home';
  // Allow only simple slugs: no slashes, no dots
  const isSafe = /^[A-Za-z0-9_-]{1,64}$/.test(raw);
  const pageSlug = isSafe ? raw : 'home';

  const baseDir = path.resolve(__dirname, 'public', 'pages');
  const target   = path.resolve(baseDir, `${pageSlug}.ejs`);
  const rel      = path.relative(baseDir, target);

  // Enforce containment inside /public/pages
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return res.status(400).send('Invalid page');
  }

  if (fs.existsSync(target)) {
    // render relative to `views` root
    return res.render(path.join('pages', pageSlug));
  }
  return res.status(404).send('Page not found');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

