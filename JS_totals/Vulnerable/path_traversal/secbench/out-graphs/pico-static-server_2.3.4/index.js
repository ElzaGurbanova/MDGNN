const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const MIME_TYPE_MAP = {};
MIME_TYPE_MAP['.css'] = 'text/css';
MIME_TYPE_MAP['.doc'] = 'application/msword';
MIME_TYPE_MAP['.htm'] = 'text/html';
MIME_TYPE_MAP['.html'] = 'text/html';
MIME_TYPE_MAP['.ico'] = 'image/x-icon';
MIME_TYPE_MAP['.jpg'] = 'image/jpeg';
MIME_TYPE_MAP['.jpeg'] = 'image/jpeg';
MIME_TYPE_MAP['.js'] = 'text/javascript';
MIME_TYPE_MAP['.json'] = 'application/json';
MIME_TYPE_MAP['.mp3'] = 'audio/mpeg';
MIME_TYPE_MAP['.png'] = 'image/png';
MIME_TYPE_MAP['.pdf'] = 'application/pdf';
MIME_TYPE_MAP['.svg'] = 'image/svg+xml';
MIME_TYPE_MAP['.swf'] = 'application/x-shockwave-flash';
MIME_TYPE_MAP['.tiff'] = 'image/tiff';
MIME_TYPE_MAP['.txt'] = 'text/plain';
MIME_TYPE_MAP['.wav'] = 'audio/wav';
MIME_TYPE_MAP['.xml'] = 'text/xml';
const DEFAULT_MIME_TYPE = 'text/plain';
const DEFAULT_OPTIONS = {};
DEFAULT_OPTIONS.defaultFile = 'index.html';
DEFAULT_OPTIONS.port = 9000;
DEFAULT_OPTIONS.staticPath = './';
const UNKNOWN_METHOD_RESPONSE_HEADERS = {};
UNKNOWN_METHOD_RESPONSE_HEADERS.Allow = 'GET, HEAD';
UNKNOWN_METHOD_RESPONSE_HEADERS['Content-Length'] = 0;
const respond = (res, code, headers, data) => {
    const v44 = http.STATUS_CODES;
    const v45 = v44[code];
    const v46 = res.writeHead(code, headers, v45);
    v46;
    const v47 = typeof data;
    const v48 = v47 !== 'undefined';
    if (v48) {
        const v49 = res.write(data);
        v49;
    }
    const v50 = res.end();
    v50;
};
const getMimeType = url => {
    const v51 = path.parse(url);
    const v52 = v51.ext;
    const v53 = MIME_TYPE_MAP[v52];
    const v54 = v53 || DEFAULT_MIME_TYPE;
    return v54;
};
const getIsDirectory = url => {
    const v55 = fs.statSync(url);
    const v56 = v55.isDirectory();
    return v56;
};
const createServer = customOptions => {
    const options = Object.assign(DEFAULT_OPTIONS, customOptions);
    const v81 = (req, res) => {
        const v57 = req.method;
        const v58 = v57 === 'OPTIONS';
        if (v58) {
            const v59 = respond(res, 200, UNKNOWN_METHOD_RESPONSE_HEADERS);
            v59;
            return;
        }
        const v60 = req.method;
        const v61 = v60 !== 'GET';
        const v62 = req.method;
        const v63 = v62 !== 'HEAD';
        const v64 = v61 && v63;
        if (v64) {
            const v65 = respond(res, 405, UNKNOWN_METHOD_RESPONSE_HEADERS);
            v65;
            return;
        }
        const v66 = req.url;
        const parsedUrl = url.parse(v66);
        const v67 = options.staticPath;
        const v68 = parsedUrl.pathname;
        let requestPath = path.join(v67, v68);
        const v69 = fs.existsSync(requestPath);
        if (v69) {
            const v70 = getIsDirectory(requestPath);
            if (v70) {
                const v71 = options.defaultFile;
                requestPath = path.join(requestPath, v71);
            }
            const data = fs.readFileSync(requestPath);
            const v72 = data instanceof Error;
            if (v72) {
                const v73 = { 'Content-Length': 0 };
                const v74 = respond(res, 500, v73);
                v74;
            } else {
                const v75 = getMimeType(requestPath);
                const v76 = data.length;
                const v77 = {
                    'Content-type': v75,
                    'Content-length': v76
                };
                const v78 = respond(res, 200, v77, data);
                v78;
            }
        } else {
            const v79 = { 'Content-Length': 0 };
            const v80 = respond(res, 404, v79);
            v80;
        }
    };
    const v82 = http.createServer(v81);
    const v83 = options.port;
    const serverHandle = v82.listen(v83);
    const v84 = options.port;
    const v85 = `Static server is listening on port ${ v84 }`;
    const v86 = console.log(v85);
    v86;
    return serverHandle;
};
module.exports = createServer;