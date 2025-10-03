// 2) Koa Safe Browser (directory listing + raw) with containment + symlink checks
'use strict';
const Koa = require('koa');
const Router = require('@koa/router');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

const app = new Koa();
const router = new Router();
const ROOT = path.resolve(__dirname, 'content');

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

router.get('/browse', async ctx => {
  const rel = String(ctx.query.dir || '/');
  const dir = await safeResolve(rel);
  if (!dir) return (ctx.status = 400);
  try {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    ctx.body = entries.map(e => ({ name: e.name, type: e.isDirectory() ? 'dir' : 'file' }));
  } catch { ctx.status = 404; }
});

router.get('/raw', async ctx => {
  const rel = String(ctx.query.p || '');
  const full = await safeResolve(rel);
  if (!full) return (ctx.status = 400);
  try {
    const st = await fsp.stat(full);
    if (!st.isFile()) return (ctx.status = 404);
    ctx.type = path.extname(full).slice(1) || 'application/octet-stream';
    ctx.body = fs.createReadStream(full);
  } catch { ctx.status = 404; }
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(7002, () => console.log('Koa safe browser on :7002'));

