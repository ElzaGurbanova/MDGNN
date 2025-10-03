// vuln-fastify-static-mix.js
// VULNERABLE: path traversal via path.join + fragile prefix checks; follows symlinks.

'use strict';
const fastify = require('fastify')({ logger: false });
const fs = require('fs');
const path = require('path');

// Intended root for serving
const ROOT = path.resolve(__dirname, 'site');

fastify.addHook('onRequest', async (req, reply) => {
  req.log.info({ url: req.raw.url }, 'request');
});

// naive directory listing (allows absolute override)
fastify.get('/list', async (req, reply) => {
  const dir = req.query.dir || '/';
  const normalized = path.normalize(dir);              // can still become absolute like `/etc`
  const target = path.join(ROOT, normalized);          // drops ROOT if normalized is absolute

  // fragile: prefix string check
  if (!target.startsWith(ROOT)) {
    return reply.code(400).send({ error: 'Invalid path' });
  }

  try {
    const entries = fs.readdirSync(target, { withFileTypes: true });
    const list = entries.map(e => ({
      name: e.name,
      type: e.isDirectory() ? 'dir' : 'file',
      href: path.posix.join('/static', normalized.replace(/\\/g, '/'), e.name)
    }));
    return { dir: normalized, items: list };
  } catch (e) {
    return reply.code(404).send({ error: 'Not found' });
  }
});

// serve static file (naive)
fastify.get('/static/*', async (req, reply) => {
  const wildcard = req.params['*'] || '';
  const file = path.join(ROOT, wildcard);              // absolute override + traversal
  if (!file.startsWith(ROOT)) return reply.code(400).send('Bad path');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return reply.code(404).send('Not found');
  }
  reply.header('Content-Type', 'application/octet-stream');
  return reply.send(fs.createReadStream(file));        // follows symlink target
});

// preview (naive)
fastify.get('/preview', async (req, reply) => {
  const p = String(req.query.p || 'index.html');
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) return reply.code(400).send('Bad path');
  try {
    const txt = fs.readFileSync(f, 'utf8');
    reply.header('Content-Type', 'text/plain');
    return txt;
  } catch {
    return reply.code(404).send('Not found');
  }
});

// download (naive)
fastify.get('/download', async (req, reply) => {
  const n = String(req.query.n || '');
  const f = path.join(ROOT, n);
  if (!f.startsWith(ROOT)) return reply.code(400).send('Bad path');
  if (!fs.existsSync(f)) return reply.code(404).send('Not found');
  reply.header('Content-Disposition', 'attachment; filename=' + path.basename(n));
  return reply.send(fs.createReadStream(f));
});

// index
fastify.get('/', async () => `
  <h1>Fastify Static (VULNERABLE)</h1>
  <ul>
    <li>GET /list?dir=/</li>
    <li>GET /static/../../../../etc/passwd</li>
    <li>GET /preview?p=/etc/hosts</li>
    <li>GET /download?n=/etc/passwd</li>
  </ul>
`);

fastify.listen({ port: 5021 }, err => {
  if (err) throw err;
  console.log('Fastify example (VULN) on :5021');
});

