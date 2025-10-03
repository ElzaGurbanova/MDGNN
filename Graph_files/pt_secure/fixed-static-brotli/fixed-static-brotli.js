'use strict';
const http = require('http');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const ROOT = path.resolve(__dirname, 'dist');
const mime = function (ext) {
    const v56 = {
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
    const v57 = v56[ext];
    const v58 = v57 || 'application/octet-stream';
    return v58;
};
const inside = function (root, target) {
    const rel = path.relative(root, target);
    const v59 = rel.startsWith('..');
    const v60 = !v59;
    const v61 = rel && v60;
    const v62 = path.isAbsolute(rel);
    const v63 = !v62;
    const v64 = v61 && v63;
    return v64;
};
const v106 = async (req, res) => {
    try {
        const v66 = req.url;
        const v65 = new URL(v66, 'http://x');
        const pathname = v65.pathname;
        const v67 = '.' + pathname;
        let target = path.resolve(ROOT, v67);
        const v68 = inside(ROOT, target);
        const v69 = !v68;
        if (v69) {
            const v70 = res.writeHead(400);
            const v71 = v70.end('Bad path');
            return v71;
        }
        const realRoot = await fsp.realpath(ROOT);
        const v72 = fsp.realpath(target);
        const v73 = () => {
            return null;
        };
        let real = await v72.catch(v73);
        const v74 = !real;
        if (v74) {
            const br = target + '.br';
            const v75 = inside(ROOT, br);
            const v76 = fs.existsSync(br);
            const v77 = v75 && v76;
            if (v77) {
                const v78 = fsp.realpath(br);
                const v79 = () => {
                    return null;
                };
                real = await v78.catch(v79);
            }
        }
        const v80 = !real;
        if (v80) {
            const v81 = res.writeHead(404);
            const v82 = v81.end('Not found');
            return v82;
        }
        const v83 = inside(realRoot, real);
        const v84 = !v83;
        if (v84) {
            const v85 = res.writeHead(403);
            const v86 = v85.end('Forbidden');
            return v86;
        }
        const st = await fsp.stat(real);
        const v87 = st.isFile();
        const v88 = !v87;
        if (v88) {
            const v89 = res.writeHead(404);
            const v90 = v89.end('Not found');
            return v90;
        }
        let baseExt;
        const v91 = real.endsWith('.br');
        const v92 = -3;
        const v93 = real.slice(0, v92);
        const v94 = path.extname(v93);
        const v95 = path.extname(real);
        if (v91) {
            baseExt = v94;
        } else {
            baseExt = v95;
        }
        const v96 = mime(baseExt);
        const headers = {};
        headers['Content-Type'] = v96;
        const v97 = real.endsWith('.br');
        if (v97) {
            headers['Content-Encoding'] = 'br';
        }
        const v98 = res.writeHead(200, headers);
        v98;
        const v99 = fs.createReadStream(real);
        const v101 = () => {
            const v100 = res.end();
            return v100;
        };
        const v102 = v99.on('error', v101);
        const v103 = v102.pipe(res);
        v103;
    } catch (e) {
        const v104 = res.writeHead(500);
        const v105 = v104.end('Server error');
        v105;
    }
};
const v107 = http.createServer(v106);
const v109 = () => {
    const v108 = console.log('FIXED static on :4102');
    return v108;
};
const v110 = v107.listen(4102, v109);
v110;