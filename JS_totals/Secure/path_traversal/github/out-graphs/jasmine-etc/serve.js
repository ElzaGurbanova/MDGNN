const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const v43 = process.env;
const v44 = v43.PORT;
const port = v44 || 8080;
const mime = {};
mime['.html'] = 'text/html; charset=utf-8';
mime['.css'] = 'text/css; charset=utf-8';
mime['.js'] = 'application/javascript; charset=utf-8';
mime['.png'] = 'image/png';
mime['.svg'] = 'image/svg+xml';
mime['.ico'] = 'image/x-icon';
const send = function (res, status, body, headers = {}) {
    const v45 = { 'Cache-Control': 'no-cache' };
    const v46 = Object.assign(v45, headers);
    const v47 = res.writeHead(status, v46);
    v47;
    const v48 = res.end(body);
    v48;
};
const handler = function (req, res) {
    const v49 = req.url;
    const v50 = v49.split('?');
    const v51 = v50[0];
    let urlPath = decodeURIComponent(v51);
    const v52 = urlPath === '/';
    const v53 = urlPath === '';
    const v54 = v52 || v53;
    if (v54) {
        const v55 = { Location: '/etc/' };
        const v56 = send(res, 302, 'Found', v55);
        return v56;
    }
    const v57 = '.' + urlPath;
    const fp = path.resolve(root, v57);
    const v58 = path.sep;
    const v59 = root + v58;
    const v60 = fp.startsWith(v59);
    const v61 = !v60;
    if (v61) {
        const v62 = send(res, 400, 'Bad Request');
        return v62;
    }
    const v78 = (err, stat) => {
        if (err) {
            const v63 = send(res, 404, 'Not Found');
            return v63;
        }
        let filePath = fp;
        const v64 = stat.isDirectory();
        if (v64) {
            const v65 = urlPath.endsWith('/');
            const v66 = !v65;
            if (v66) {
                const v67 = urlPath + '/';
                const v68 = { Location: v67 };
                const v69 = send(res, 302, 'Found', v68);
                return v69;
            }
            filePath = path.join(fp, 'index.html');
        }
        const v70 = path.extname(filePath);
        const ext = v70.toLowerCase();
        const v71 = mime[ext];
        const type = v71 || 'application/octet-stream';
        const stream = fs.createReadStream(filePath);
        const v73 = () => {
            const v72 = send(res, 500, 'Internal Server Error');
            return v72;
        };
        const v74 = stream.on('error', v73);
        v74;
        const v75 = {
            'Content-Type': type,
            'Cache-Control': 'no-cache'
        };
        const v76 = res.writeHead(200, v75);
        v76;
        const v77 = stream.pipe(res);
        v77;
    };
    const v79 = fs.stat(fp, v78);
    v79;
};
const v80 = http.createServer(handler);
const v83 = () => {
    const v81 = `Serving ${ root } at http://localhost:${ port }/ (default to /etc/index.html)`;
    const v82 = console.log(v81);
    v82;
};
const v84 = v80.listen(port, v83);
v84;