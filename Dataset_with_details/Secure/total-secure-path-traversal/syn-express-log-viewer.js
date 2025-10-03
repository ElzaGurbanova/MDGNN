// 5) Express Log Viewer (safe containment + symlink defense)
'use strict';
const express = require('express');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const app = express();
const LOGS_BASE = path.resolve(__dirname, 'logs'); // sandbox root for logs

// Ensure base exists
if (!fs.existsSync(LOGS_BASE)) fs.mkdirSync(LOGS_BASE, { recursive: true });

// ---------- helpers ----------
function inside(base, target) {
  const rel = path.relative(base, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

async function safeResolve(base, relish) {
  // Resolve against base and ensure path-aware containment
  const t = path.resolve(base, '.' + String(relish || ''));
  if (!inside(base, t)) return null;

  // Symlink-hardening: canonicalize both base and target
  try {
    const realBase = await fsp.realpath(base);
    const realT = await fsp.realpath(t);
    if (!inside(realBase, realT)) return null;
    return realT;
  } catch { return null; }
}
// --------------------------------

// List available log files (only .log)
app.get('/logs', async (_req, res) => {
  try {
    const entries = await fsp.readdir(LOGS_BASE, { withFileTypes: true });
    const files = entries
      .filter(e => e.isFile() && e.name.endsWith('.log'))
      .map(e => e.name)
      .sort();
    res.json({ base: LOGS_BASE, files });
  } catch (e) {
    console.error('List error:', e);
    res.status(500).json({ error: 'Failed to list logs' });
  }
});

// Stream a specific log file safely
app.get('/logs/:name', async (req, res) => {
  const name = String(req.params.name || '');

  // Strict filename allow-list (no separators)
  if (!/^[A-Za-z0-9_.-]{1,128}\.log$/.test(name)) {
    return res.status(400).send('Invalid log name');
  }

  // Resolve inside sandbox and prevent symlink escapes
  const full = await safeResolve(LOGS_BASE, name);
  if (!full) return res.status(400).send('Invalid path');

  try {
    const st = await fsp.stat(full);
    if (!st.isFile()) return res.status(404).send('Not found');

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    // Optional cache headers
    res.setHeader('Cache-Control', 'no-store');
    const stream = fs.createReadStream(full, { encoding: 'utf8' });
    stream.on('error', () => res.status(500).end());
    stream.pipe(res);
  } catch (e) {
    console.error('Read error:', e);
    res.status(404).send('Not found');
  }
});

// Minimal index
app.get('/', (_req, res) => {
  res.type('html').send(`
    <h2>Secure Log Viewer</h2>
    <ul>
      <li><a href="/logs">List logs</a></li>
      <li>Example: <code>/logs/app.log</code></li>
    </ul>
  `);
});

const port = process.env.PORT || 7005;
app.listen(port, () => console.log('Secure Log Viewer on :7005'));

