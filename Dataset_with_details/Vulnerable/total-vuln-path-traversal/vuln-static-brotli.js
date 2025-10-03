// vuln-static-brotli.js (VULNERABLE)
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, 'dist');

function mime(ext) {
  return ({
    '.html':'text/html','.js':'application/javascript','.css':'text/css',
    '.json':'application/json','.wasm':'application/wasm','.png':'image/png',
    '.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'
  })[ext] || 'application/octet-stream';
}

http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://x');
  // normalize then join (still vulnerable to absolute override)
  let filePath = path.join(ROOT, path.normalize(pathname));  // '/etc/passwd' drops ROOT

  // Brotli fallback without containment
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.br')) {
    filePath += '.br';
  }

  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404).end('Not found');
      return;
    }

    const baseExt = filePath.endsWith('.br') ? path.extname(filePath.slice(0, -3)) : path.extname(filePath);
    const type = mime(baseExt);

    const headers = { 'Content-Type': type };
    if (filePath.endsWith('.br')) headers['Content-Encoding'] = 'br';

    res.writeHead(200, headers);
    fs.createReadStream(filePath).on('error', () => res.end()).pipe(res);
  });
}).listen(4101, () => console.log('VULN static on :4101'));

