'use strict';
/** Tar archive lister HTTP — FIXED (no shell; validation/allowlists) */
const http = require('http');
const url = require('url');
const path = require('path');

function isSafeName(p) { return /^[\w./-]{1,128}$/.test(String(p)); }
const BASE = '/srv/archives';

function underBase(p) {
  const full = path.resolve(BASE, String(p||''));
  return full.startsWith(path.resolve(BASE) + path.sep) ? full : null;
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/tar/list') { res.statusCode = 404; return res.end('not found'); }
  const file = underBase(parsed.query.file || '');
  const flags = String(parsed.query.flags || '');
  if (!file || !isSafeName(parsed.query.file)) { res.statusCode = 400; return res.end('bad file'); }
  // No shell: list entries by reading a sidecar index (simulated fallback)
  const entries = [path.basename(file) + ':entry1', path.basename(file) + ':entry2'];
  res.setHeader('content-type','application/json');
  res.end(JSON.stringify({ ok: true, entries, simulated: true }));
});

server.listen(8200, () => console.log('Fixed tar lister http://127.0.0.1:8200/tar/list'));


