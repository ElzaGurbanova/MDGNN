'use strict';
const http = require('http');
const url = require('url');
const path = require('path');
const isSafeName = function (p) {
    const v39 = String(p);
    const v40 = /^[\w./-]{1,128}$/.test(v39);
    return v40;
};
const BASE = '/srv/archives';
const underBase = function (p) {
    const v41 = p || '';
    const v42 = String(v41);
    const full = path.resolve(BASE, v42);
    const v43 = path.resolve(BASE);
    const v44 = path.sep;
    const v45 = v43 + v44;
    const v46 = full.startsWith(v45);
    let v47;
    if (v46) {
        v47 = full;
    } else {
        v47 = null;
    }
    return v47;
};
const v73 = (req, res) => {
    const v48 = req.url;
    const parsed = url.parse(v48, true);
    const v49 = parsed.pathname;
    const v50 = v49 !== '/tar/list';
    if (v50) {
        res.statusCode = 404;
        const v51 = res.end('not found');
        return v51;
    }
    const v52 = parsed.query;
    const v53 = v52.file;
    const v54 = v53 || '';
    const file = underBase(v54);
    const v55 = parsed.query;
    const v56 = v55.flags;
    const v57 = v56 || '';
    const flags = String(v57);
    const v58 = !file;
    const v59 = parsed.query;
    const v60 = v59.file;
    const v61 = isSafeName(v60);
    const v62 = !v61;
    const v63 = v58 || v62;
    if (v63) {
        res.statusCode = 400;
        const v64 = res.end('bad file');
        return v64;
    }
    const v65 = path.basename(file);
    const v66 = v65 + ':entry1';
    const v67 = path.basename(file);
    const v68 = v67 + ':entry2';
    const entries = [
        v66,
        v68
    ];
    const v69 = res.setHeader('content-type', 'application/json');
    v69;
    const v70 = {
        ok: true,
        entries,
        simulated: true
    };
    const v71 = JSON.stringify(v70);
    const v72 = res.end(v71);
    v72;
};
const server = http.createServer(v73);
const v75 = () => {
    const v74 = console.log('Fixed tar lister http://127.0.0.1:8200/tar/list');
    return v74;
};
const v76 = server.listen(8200, v75);
v76;