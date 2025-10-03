'use strict';
const fs = require('fs');
const http = require('http');
const path = require('path');
const server = http.createServer();
const return404 = function (res, filePath) {
    const v35 = { 'Content-Type': 'text/plain' };
    const v36 = res.writeHead(404, v35);
    v36;
    const v37 = `Couldn't find the file: ${ filePath }`;
    const v38 = res.end(v37);
    v38;
};
const v39 = server.listen(8080, 'localhost');
v39;
const v43 = function (e) {
    const v40 = e.code;
    const v41 = v40 == 'EADDRINUSE';
    if (v41) {
        const v42 = server.listen(0, 'localhost');
        v42;
    }
};
const v44 = server.on('error', v43);
v44;
const v53 = function () {
    let port;
    const v45 = server.address();
    const v46 = v45.port;
    const v47 = v46 === 8080;
    const v48 = server.address();
    const v49 = v48.port;
    if (v47) {
        port = '8080';
    } else {
        port = `:${ v49 }`;
    }
    const v50 = console.log('Static Folder Server running at:');
    v50;
    const v51 = `http://localhost:${ port }`;
    const v52 = console.log(v51);
    v52;
};
const v54 = server.on('listening', v53);
v54;
const v67 = function (req, res) {
    const v55 = process.cwd();
    const v56 = req.url;
    let filePath = path.join(v55, v56);
    const v57 = fs.existsSync(filePath);
    const v58 = !v57;
    if (v58) {
        const v59 = return404(res, filePath);
        v59;
        return;
    }
    const stats = fs.lstatSync(filePath);
    const v60 = stats.isDirectory();
    if (v60) {
        filePath = path.join(filePath, '/index.html');
        const v61 = fs.existsSync(filePath);
        const v62 = !v61;
        if (v62) {
            const v63 = return404(res, filePath);
            v63;
            return;
        }
    }
    const file = fs.readFileSync(filePath);
    const v64 = res.writeHead(200);
    v64;
    const v65 = res.write(file);
    v65;
    const v66 = res.end();
    v66;
};
const v68 = server.on('request', v67);
v68;