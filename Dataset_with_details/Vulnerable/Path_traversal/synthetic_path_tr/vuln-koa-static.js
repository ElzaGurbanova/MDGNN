// vuln-koa-static.js
// VULNERABLE: path traversal via path.join on request path + missing containment checks.

'use strict';
const Koa = require('koa');
const fs = require('fs');
const path = require('path');

const app = new Koa();
const ROOT = path.resolve(__dirname, 'site');

function mime(ext) {
  return ({
    '.html':'text/html','.css':'text/css','.js':'application/javascript',
    '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
    '.svg':'image/svg+xml','.json':'application/json'
  })[ext] || 'application/octet-stream';
}

app.use(async (ctx, next) => {
  const t0 = Date.now();
  await next();
  const dt = Date.now() - t0;
  console.log(`[KOA] ${ctx.method} ${ctx.url} -> ${ctx.status} (${dt}ms)`);
});

// Directory listing & file serving (naive)
app.use(async ctx => {
  const pathname = decodeURIComponent(new URL(ctx.url, 'http://x').pathname);
  const target = path.join(ROOT, pathname); // absolute override possible

  if (pathname.endsWith('/')) {
    // list directory contents without containment check
    if (!fs.existsSync(target)) { ctx.status = 404; ctx.body = 'Not found'; return; }
    const entries = fs.readdirSync(target, { withFileTypes: true });
    ctx.type = 'text/html';
    ctx.body = `<h2>Index of ${pathname}</h2><ul>` +
      entries.map(e => `<li><a href="${pathname}${e.name}${e.isDirectory() ? '/' : ''}">${e.name}</a></li>`).join('') +
      `</ul>`;
  } else {
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      ctx.status = 404; ctx.body = 'Not found'; return;
    }
    ctx.set('Cache-Control', 'public, max-age=300');
    ctx.type = mime(path.extname(target).toLowerCase());
    ctx.body = fs.createReadStream(target); // symlinks allowed
  }
});

const port = process.env.PORT || 5012;
app.listen(port, () => console.log(`KOA static (VULN) http://localhost:${port}/`));

