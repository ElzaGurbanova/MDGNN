const http = require('http');
const fs = require('fs');
const path = require('path');
const v41 = process.env;
const v42 = v41.PORT;
const port = v42 || 8080;
const root = __dirname;
const mimeTypes = {};
mimeTypes['.html'] = 'text/html; charset=utf-8';
mimeTypes['.js'] = 'text/javascript; charset=utf-8';
mimeTypes['.css'] = 'text/css; charset=utf-8';
mimeTypes['.json'] = 'application/json; charset=utf-8';
mimeTypes['.png'] = 'image/png';
mimeTypes['.jpg'] = 'image/jpeg';
mimeTypes['.jpeg'] = 'image/jpeg';
mimeTypes['.gif'] = 'image/gif';
mimeTypes['.svg'] = 'image/svg+xml';
mimeTypes['.ico'] = 'image/x-icon';
mimeTypes['.wav'] = 'audio/wav';
mimeTypes['.mp3'] = 'audio/mpeg';
const sendFile = function (res, filePath) {
    const v43 = path.extname(filePath);
    const ext = v43.toLowerCase();
    const v44 = mimeTypes[ext];
    const contentType = v44 || 'application/octet-stream';
    const v56 = (err, content) => {
        if (err) {
            const v45 = err.code;
            const v46 = v45 === 'ENOENT';
            if (v46) {
                const v47 = { 'Content-Type': 'text/plain; charset=utf-8' };
                const v48 = res.writeHead(404, v47);
                v48;
                const v49 = res.end('404 Not Found');
                v49;
            } else {
                const v50 = { 'Content-Type': 'text/plain; charset=utf-8' };
                const v51 = res.writeHead(500, v50);
                v51;
                const v52 = res.end('500 Server Error');
                v52;
            }
            return;
        }
        const v53 = { 'Content-Type': contentType };
        const v54 = res.writeHead(200, v53);
        v54;
        const v55 = res.end(content);
        v55;
    };
    const v57 = fs.readFile(filePath, v56);
    v57;
};
const v76 = (req, res) => {
    const v58 = req.url;
    const v59 = v58.split('?');
    let reqPath = v59[0];
    const v60 = reqPath === '/';
    if (v60) {
        reqPath = '/index.html';
    }
    const v61 = path.normalize(reqPath);
    const safePath = v61.replace(/^\/+/, '');
    const filePath = path.join(root, safePath);
    const v62 = filePath.startsWith(root);
    const v63 = !v62;
    if (v63) {
        const v64 = { 'Content-Type': 'text/plain; charset=utf-8' };
        const v65 = res.writeHead(403, v64);
        v65;
        const v66 = res.end('403 Forbidden');
        v66;
        return;
    }
    const v74 = (err, stats) => {
        if (err) {
            const v67 = { 'Content-Type': 'text/plain; charset=utf-8' };
            const v68 = res.writeHead(404, v67);
            v68;
            const v69 = res.end('404 Not Found');
            v69;
            return;
        }
        const v70 = stats.isDirectory();
        if (v70) {
            const v71 = path.join(filePath, 'index.html');
            const v72 = sendFile(res, v71);
            v72;
        } else {
            const v73 = sendFile(res, filePath);
            v73;
        }
    };
    const v75 = fs.stat(filePath, v74);
    v75;
};
const server = http.createServer(v76);
const v79 = () => {
    const v77 = `Server running at http://localhost:${ port }`;
    const v78 = console.log(v77);
    v78;
};
const v80 = server.listen(port, v79);
v80;