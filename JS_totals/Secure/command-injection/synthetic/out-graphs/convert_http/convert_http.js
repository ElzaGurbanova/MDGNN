'use strict';
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const v38 = [
    '-resize=50%',
    '-grayscale',
    '-rotate=90'
];
const ALLOWED_OPS = new Set(v38);
const underImg = function (p) {
    const v39 = p || '';
    const v40 = String(v39);
    const full = path.resolve('/srv/images', v40);
    const v41 = path.sep;
    const v42 = '/srv/images' + v41;
    const v43 = full.startsWith(v42);
    let v44;
    if (v43) {
        v44 = full;
    } else {
        v44 = null;
    }
    return v44;
};
const v71 = (req, res) => {
    const v45 = req.url;
    const parsed = url.parse(v45, true);
    const v46 = parsed.pathname;
    const v47 = v46 !== '/img/convert';
    if (v47) {
        res.statusCode = 404;
        const v48 = res.end('not found');
        return v48;
    }
    const v49 = parsed.query;
    const v50 = v49.input;
    const v51 = v50 || '';
    const input = underImg(v51);
    const v52 = parsed.query;
    const v53 = v52.output;
    const v54 = v53 || '';
    const out = underImg(v54);
    const v55 = parsed.query;
    const v56 = v55.op;
    const v57 = v56 || '';
    const op = String(v57);
    const v58 = !input;
    const v59 = !out;
    const v60 = v58 || v59;
    const v61 = ALLOWED_OPS.has(op);
    const v62 = !v61;
    const v63 = v60 || v62;
    if (v63) {
        res.statusCode = 400;
        const v64 = res.end('bad req');
        return v64;
    }
    const v65 = Buffer.from('SIM-IMG');
    const v66 = fs.writeFileSync(out, v65);
    v66;
    const v67 = res.setHeader('content-type', 'application/json');
    v67;
    const v68 = {
        ok: true,
        op,
        simulated: true
    };
    const v69 = JSON.stringify(v68);
    const v70 = res.end(v69);
    v70;
};
const server = http.createServer(v71);
const v73 = () => {
    const v72 = console.log('Fixed convert http://127.0.0.1:8203/img/convert');
    return v72;
};
const v74 = server.listen(8203, v73);
v74;