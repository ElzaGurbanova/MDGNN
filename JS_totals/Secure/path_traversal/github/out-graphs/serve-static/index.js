'use strict';
var encodeUrl = require('encodeurl');
var escapeHtml = require('escape-html');
var parseUrl = require('parseurl');
const v92 = require('path');
var resolve = v92.resolve;
var send = require('send');
var url = require('url');
module.exports = serveStatic;
const serveStatic = function (root, options) {
    const v93 = !root;
    if (v93) {
        const v94 = new TypeError('root path required');
        throw v94;
    }
    const v95 = typeof root;
    const v96 = v95 !== 'string';
    if (v96) {
        const v97 = new TypeError('root path must be a string');
        throw v97;
    }
    const v98 = options || null;
    var opts = Object.create(v98);
    const v99 = opts.fallthrough;
    var fallthrough = v99 !== false;
    const v100 = opts.redirect;
    var redirect = v100 !== false;
    var setHeaders = opts.setHeaders;
    const v101 = typeof setHeaders;
    const v102 = v101 !== 'function';
    const v103 = setHeaders && v102;
    if (v103) {
        const v104 = new TypeError('option setHeaders must be function');
        throw v104;
    }
    const v105 = opts.maxage;
    const v106 = opts.maxAge;
    const v107 = v105 || v106;
    opts.maxage = v107 || 0;
    const v108 = resolve(root);
    opts.root = v108;
    let onDirectory;
    const v109 = createRedirectDirectoryListener();
    const v110 = createNotFoundDirectoryListener();
    if (redirect) {
        onDirectory = v109;
    } else {
        onDirectory = v110;
    }
    const v141 = function serveStatic(req, res, next) {
        const v111 = req.method;
        const v112 = v111 !== 'GET';
        const v113 = req.method;
        const v114 = v113 !== 'HEAD';
        const v115 = v112 && v114;
        if (v115) {
            if (fallthrough) {
                const v116 = next();
                return v116;
            }
            res.statusCode = 405;
            const v117 = res.setHeader('Allow', 'GET, HEAD');
            v117;
            const v118 = res.setHeader('Content-Length', '0');
            v118;
            const v119 = res.end();
            v119;
            return;
        }
        const v120 = !fallthrough;
        var forwardError = v120;
        var originalUrl = parseUrl.original(req);
        const v121 = parseUrl(req);
        var path = v121.pathname;
        const v122 = path === '/';
        const v123 = originalUrl.pathname;
        const v124 = -1;
        const v125 = v123.substr(v124);
        const v126 = v125 !== '/';
        const v127 = v122 && v126;
        if (v127) {
            path = '';
        }
        var stream = send(req, path, opts);
        const v128 = stream.on('directory', onDirectory);
        v128;
        if (setHeaders) {
            const v129 = stream.on('headers', setHeaders);
            v129;
        }
        if (fallthrough) {
            const v130 = function onFile() {
                forwardError = true;
            };
            const v131 = stream.on('file', v130);
            v131;
        }
        const v138 = function error(err) {
            const v132 = err.statusCode;
            const v133 = v132 < 500;
            const v134 = !v133;
            const v135 = forwardError || v134;
            if (v135) {
                const v136 = next(err);
                v136;
                return;
            }
            const v137 = next();
            v137;
        };
        const v139 = stream.on('error', v138);
        v139;
        const v140 = stream.pipe(res);
        v140;
    };
    return v141;
};
const collapseLeadingSlashes = function (str) {
    var i = 0;
    const v142 = str.length;
    let v143 = i < v142;
    while (v143) {
        const v145 = str.charCodeAt(i);
        const v146 = v145 !== 47;
        if (v146) {
            break;
        }
        const v144 = i++;
        v143 = i < v142;
    }
    const v147 = i > 1;
    const v148 = str.substr(i);
    const v149 = '/' + v148;
    let v150;
    if (v147) {
        v150 = v149;
    } else {
        v150 = str;
    }
    return v150;
};
const createHtmlDocument = function (title, body) {
    const v151 = '<!DOCTYPE html>\n' + '<html lang="en">\n';
    const v152 = v151 + '<head>\n';
    const v153 = v152 + '<meta charset="utf-8">\n';
    const v154 = v153 + '<title>';
    const v155 = v154 + title;
    const v156 = v155 + '</title>\n';
    const v157 = v156 + '</head>\n';
    const v158 = v157 + '<body>\n';
    const v159 = v158 + '<pre>';
    const v160 = v159 + body;
    const v161 = v160 + '</pre>\n';
    const v162 = v161 + '</body>\n';
    const v163 = v162 + '</html>\n';
    return v163;
};
const createNotFoundDirectoryListener = function () {
    const v165 = function notFound() {
        const v164 = this.error(404);
        v164;
    };
    return v165;
};
const createRedirectDirectoryListener = function () {
    const v182 = function redirect(res) {
        const v166 = this.hasTrailingSlash();
        if (v166) {
            const v167 = this.error(404);
            v167;
            return;
        }
        const v168 = this.req;
        var originalUrl = parseUrl.original(v168);
        originalUrl.path = null;
        const v169 = originalUrl.pathname;
        const v170 = v169 + '/';
        const v171 = collapseLeadingSlashes(v170);
        originalUrl.pathname = v171;
        const v172 = url.format(originalUrl);
        var loc = encodeUrl(v172);
        const v173 = escapeHtml(loc);
        const v174 = 'Redirecting to ' + v173;
        var doc = createHtmlDocument('Redirecting', v174);
        res.statusCode = 301;
        const v175 = res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        v175;
        const v176 = Buffer.byteLength(doc);
        const v177 = res.setHeader('Content-Length', v176);
        v177;
        const v178 = res.setHeader('Content-Security-Policy', 'default-src \'none\'');
        v178;
        const v179 = res.setHeader('X-Content-Type-Options', 'nosniff');
        v179;
        const v180 = res.setHeader('Location', loc);
        v180;
        const v181 = res.end(doc);
        v181;
    };
    return v182;
};