'use strict';
const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const app = new Koa();
const ROOT = path.resolve(__dirname, 'site');
const mime = function (ext) {
    const v47 = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.json': 'application/json'
    };
    const v48 = v47[ext];
    const v49 = v48 || 'application/octet-stream';
    return v49;
};
const v56 = async (ctx, next) => {
    const t0 = Date.now();
    await next();
    const v50 = Date.now();
    const dt = v50 - t0;
    const v51 = ctx.method;
    const v52 = ctx.url;
    const v53 = ctx.status;
    const v54 = `[KOA] ${ v51 } ${ v52 } -> ${ v53 } (${ dt }ms)`;
    const v55 = console.log(v54);
    v55;
};
const v57 = app.use(v56);
v57;
const v85 = async ctx => {
    const v58 = ctx.url;
    const v59 = new URL(v58, 'http://x');
    const v60 = v59.pathname;
    const pathname = decodeURIComponent(v60);
    const target = path.join(ROOT, pathname);
    const v61 = pathname.endsWith('/');
    if (v61) {
        const v62 = fs.existsSync(target);
        const v63 = !v62;
        if (v63) {
            ctx.status = 404;
            ctx.body = 'Not found';
            return;
        }
        const v64 = { withFileTypes: true };
        const entries = fs.readdirSync(target, v64);
        ctx.type = 'text/html';
        const v70 = e => {
            const v65 = e.name;
            const v66 = e.isDirectory();
            let v67;
            if (v66) {
                v67 = '/';
            } else {
                v67 = '';
            }
            const v68 = e.name;
            const v69 = `<li><a href="${ pathname }${ v65 }${ v67 }">${ v68 }</a></li>`;
            return v69;
        };
        const v71 = entries.map(v70);
        const v72 = v71.join('');
        const v73 = `<h2>Index of ${ pathname }</h2><ul>` + v72;
        ctx.body = v73 + `</ul>`;
    } else {
        const v74 = fs.existsSync(target);
        const v75 = !v74;
        const v76 = fs.statSync(target);
        const v77 = v76.isFile();
        const v78 = !v77;
        const v79 = v75 || v78;
        if (v79) {
            ctx.status = 404;
            ctx.body = 'Not found';
            return;
        }
        const v80 = ctx.set('Cache-Control', 'public, max-age=300');
        v80;
        const v81 = path.extname(target);
        const v82 = v81.toLowerCase();
        const v83 = mime(v82);
        ctx.type = v83;
        const v84 = fs.createReadStream(target);
        ctx.body = v84;
    }
};
const v86 = app.use(v85);
v86;
const v87 = process.env;
const v88 = v87.PORT;
const port = v88 || 5012;
const v91 = () => {
    const v89 = `KOA static (VULN) http://localhost:${ port }/`;
    const v90 = console.log(v89);
    return v90;
};
const v92 = app.listen(port, v91);
v92;