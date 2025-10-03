// fixed-static-brotli.js (FIXED)
'use strict';
const http = require('http');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const ROOT = path.resolve(__dirname, 'dist');

function mime(ext) {
  return ({
    '.html':'text/html','.js':'application/javascript','.css':'text/css',
    '.json':'application/json','.wasm':'application/wasm','.png':'image/png',
    '.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'
  })[ext] || 'application/octet-stream';
}

function inside(root, target) {
  const rel = path.relative(root, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

http.createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, 'http://x');
    // resolve against ROOT with '.' trick to block absolute override
    let target = path.resolve(ROOT, '.' + pathname);
    if (!inside(ROOT, target)) return res.writeHead(400).end('Bad path');

    // realpath defense
    const realRoot = await fsp.realpath(ROOT);
    let real = await fsp.realpath(target).catch(() => null);

    // Brotli fallback with containment
    if (!real) {
      const br = target + '.br';
      if (inside(ROOT, br) && fs.existsSync(br)) {
        real = await fsp.realpath(br).catch(() => null);
      }
    }
    if (!real) return res.writeHead(404).end('Not found');

    if (!inside(realRoot, real)) return res.writeHead(403).end('Forbidden');

    const st = await fsp.stat(real);
    if (!st.isFile()) return res.writeHead(404).end('Not found');

    const baseExt = real.endsWith('.br') ? path.extname(real.slice(0, -3)) : path.extname(real);
    const headers = { 'Content-Type': mime(baseExt) };
    if (real.endsWith('.br')) headers['Content-Encoding'] = 'br';

    res.writeHead(200, headers);
    fs.createReadStream(real).on('error', () => res.end()).pipe(res);
  } catch (e) {
    res.writeHead(500).end('Server error');
  }
}).listen(4102, () => console.log('FIXED static on :4102'));

