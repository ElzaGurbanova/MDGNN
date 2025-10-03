// express-glob-download.fixed.js
'use strict';
const express = require('express');
const { glob } = require('glob');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const app = express();
const ROOT = path.resolve(__dirname, 'bundle'); // sandbox root

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

// helpers
function inside(root, target) {
  const rel = path.relative(root, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

async function realInside(root, candidateAbs) {
  const realRoot = await fsp.realpath(root);
  let real;
  try { real = await fsp.realpath(candidateAbs); } catch { return false; }
  return inside(realRoot, real);
}

// Match and stream many files by pattern (sandboxed)
app.get('/download-matches', async (req, res) => {
  let pattern = String(req.query.pattern || '**/*.txt');

  // Basic pattern validation: disallow path separators leading outside and '..'
  if (
    pattern.includes('..') ||
    pattern.startsWith('/') ||
    pattern.includes('\\')
  ) {
    return res.status(400).json({ error: 'Invalid pattern' });
  }

  try {
    // Resolve matches *within* ROOT by using cwd and absolute results
    const matches = await glob(pattern, {
      cwd: ROOT,
      absolute: true,
      nodir: true,
      dot: false,
      follow: false   // do not follow symlinks
    });

    // Filter to keep only files that are truly inside ROOT even after symlinks
    const safeMatches = [];
    for (const m of matches) {
      if (await realInside(ROOT, m)) safeMatches.push(m);
    }

    if (safeMatches.length === 0) {
      return res.status(404).json({ error: 'no matches' });
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.write(`# Downloading ${safeMatches.length} file(s)\n\n`);
    for (const f of safeMatches) {
      const rel = path.relative(ROOT, f).replace(/\\/g, '/');
      res.write(`--- ${rel} ---\n`);
      try {
        res.write(fs.readFileSync(f, 'utf8'));
      } catch {
        res.write('[read error]');
      }
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
  <h2>Glob Download (FIXED)</h2>
  <form method="get" action="/download-matches">
    <label>Pattern in bundle/: <input name="pattern" value="**/*.txt"/></label>
    <button>Fetch</button>
  </form>
`));

const port = process.env.PORT || 5025;
app.listen(port, () => console.log('Glob download (FIXED) on :5025'));

