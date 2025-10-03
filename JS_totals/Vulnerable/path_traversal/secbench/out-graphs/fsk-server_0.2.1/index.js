var fs = require('fs');
const v102 = require('path');
var resolve = v102.resolve;
const v103 = require('path');
var basename = v103.basename;
const v104 = require('path');
var join = v104.join;
const v105 = require('path');
var extname = v105.extname;
var cwd = process.cwd();
var mime = require('mime');
var http = require('http');
var colors = require('colors');
var sid = 0;
var SSI_REG = /<!--#include virtual=\s*["']([^"']+)["']\s*-->/gi;
var STATIC_REG = /(['"])((http:)?\/\/.+?\.(?:css|js|png|gif|jpg)[^\1]*?)\1/gi;
const v106 = [
    'html',
    'htm',
    'shtml'
];
const v107 = { 'text/html': v106 };
const v108 = mime.define(v107);
v108;
const v109 = join(__dirname, 'favicon.ico');
var icoBuffer = fs.readFileSync(v109);
const v137 = function (req, res) {
    var headers = req.headers;
    var url = req.url;
    var method = req.method;
    var indexHtml;
    var data;
    const v110 = url === '/';
    if (v110) {
        const v111 = join(cwd, 'index.html');
        const v112 = fs.existsSync(v111);
        if (v112) {
            indexHtml = join(cwd, 'index.html');
        } else {
            const v113 = join(cwd, 'index.shtml');
            const v114 = fs.existsSync(v113);
            if (v114) {
                indexHtml = join(cwd, 'index.shtml');
            }
        }
        const v115 = !indexHtml;
        if (v115) {
            res.statusCode = 404;
            res.statusMessage = 'Not found';
            const v116 = res.setHeader('Content-type', 'text/html');
            v116;
            const v117 = res.end();
            v117;
            return false;
        }
    }
    const v118 = mime.lookup(url);
    const v119 = v118 === 'image/x-icon';
    if (v119) {
        res.statusCode = 200;
        const v120 = res.setHeader('Content-type', 'image/x-icon');
        v120;
        const v121 = res.end(icoBuffer);
        v121;
    } else {
        const v122 = req.url;
        url = join(cwd, v122);
        const v123 = fs.existsSync(url);
        if (v123) {
            data = fs.readFileSync(url, 'utf8');
            res.statusCode = 200;
            const v124 = mime.lookup(url);
            const v125 = res.setHeader('Content-type', v124);
            v125;
            sid = Date.now();
            const v129 = function (all, _path) {
                _path = join(cwd, _path);
                const v126 = fs.existsSync(_path);
                const v127 = fs.readFileSync(_path, 'utf8');
                let v128;
                if (v126) {
                    v128 = v127;
                } else {
                    v128 = '<!-- 404 Not found -->';
                }
                return v128;
            };
            data = data.replace(SSI_REG, v129);
            const v134 = function (all, character, _href) {
                const v130 = { sid: sid };
                const v131 = pug(v130, _href);
                const v132 = character + v131;
                const v133 = v132 + character;
                return v133;
            };
            data = data.replace(STATIC_REG, v134);
            const v135 = res.end(data);
            v135;
        } else {
            res.statusCode = 404;
            res.statusMessage = 'Not found';
            const v136 = res.end();
            v136;
        }
    }
};
const v138 = http.createServer(v137);
const v139 = v138.listen(3001);
v139;
const v140 = 'fsk-server:: listen 3001!'.magenta;
const v141 = console.log(v140);
v141;
const pug = function () {
    var param;
    var url;
    var hash;
    var name;
    var val;
    var reg;
    var omatch;
    var tmp;
    const v142 = !arguments;
    const v143 = arguments[0];
    const v144 = typeof v143;
    const v145 = v144 != 'object';
    const v146 = v142 || v145;
    if (v146) {
        return;
    }
    const v147 = arguments[1];
    const v148 = window.location;
    const v149 = v148.href;
    param = arguments[0], url = v147 || v149;
    url = url.split('#');
    const v150 = url[1];
    hash = v150 || '';
    url = url[0];
    let i;
    for (i in param) {
        const v151 = param.hasOwnProperty(i);
        if (v151) {
            name = i;
            val = param[i];
            const v152 = '([\\?&#])((' + name;
            const v153 = v152 + '=)([^&#]+))(&?)';
            reg = new RegExp(v153, 'i');
            omatch = url.match(reg);
            const v154 = val !== 0;
            const v155 = !val;
            const v156 = v154 && v155;
            const v157 = v156 && omatch;
            if (v157) {
                const v158 = omatch[5];
                const v159 = omatch[2];
                const v160 = v158 && v159;
                const v161 = omatch[2];
                const v162 = v161 + '&';
                const v163 = omatch[1];
                const v164 = omatch[2];
                const v165 = v163 && v164;
                const v166 = omatch[0];
                let v167;
                if (v165) {
                    url = url.replace(v166, '');
                    v167 = url;
                } else {
                    v167 = '';
                }
                let v168;
                if (v160) {
                    url = url.replace(v162, '');
                    v168 = url;
                } else {
                    v168 = v167;
                }
                v168;
            }
            const v169 = val === 0;
            const v170 = v169 || val;
            const v171 = !omatch;
            const v172 = v170 && v171;
            if (v172) {
                const v173 = url.indexOf('?');
                const v174 = -1;
                const v175 = v173 > v174;
                if (v175) {
                    tmp = url.split('?');
                    const v176 = tmp[0];
                    const v177 = v176 + '?';
                    const v178 = v177 + name;
                    const v179 = v178 + '=';
                    const v180 = v179 + val;
                    const v181 = v180 + '&';
                    const v182 = tmp[1];
                    url = v181 + v182;
                } else {
                    const v183 = '?' + name;
                    const v184 = v183 + '=';
                    url += v184 + val;
                }
            }
            const v185 = val === 0;
            const v186 = v185 || val;
            const v187 = omatch === 0;
            const v188 = v186 && v187;
            const v189 = omatch[4];
            const v190 = val != v189;
            const v191 = omatch && v190;
            const v192 = v188 || v191;
            if (v192) {
                const v193 = omatch[2];
                const v194 = omatch[3];
                const v195 = v194 + val;
                url = url.replace(v193, v195);
            }
        }
    }
    if (hash) {
        url += '#' + hash;
    }
    const v196 = arguments[1];
    const v197 = !v196;
    const v198 = window.location;
    const v199 = v198.href;
    const v200 = v199 != url;
    const v201 = v197 && v200;
    if (v201) {
        const v202 = window.location;
        v202.href = url;
    } else {
        return url;
    }
};