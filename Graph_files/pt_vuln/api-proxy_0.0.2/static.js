var Path = require('path');
var FS = require('fs');
const writeStatic = function (request, response, callback) {
    const v60 = require.resolve('api-proxy/lib/static.js');
    var root = Path.resolve(v60, '../../www');
    const v61 = request.url;
    var url = v61.replace(/[?#][\s\S]*/, '');
    var filepath = Path.join(root, url);
    const v69 = function (error, stats) {
        const v62 = stats.isDirectory();
        const v63 = stats && v62;
        if (v63) {
            const v64 = writeDir(request, response, filepath);
            return v64;
        }
        const v65 = !error;
        const v66 = stats && v65;
        if (v66) {
            const v67 = writeFile(request, response, filepath);
            v67;
        } else {
            const v68 = callback(request, response);
            v68;
        }
    };
    const v70 = FS.stat(filepath, v69);
    v70;
};
exports.writeStatic = writeStatic;
const writeContent = function (request, response, url, text) {
    var contentType = guessContentType(filepath);
    const v71 = new Date();
    const v72 = +v71;
    const v73 = 1000 * 1;
    const v74 = v72 + v73;
    var expires = new Date(v74);
    const v75 = expires.toGMTString();
    const v76 = +expires;
    var headers = {};
    headers['Content-Type'] = contentType;
    headers['Expires'] = v75;
    headers['Cache-Control'] = v76;
    const v77 = response.writeHead(200, headers);
    v77;
    const v78 = response.write(text);
    v78;
    const v79 = response.end();
    v79;
};
const writeFile = function (request, response, filepath) {
    var contentType = guessContentType(filepath);
    const v80 = { 'Content-Type': contentType };
    const v81 = response.writeHead(200, v80);
    v81;
    const v84 = function (err, tmp) {
        const v82 = response.write(tmp);
        v82;
        const v83 = response.end();
        v83;
    };
    const v85 = FS.readFile(filepath, 'binary', v84);
    v85;
};
const writeNotFound = function (request, response, filepath, msg) {
    const v86 = { 'Content-Type': 'text/plain' };
    const v87 = response.writeHead(200, v86);
    v87;
    const v88 = '404 Not Found \n filepath:' + filepath;
    const v89 = v88 + '\n';
    const v90 = msg || '';
    const v91 = v89 + v90;
    const v92 = response.write(v91);
    v92;
    const v93 = response.end();
    v93;
};
const writeDir = function (request, response, filepath) {
    var url = request.url;
    var purl = url.replace(/[?].*$/, '');
    const v94 = /\/$/.test(purl);
    if (v94) {
        const v108 = function (err, files) {
            const v95 = { 'Content-Type': 'text/html;charset=UTF-8' };
            const v96 = response.writeHead(200, v95);
            v96;
            const v97 = require.resolve('api-proxy/lib/index.html');
            const v106 = function (err, tmp) {
                var buf = [];
                var i = 0;
                const v98 = files.length;
                let v99 = i < v98;
                while (v99) {
                    var file = files[i];
                    const v101 = buf.push('<div class=\'file-row\'><a href=\'', file, '\'>', file, '</a></div>\n');
                    v101;
                    const v100 = i++;
                    v99 = i < v98;
                }
                const v102 = tmp.replace('$!{dir}', filepath);
                const v103 = buf.join('');
                tmp = v102.replace('$!{content}', v103);
                const v104 = response.write(tmp, 'utf-8');
                v104;
                const v105 = response.end();
                v105;
            };
            const v107 = FS.readFile(v97, 'utf-8', v106);
            v107;
        };
        const v109 = FS.readdir(filepath, v108);
        v109;
    } else {
        const v110 = purl + '/';
        const v111 = purl.length;
        const v112 = url.substring(v111);
        const v113 = v110 + v112;
        const v114 = { 'Location': v113 };
        const v115 = response.writeHead(301, v114);
        v115;
        const v116 = response.end();
        v116;
    }
};
const guessContentType = function (url) {
    const v117 = url.replace(/^.*\.(\w+)(?:[;?#].*)?$/, '$1');
    var type = v117.toLowerCase();
    switch (type) {
    case 'htc':
        type = 'application/octet-stream';
        break;
    case 'js':
        type = 'text/javascript;charset=utf-8';
        break;
    case 'css':
        type = 'text/css;charset=utf-8';
        break;
    case 'html':
    case 'htm':
        type = 'text/html;charset=utf-8';
        break;
    case 'jpg':
        type = 'jpeg';
    case 'png':
    case 'gif':
    case 'jpeg':
        type = 'image/' + type;
        break;
    default:
        const v118 = console.log('unknow:', type);
        v118;
        type = 'text/html;charset=utf-8';
    }
    return type;
};