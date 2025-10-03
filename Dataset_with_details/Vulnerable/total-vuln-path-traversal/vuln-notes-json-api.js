// vuln-notes-json-api.js
// VULNERABLE: uses path.join with user input and fragile normalize; absolute override & traversal.

'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, 'notes');

function sendJSON(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

function body(req) {
  return new Promise((resolve) => {
    const chunks = []; req.on('data', d => chunks.push(d));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

http.createServer(async (req, res) => {
  const { pathname, searchParams } = new URL(req.url, 'http://x');

  // GET /api/list?dir=
  if (req.method === 'GET' && pathname === '/api/list') {
    const dir = searchParams.get('dir') || '/';
    const target = path.join(ROOT, path.normalize(dir)); // absolute override
    if (!target.startsWith(ROOT)) return sendJSON(res, 400, { error: 'bad path' });
    try {
      const items = fs.readdirSync(target).map(n => ({ name: n }));
      return sendJSON(res, 200, { items });
    } catch {
      return sendJSON(res, 404, { error: 'not found' });
    }
  }

  // GET /api/get?file=
  if (req.method === 'GET' && pathname === '/api/get') {
    const f = searchParams.get('file') || '';
    const file = path.join(ROOT, f); // traversal
    if (!file.startsWith(ROOT)) return sendJSON(res, 400, { error: 'bad path' });
    try {
      const txt = fs.readFileSync(file, 'utf8');
      return sendJSON(res, 200, { data: txt });
    } catch {
      return sendJSON(res, 404, { error: 'not found' });
    }
  }

  // PUT /api/put?file=
  if (req.method === 'PUT' && pathname === '/api/put') {
    const f = searchParams.get('file') || '';
    const file = path.join(ROOT, f);
    if (!file.startsWith(ROOT)) return sendJSON(res, 400, { error: 'bad path' });
    const content = await body(req);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content); // follows symlink if present
    return sendJSON(res, 200, { ok: true });
  }

  // fallback
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(`<h2>Notes API (VULNERABLE)</h2>
      <ul>
        <li>GET /api/list?dir=/</li>
        <li>GET /api/get?file=/etc/hosts</li>
        <li>PUT /api/put?file=../../escape.txt</li>
      </ul>`);
  }

  sendJSON(res, 404, { error: 'not found' });
}).listen(5023, () => console.log('Notes API (VULN) :5023'));

