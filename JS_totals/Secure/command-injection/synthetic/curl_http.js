'use strict';
/** Curl fetcher HTTP — FIXED (no shell; validation/allowlists) */
const http = require('http');
const url = require('url');
const { URL } = url;
const fs = require('fs');
const path = require('path');

function isHttp(u) { try { const p = new URL(u); return ['http:','https:'].includes(p.protocol); } catch { return false; } }
function safeOut(n) { return /^[\w.-]{1,80}$/.test(String(n)); }

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/curl') { res.statusCode = 404; return res.end('not found'); }
  const u = String(parsed.query.url || '');
  const out = String(parsed.query.out || '');
  if (!isHttp(u) || !safeOut(out)) { res.statusCode = 400; return res.end('bad req'); }
  // No shell: write a placeholder "fetched" file
  fs.writeFileSync(path.join('/tmp', out), 'FETCHED:' + u);
  res.setHeader('content-type','application/json');
  res.end(JSON.stringify({ ok: true, out, simulated: true }));
});
server.listen(8204, () => console.log('Fixed curl http://127.0.0.1:8204/curl'));

