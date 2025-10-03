// vuln-koa-template-assets.js
// VULNERABLE: renders template path from query; serves assets with naive join.

'use strict';
const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');
const path = require('path');

const app = new Koa();
const router = new Router();

const VIEWS = path.resolve(__dirname, 'views');
const ASSETS = path.resolve(__dirname, 'public');

// asset server (naive)
router.get('/assets/(.*)', async ctx => {
  const wildcard = ctx.params[0] || '';
  const file = path.join(ASSETS, wildcard); // traversal
  if (!file.startsWith(ASSETS) || !fs.existsSync(file)) {
    ctx.status = 404; ctx.body = 'not found'; return;
  }
  ctx.type = path.extname(file).slice(1) || 'application/octet-stream';
  ctx.body = fs.createReadStream(file);
});

// render template (naive)
router.get('/view', async ctx => {
  const t = String(ctx.query.t || 'home');  // e.g. 'home', '../etc/passwd'
  const file = path.join(VIEWS, t + '.html'); // abs override & traversal
  if (!file.startsWith(VIEWS) || !fs.existsSync(file)) {
    ctx.status = 404; ctx.body = 'template not found'; return;
  }
  ctx.type = 'text/html';
  ctx.body = fs.readFileSync(file, 'utf8');
});

router.get('/', async ctx => {
  ctx.type = 'text/html';
  ctx.body = `<h1>Koa Templates (VULNERABLE)</h1>
  <ul>
    <li>/view?t=/etc/passwd</li>
    <li>/assets/../../../../etc/hosts</li>
  </ul>`;
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(5024, () => console.log('Koa template (VULN) :5024'));

