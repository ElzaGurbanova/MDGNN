// vuln-http-range.js
// VULNERABLE: uses path.join(ROOT, reqPath) without containment; absolute override & traversal.

'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, 'media');

function sendRange(req, res, filePath, stat) {
  const range = req.headers.range;
  if (!range) {
    res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': 'application/octet-stream' });
    return fs.createReadStream(filePath).pipe(res);
  }
  const m = /^bytes=(\d*)-(\d*)$/.exec(range);
  const start = parseInt(m[1] || '0', 10);
  const end = m[2] ? parseInt(m[2], 10) : stat.size - 1;
  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${stat.size}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': (end - start + 1),
    'Content-Type': 'application/octet-stream'
  });
  fs.createReadStream(filePath, { start, end }).pipe(res);
}

http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://x');
  const filePath = path.join(ROOT, pathname); // NO CHECK -> serve /etc/passwd

  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404); res.end('Not found'); return;
    }
    sendRange(req, res, filePath, st);
  });
}).listen(5013, () => console.log('HTTP range server (VULN) on :5013'));

