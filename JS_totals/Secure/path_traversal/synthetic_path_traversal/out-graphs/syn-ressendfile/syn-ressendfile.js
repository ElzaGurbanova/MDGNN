'use strict';
const express = require('express');
const path = require('path');
const app = express();
const ASSETS_ROOT = path.resolve(__dirname, 'assets');
const v49 = (req, res) => {
    const v36 = req.params;
    const v37 = v36[0];
    const v38 = v37 || '';
    const raw = v38.replace(/\\/g, '/');
    const v39 = raw.includes('..');
    if (v39) {
        const v40 = res.status(400);
        const v41 = v40.end();
        return v41;
    }
    const v42 = {
        root: ASSETS_ROOT,
        dotfiles: 'deny',
        fallthrough: false
    };
    const v47 = err => {
        if (err) {
            const v43 = err.statusCode;
            const v44 = v43 || 404;
            const v45 = res.status(v44);
            const v46 = v45.end();
            v46;
        }
    };
    const v48 = res.sendFile(raw, v42, v47);
    v48;
};
const v50 = app.get('/assets/*', v49);
v50;
const v63 = (req, res) => {
    const v51 = req.params;
    const v52 = v51.slug;
    const v53 = v52 || '';
    const slug = String(v53);
    const v54 = /^[A-Za-z0-9_-]{1,64}$/.test(slug);
    const v55 = !v54;
    if (v55) {
        const v56 = res.status(400);
        const v57 = v56.end();
        return v57;
    }
    const safeRel = slug + '.png';
    const v58 = {
        root: ASSETS_ROOT,
        dotfiles: 'deny'
    };
    const v61 = err => {
        if (err) {
            const v59 = res.status(404);
            const v60 = v59.end();
            v60;
        }
    };
    const v62 = res.sendFile(safeRel, v58, v61);
    v62;
};
const v64 = app.get('/img/:slug', v63);
v64;
const v66 = (_req, res) => {
    const v65 = res.send('<img src="/img/logo"> or <a href="/assets/css/site.css">css</a>');
    return v65;
};
const v67 = app.get('/', v66);
v67;
const v69 = () => {
    const v68 = console.log('Express assets (root+slug) on :7003');
    return v68;
};
const v70 = app.listen(7003, v69);
v70;