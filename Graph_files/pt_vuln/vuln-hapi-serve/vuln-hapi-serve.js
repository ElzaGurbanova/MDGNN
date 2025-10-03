'use strict';
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, 'profiles');
const start = async function () {
    const v41 = {
        port: 5019,
        host: 'localhost'
    };
    const server = Hapi.server(v41);
    const v58 = (request, h) => {
        const v42 = request.query;
        const v43 = v42.user;
        const v44 = v43 || 'guest';
        const u = String(v44);
        const img = path.join(ROOT, u, 'avatar.png');
        const v45 = img.startsWith(ROOT);
        const v46 = !v45;
        const v47 = fs.existsSync(img);
        const v48 = !v47;
        const v49 = v46 || v48;
        if (v49) {
            const v50 = h.response('Not found');
            const v51 = v50.code(404);
            return v51;
        }
        const v52 = h.file;
        const v53 = h.file(img);
        const v54 = fs.readFileSync(img);
        const v55 = h.response(v54);
        const v56 = v55.type('image/png');
        let v57;
        if (v52) {
            v57 = v53;
        } else {
            v57 = v56;
        }
        return v57;
    };
    const v59 = {
        method: 'GET',
        path: '/avatar',
        handler: v58
    };
    const v60 = server.route(v59);
    v60;
    const v74 = (request, h) => {
        const v61 = request.query;
        const v62 = v61.path;
        const v63 = v62 || '';
        const p = String(v63);
        const f = path.join(ROOT, p);
        const v64 = f.startsWith(ROOT);
        const v65 = !v64;
        const v66 = fs.existsSync(f);
        const v67 = !v66;
        const v68 = v65 || v67;
        if (v68) {
            const v69 = h.response('Not found');
            const v70 = v69.code(404);
            return v70;
        }
        const v71 = fs.readFileSync(f);
        const v72 = h.response(v71);
        const v73 = v72.type('application/octet-stream');
        return v73;
    };
    const v75 = {
        method: 'GET',
        path: '/attach',
        handler: v74
    };
    const v76 = server.route(v75);
    v76;
    await server.start();
    const v77 = console.log('hapi serve (VULN) on :5019');
    v77;
};
const v78 = start();
const v79 = console.error;
const v80 = v78.catch(v79);
v80;