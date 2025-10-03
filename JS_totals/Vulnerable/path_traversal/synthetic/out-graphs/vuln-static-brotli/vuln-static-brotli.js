'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, 'dist');
const mime = function (ext) {
    const v36 = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.wasm': 'application/wasm',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml'
    };
    const v37 = v36[ext];
    const v38 = v37 || 'application/octet-stream';
    return v38;
};
const v66 = (req, res) => {
    const v40 = req.url;
    const v39 = new URL(v40, 'http://x');
    const pathname = v39.pathname;
    const v41 = path.normalize(pathname);
    let filePath = path.join(ROOT, v41);
    const v42 = fs.existsSync(filePath);
    const v43 = !v42;
    const v44 = filePath + '.br';
    const v45 = fs.existsSync(v44);
    const v46 = v43 && v45;
    if (v46) {
        filePath += '.br';
    }
    const v64 = (err, st) => {
        const v47 = st.isFile();
        const v48 = !v47;
        const v49 = err || v48;
        if (v49) {
            const v50 = res.writeHead(404);
            const v51 = v50.end('Not found');
            v51;
            return;
        }
        let baseExt;
        const v52 = filePath.endsWith('.br');
        const v53 = -3;
        const v54 = filePath.slice(0, v53);
        const v55 = path.extname(v54);
        const v56 = path.extname(filePath);
        if (v52) {
            baseExt = v55;
        } else {
            baseExt = v56;
        }
        const type = mime(baseExt);
        const headers = {};
        headers['Content-Type'] = type;
        const v57 = filePath.endsWith('.br');
        if (v57) {
            headers['Content-Encoding'] = 'br';
        }
        const v58 = res.writeHead(200, headers);
        v58;
        const v59 = fs.createReadStream(filePath);
        const v61 = () => {
            const v60 = res.end();
            return v60;
        };
        const v62 = v59.on('error', v61);
        const v63 = v62.pipe(res);
        v63;
    };
    const v65 = fs.stat(filePath, v64);
    v65;
};
const v67 = http.createServer(v66);
const v69 = () => {
    const v68 = console.log('VULN static on :4101');
    return v68;
};
const v70 = v67.listen(4101, v69);
v70;