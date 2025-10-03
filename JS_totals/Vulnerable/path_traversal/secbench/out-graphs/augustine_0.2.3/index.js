const http = require('http');
const url = require('url');
const v40 = require('util');
const inspect = v40.inspect;
const fs = require('fs');
const v41 = require('path');
const resolve = v41.resolve;
const v42 = require('path');
const extname = v42.extname;
const v43 = require('debug');
const debug = v43('augustine');
const v71 = (req, res) => {
    const v44 = req.url;
    const v45 = debug('url = ', v44);
    v45;
    const v46 = req.url;
    const parsedUrl = url.parse(v46);
    const v47 = parsedUrl.pathname;
    const v48 = v47.slice(1);
    let path = parsedUrl && v48;
    const v49 = debug('path = ', path);
    v49;
    const v50 = path.length;
    const v51 = v50 === 0;
    if (v51) {
        const v52 = debug('default to index.html.');
        v52;
        path = resolve('index.html');
    }
    const v53 = fs.existsSync(path);
    const v54 = !v53;
    if (v54) {
        const v55 = console.log('404 Not found.');
        v55;
        res.statusCode = 404;
        const v56 = res.end();
        return v56;
    }
    const stats = fs.statSync(path);
    const v57 = stats.isDirectory();
    if (v57) {
        const v58 = console.log('Is directory ...');
        v58;
        const v59 = resolve(path, 'index.html');
        const v60 = fs.existsSync(v59);
        if (v60) {
            path = resolve(path, 'index.html');
        } else {
            const v61 = resolve(path, 'index.htm');
            const v62 = fs.existsSync(v61);
            if (v62) {
                path = resolve(path, 'index.htm');
            } else {
                const v63 = console.log('404 Not found: Directory.');
                v63;
                res.statusCode = 404;
                const v64 = res.end();
                return v64;
            }
        }
    }
    let mimeType = 'text/plain';
    const v65 = extname(path);
    switch (v65) {
    case '.html':
    case '.htm':
        mimeType = 'text/html';
        break;
    case '.css':
        mimeType = 'text/css';
        break;
    case '.js':
        mimeType = 'application/javascript';
        break;
    case '.json':
        mimeType = 'text/json';
        break;
    case '.jpg':
    case '.jpeg':
        mimeType = 'image/jpge';
        break;
    case '.png':
        mimeType = 'image/png';
        break;
    case '.svg':
        mimeType = 'image/svg+xml';
        break;
    case '.gif':
        mimeType = 'image/gif';
        break;
    case '.ttf':
        mimeType = 'font/ttf';
        break;
    case '.woff':
        mimeType = 'font/woff';
        break;
    case '.woff2':
        mimeType = 'font/woff2';
        break;
    case '.pdf':
        mimeType = 'application/pdf';
        break;
    default:
        break;
    }
    const v66 = res.setHeader('Content-Type', mimeType);
    v66;
    const v67 = { flag: 'rs+' };
    const v68 = fs.readFileSync(path, v67);
    const v69 = res.write(v68);
    v69;
    const v70 = res.end();
    v70;
};
const server = http.createServer(v71);
const v74 = (err, socket) => {
    const v72 = console.error(err);
    v72;
    const v73 = socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    v73;
};
const v75 = server.on('clientError', v74);
v75;
const start = (port, hostname) => {
    const v77 = () => {
        const v76 = console.log('Waiting for client to connect ...');
        return v76;
    };
    const v78 = server.listen(port, hostname, v77);
    return v78;
};
exports.start = start;
(module.exports = exports = { start })
exports = {};
module.exports = exports;