'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, 'media');
const sendRange = function (req, res, filePath, stat) {
    const v38 = req.headers;
    const range = v38.range;
    const v39 = !range;
    if (v39) {
        const v40 = stat.size;
        const v41 = {
            'Content-Length': v40,
            'Content-Type': 'application/octet-stream'
        };
        const v42 = res.writeHead(200, v41);
        v42;
        const v43 = fs.createReadStream(filePath);
        const v44 = v43.pipe(res);
        return v44;
    }
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    const v45 = m[1];
    const v46 = v45 || '0';
    const start = parseInt(v46, 10);
    let end;
    const v47 = m[2];
    const v48 = m[2];
    const v49 = parseInt(v48, 10);
    const v50 = stat.size;
    const v51 = v50 - 1;
    if (v47) {
        end = v49;
    } else {
        end = v51;
    }
    const v52 = stat.size;
    const v53 = end - start;
    const v54 = v53 + 1;
    const v55 = {
        'Content-Range': `bytes ${ start }-${ end }/${ v52 }`,
        'Accept-Ranges': 'bytes',
        'Content-Length': v54,
        'Content-Type': 'application/octet-stream'
    };
    const v56 = res.writeHead(206, v55);
    v56;
    const v57 = {
        start,
        end
    };
    const v58 = fs.createReadStream(filePath, v57);
    const v59 = v58.pipe(res);
    v59;
};
const v70 = (req, res) => {
    const v61 = req.url;
    const v60 = new URL(v61, 'http://x');
    const pathname = v60.pathname;
    const filePath = path.join(ROOT, pathname);
    const v68 = (err, st) => {
        const v62 = st.isFile();
        const v63 = !v62;
        const v64 = err || v63;
        if (v64) {
            const v65 = res.writeHead(404);
            v65;
            const v66 = res.end('Not found');
            v66;
            return;
        }
        const v67 = sendRange(req, res, filePath, st);
        v67;
    };
    const v69 = fs.stat(filePath, v68);
    v69;
};
const v71 = http.createServer(v70);
const v73 = () => {
    const v72 = console.log('HTTP range server (VULN) on :5013');
    return v72;
};
const v74 = v71.listen(5013, v73);
v74;