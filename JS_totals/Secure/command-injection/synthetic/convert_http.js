'use strict';
/** ImageMagick convert HTTP — FIXED (no shell; validation/allowlists) */
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const ALLOWED_OPS = new Set(['-resize=50%', '-grayscale', '-rotate=90']);
function underImg(p) {
  const full = path.resolve('/srv/images', String(p||''));
  return full.startsWith('/srv/images' + path.sep) ? full : null;
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/img/convert') { res.statusCode = 404; return res.end('not found'); }
  const input = underImg(parsed.query.input || '');
  const out = underImg(parsed.query.output || '');
  const op = String(parsed.query.op || '');
  if (!input || !out || !ALLOWED_OPS.has(op)) { res.statusCode = 400; return res.end('bad req'); }
  // No shell: simulate transform by copying a marker
  fs.writeFileSync(out, Buffer.from('SIM-IMG'));
  res.setHeader('content-type','application/json');
  res.end(JSON.stringify({ ok: true, op, simulated: true }));
});
server.listen(8203, () => console.log('Fixed convert http://127.0.0.1:8203/img/convert'));

