'use strict';
const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');
const path = require('path');
const app = new Koa();
const router = new Router();
const VIEWS = path.resolve(__dirname, 'views');
const ASSETS = path.resolve(__dirname, 'public');
const v44 = async ctx => {
    const v34 = ctx.params;
    const v35 = v34[0];
    const wildcard = v35 || '';
    const file = path.join(ASSETS, wildcard);
    const v36 = file.startsWith(ASSETS);
    const v37 = !v36;
    const v38 = fs.existsSync(file);
    const v39 = !v38;
    const v40 = v37 || v39;
    if (v40) {
        ctx.status = 404;
        ctx.body = 'not found';
        return;
    }
    const v41 = path.extname(file);
    const v42 = v41.slice(1);
    ctx.type = v42 || 'application/octet-stream';
    const v43 = fs.createReadStream(file);
    ctx.body = v43;
};
const v45 = router.get('/assets/(.*)', v44);
v45;
const v56 = async ctx => {
    const v46 = ctx.query;
    const v47 = v46.t;
    const v48 = v47 || 'home';
    const t = String(v48);
    const v49 = t + '.html';
    const file = path.join(VIEWS, v49);
    const v50 = file.startsWith(VIEWS);
    const v51 = !v50;
    const v52 = fs.existsSync(file);
    const v53 = !v52;
    const v54 = v51 || v53;
    if (v54) {
        ctx.status = 404;
        ctx.body = 'template not found';
        return;
    }
    ctx.type = 'text/html';
    const v55 = fs.readFileSync(file, 'utf8');
    ctx.body = v55;
};
const v57 = router.get('/view', v56);
v57;
const v58 = async ctx => {
    ctx.type = 'text/html';
    ctx.body = `<h1>Koa Templates (VULNERABLE)</h1>
  <ul>
    <li>/view?t=/etc/passwd</li>
    <li>/assets/../../../../etc/hosts</li>
  </ul>`;
};
const v59 = router.get('/', v58);
v59;
const v60 = router.routes();
const v61 = app.use(v60);
const v62 = router.allowedMethods();
const v63 = v61.use(v62);
v63;
const v65 = () => {
    const v64 = console.log('Koa template (VULN) :5024');
    return v64;
};
const v66 = app.listen(5024, v65);
v66;