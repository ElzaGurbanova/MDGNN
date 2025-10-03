// 4) Fastify Signed URLs (HMAC) + containment checks: only serve if path is signed & inside root
'use strict';
const fastify = require('fastify')({ logger: false });
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, 'downloads');
const SECRET = process.env.SIGNED_SECRET || 'dev-secret';

function sign(p) {
  return crypto.createHmac('sha256', SECRET).update(p).digest('hex');
}
function inside(base, target) {
  const rel = path.relative(base, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}
async function safeResolve(relish) {
  const t = path.resolve(ROOT, '.' + String(relish || ''));
  if (!inside(ROOT, t)) return null;
  try {
    const realRoot = await fsp.realpath(ROOT);
    const realT = await fsp.realpath(t);
    if (!inside(realRoot, realT)) return null;
    return realT;
  } catch { return null; }
}

// issue a signed URL (demo only)
fastify.get('/issue', async (req, reply) => {
  const p = String(req.query.p || 'example.txt');
  const sig = sign(p);
  reply.type('text/plain').send(`/signed?p=${encodeURIComponent(p)}&sig=${sig}`);
});

// verify signature, then containment, then stream
fastify.get('/signed', async (req, reply) => {
  const p = String(req.query.p || '');
  const sig = String(req.query.sig || '');
  if (sign(p) !== sig) return reply.code(403).send('Invalid signature');

  const full = await safeResolve(p);
  if (!full) return reply.code(400).send('Invalid path');

  try {
    const st = await fsp.stat(full);
    if (!st.isFile()) return reply.code(404).send('Not found');
    reply.header('Content-Type', 'application/octet-stream');
    return reply.send(fs.createReadStream(full));
  } catch { return reply.code(404).send('Not found'); }
});

fastify.get('/', async () => '<a href="/issue?p=example.txt">issue signed link</a>');
fastify.listen({ port: 7004 }, err => {
  if (err) throw err;
  console.log('Fastify signed download on :7004');
});

