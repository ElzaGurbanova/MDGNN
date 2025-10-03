// vuln-express-glob-download.js
// VULNERABLE: uses glob pattern directly from user (can include ../) and streams matched files.

'use strict';
const express = require('express');
const { glob } = require('glob');
const fs = require('fs');
const path = require('path');

const app = express();
const ROOT = path.resolve(__dirname, 'bundle');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

// Match and stream many files by pattern (naive)
app.get('/download-matches', async (req, res) => {
  const pattern = String(req.query.pattern || '**/*.txt'); // attacker-controlled glob
  const basePattern = path.join(ROOT, pattern);           // ../ in pattern escapes ROOT
  if (!basePattern.startsWith(ROOT)) {
    // This string check is meaningless with globs; but keeping to show the anti-pattern
    return res.status(400).json({ error: 'bad pattern' });
  }

  try {
    const matches = await glob(basePattern, { nodir: true }); // will follow symlinks and escape
    if (matches.length === 0) return res.status(404).json({ error: 'no matches' });

    // Stream a simple concatenation (for demo purposes)
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.write(`# Downloading ${matches.length} file(s)\n\n`);
    for (const f of matches) {
      res.write(`--- ${path.relative(ROOT, f)} ---\n`);
      res.write(fs.readFileSync(f, 'utf8'));
      res.write('\n\n');
    }
    res.end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'glob failed' });
  }
});

// Simple form
app.get('/', (_req, res) => res.type('html').send(`
  <h2>Glob Download (VULNERABLE)</h2>
  <form method="get" action="/download-matches">
    <label>Pattern in bundle/: <input name="pattern" value="**/*.txt"/></label>
    <button>Fetch</button>
  </form>
  <p>Try <code>../../**/*.js</code> or patterns with <code>..</code> to escape.</p>
`));

app.listen(5025, () => console.log('Glob download (VULN) on :5025'));

