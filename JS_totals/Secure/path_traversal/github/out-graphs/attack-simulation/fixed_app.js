const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const v33 = app.set('view engine', 'ejs');
v33;
const v34 = path.join(__dirname, 'public');
const v35 = app.set('views', v34);
v35;
const v36 = path.join(__dirname, 'public/assets');
const v37 = express.static(v36);
const v38 = app.use('/assets', v37);
v38;
const v40 = (req, res) => {
    const v39 = res.render('index');
    v39;
};
const v41 = app.get('/', v40);
v41;
const v59 = (req, res) => {
    let raw;
    const v42 = req.query;
    const v43 = v42.page;
    const v44 = typeof v43;
    const v45 = v44 === 'string';
    const v46 = req.query;
    const v47 = v46.page;
    if (v45) {
        raw = v47;
    } else {
        raw = 'home';
    }
    const isSafe = /^[A-Za-z0-9_-]{1,64}$/.test(raw);
    let pageSlug;
    if (isSafe) {
        pageSlug = raw;
    } else {
        pageSlug = 'home';
    }
    const baseDir = path.resolve(__dirname, 'public', 'pages');
    const v48 = `${ pageSlug }.ejs`;
    const target = path.resolve(baseDir, v48);
    const rel = path.relative(baseDir, target);
    const v49 = rel.startsWith('..');
    const v50 = path.isAbsolute(rel);
    const v51 = v49 || v50;
    if (v51) {
        const v52 = res.status(400);
        const v53 = v52.send('Invalid page');
        return v53;
    }
    const v54 = fs.existsSync(target);
    if (v54) {
        const v55 = path.join('pages', pageSlug);
        const v56 = res.render(v55);
        return v56;
    }
    const v57 = res.status(404);
    const v58 = v57.send('Page not found');
    return v58;
};
const v60 = app.get('/page', v59);
v60;
const port = 3000;
const v63 = () => {
    const v61 = `Server running on http://localhost:${ port }`;
    const v62 = console.log(v61);
    v62;
};
const v64 = app.listen(port, v63);
v64;