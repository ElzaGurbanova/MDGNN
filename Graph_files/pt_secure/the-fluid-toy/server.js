const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const v58 = (req, res) => {
    let requestPath;
    const v32 = req.url;
    const v33 = v32 === '/';
    const v34 = req.url;
    if (v33) {
        requestPath = '/index.html';
    } else {
        requestPath = v34;
    }
    const v35 = path.normalize(requestPath);
    const normalizedPath = v35.replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(__dirname, 'build', normalizedPath);
    const extname = path.extname(filePath);
    const mimeTypes = {};
    mimeTypes['.html'] = 'text/html';
    mimeTypes['.js'] = 'text/javascript';
    mimeTypes['.data'] = 'application/octet-stream';
    mimeTypes['.wasm'] = 'application/wasm';
    mimeTypes['.json'] = 'application/json';
    mimeTypes['.css'] = 'text/css';
    mimeTypes['.br'] = 'application/brotli';
    const v36 = req.headers;
    const v37 = v36['accept-encoding'];
    const acceptEncoding = v37 || '';
    const supportsBrotli = acceptEncoding.includes('br');
    const v38 = fs.existsSync(filePath);
    const v39 = !v38;
    const v40 = v39 && supportsBrotli;
    if (v40) {
        const v41 = filePath + '.br';
        const v42 = fs.existsSync(v41);
        if (v42) {
            filePath += '.br';
        }
    }
    const v43 = filePath.replace('.br', '');
    const baseExtname = path.extname(v43);
    const v44 = mimeTypes[baseExtname];
    const contentType = v44 || 'application/octet-stream';
    const v56 = (error, content) => {
        if (error) {
            const v45 = error.code;
            const v46 = v45 === 'ENOENT';
            if (v46) {
                const v47 = res.writeHead(404);
                v47;
                const v48 = res.end('File not found');
                v48;
            } else {
                const v49 = res.writeHead(500);
                v49;
                const v50 = error.code;
                const v51 = 'Server error: ' + v50;
                const v52 = res.end(v51);
                v52;
            }
            return;
        }
        const headers = {};
        headers['Content-Type'] = contentType;
        headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
        headers['Cross-Origin-Opener-Policy'] = 'same-origin';
        const v53 = filePath.endsWith('.br');
        if (v53) {
            headers['Content-Encoding'] = 'br';
        }
        const v54 = res.writeHead(200, headers);
        v54;
        const v55 = res.end(content);
        v55;
    };
    const v57 = fs.readFile(filePath, v56);
    v57;
};
const server = http.createServer(v58);
const port = 3000;
const v61 = () => {
    const v59 = `Server running at http://localhost:${ port }`;
    const v60 = console.log(v59);
    v60;
};
const v62 = server.listen(port, v61);
v62;