var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
const v147 = process.env;
const v148 = v147.PORT;
var port = v148 || 8888;
const v149 = process.env;
const v150 = v149.IP;
var ip = v150 || '0.0.0.0';
const lookupMime = function (filename) {
    const v151 = /[^\/\\.]*$/.exec(filename);
    var ext = v151[0];
    const v152 = {
        js: 'application/javascript',
        ico: 'image/x-icon',
        css: 'text/css',
        svg: 'image/svg+xml',
        png: 'image/png',
        jpg: 'image/jpg',
        html: 'text/html',
        jpeg: 'image/jpeg'
    };
    const v153 = v152[ext];
    return v153;
};
const v154 = fs.exists;
const v155 = !v154;
if (v155) {
    const v156 = path.exists;
    fs.exists = v156;
}
const v157 = process.argv;
const v158 = v157.indexOf('--allow-save');
const v159 = -1;
var allowSave = v158 != v159;
if (allowSave) {
    const v160 = console.warn('writing files from browser is enabled');
    v160;
}
const v195 = function (req, res) {
    const v161 = req.url;
    const v162 = url.parse(v161);
    const v163 = v162.pathname;
    var uri = unescape(v163);
    const v164 = path.normalize(uri);
    const v165 = v164 !== uri;
    if (v165) {
        const v166 = error(res, 400, '400 Bad request: Directory traversal is not allowed.');
        return v166;
    }
    const v167 = process.cwd();
    var filename = path.join(v167, uri);
    const v168 = req.method;
    const v169 = v168 == 'OPTIONS';
    if (v169) {
        const v170 = writeHead(res, 200);
        v170;
        const v171 = res.end();
        return v171;
    }
    const v172 = req.method;
    const v173 = v172 == 'PUT';
    if (v173) {
        const v174 = !allowSave;
        if (v174) {
            const v175 = error(res, 404, 'Saving not allowed pass --allow-save to enable');
            return v175;
        }
        const v176 = save(req, res, filename);
        return v176;
    }
    const v193 = function (exists) {
        const v177 = !exists;
        if (v177) {
            const v178 = '404 Not Found\n' + filename;
            const v179 = error(res, 404, v178);
            return v179;
        }
        const v180 = fs.statSync(filename);
        const v181 = v180.isDirectory();
        if (v181) {
            const v182 = serveDirectory(filename, uri, req, res);
            return v182;
        }
        const v191 = function (err, file) {
            if (err) {
                const v183 = writeHead(res, 500, 'text/plain');
                v183;
                const v184 = err + '\n';
                const v185 = res.write(v184);
                v185;
                const v186 = res.end();
                v186;
                return;
            }
            const v187 = lookupMime(filename);
            var contentType = v187 || 'text/plain';
            const v188 = writeHead(res, 200, contentType);
            v188;
            const v189 = res.write(file, 'binary');
            v189;
            const v190 = res.end();
            v190;
        };
        const v192 = fs.readFile(filename, 'binary', v191);
        v192;
    };
    const v194 = fs.exists(filename, v193);
    v194;
};
const v196 = http.createServer(v195);
const v197 = v196.listen(port, ip);
v197;
const writeHead = function (res, code, contentType) {
    var headers = {};
    headers['Access-Control-Allow-Origin'] = 'file://';
    headers['Access-Control-Allow-Methods'] = 'PUT, GET, OPTIONS, HEAD';
    headers['Content-Type'] = contentType;
    const v198 = res.writeHead(code, headers);
    v198;
};
const serveDirectory = function (filename, uri, req, res) {
    var files = fs.readdirSync(filename);
    const v199 = writeHead(res, 200, 'text/html');
    v199;
    const v200 = files.push('..', '.');
    v200;
    const v210 = function (name) {
        try {
            const v201 = filename + '/';
            const v202 = v201 + name;
            var stat = fs.statSync(v202);
        } catch (e) {
        }
        let index;
        const v203 = name == '.';
        const v204 = name == '..';
        const v205 = stat.isDirectory();
        let v206;
        if (v205) {
            v206 = 1;
        } else {
            v206 = 0;
        }
        let v207;
        if (v204) {
            v207 = 3;
        } else {
            v207 = v206;
        }
        if (v203) {
            index = 2;
        } else {
            index = v207;
        }
        const v208 = stat.size;
        const v209 = {};
        v209.name = name;
        v209.index = index;
        v209.size = v208;
        return v209;
    };
    const v211 = files.map(v210);
    const v212 = v211.filter(Boolean);
    const v222 = function (a, b) {
        const v213 = a.index;
        const v214 = b.index;
        const v215 = v213 == v214;
        if (v215) {
            const v216 = a.name;
            const v217 = b.name;
            const v218 = v216.localeCompare(v217);
            return v218;
        }
        const v219 = b.index;
        const v220 = a.index;
        const v221 = v219 - v220;
        return v221;
    };
    const v223 = v212.sort(v222);
    const v249 = function (stat) {
        var name = stat.name;
        const v224 = stat.index;
        if (v224) {
            name += '/';
        }
        var size = '';
        const v225 = stat.size;
        const v226 = !v225;
        if (v226) {
            size = '';
        } else {
            const v227 = stat.size;
            const v228 = v227 < 1024;
            if (v228) {
                const v229 = stat.size;
                size = v229 + 'b';
            } else {
                const v230 = stat.size;
                const v231 = 1024 * 1024;
                const v232 = v230 < v231;
                if (v232) {
                    const v233 = stat.size;
                    const v234 = v233 / 1024;
                    const v235 = v234.toFixed(2);
                    size = v235 + 'kb';
                } else {
                    const v236 = stat.size;
                    const v237 = v236 / 1024;
                    const v238 = v237 / 1024;
                    const v239 = v238.toFixed(2);
                    size = v239 + 'mb';
                }
            }
        }
        const v240 = '<tr>' + '<td>&nbsp;&nbsp;';
        const v241 = v240 + size;
        const v242 = v241 + '&nbsp;&nbsp;</td>';
        const v243 = v242 + '<td><a href=\'';
        const v244 = v243 + name;
        const v245 = v244 + '\'>';
        const v246 = v245 + name;
        const v247 = v246 + '</a></td>';
        const v248 = v247 + '</tr>';
        return v248;
    };
    const v250 = v223.map(v249);
    var html = v250.join('');
    const v251 = '<table>' + html;
    html = v251 + '</table>';
    const v252 = res._hasBody;
    const v253 = res.write(html);
    const v254 = v252 && v253;
    v254;
    const v255 = res.end();
    v255;
};
const error = function (res, status, message, error) {
    const v256 = error || message;
    const v257 = console.error(v256);
    v257;
    const v258 = writeHead(res, status, 'text/plain');
    v258;
    const v259 = res.write(message);
    v259;
    const v260 = res.end();
    v260;
};
const save = function (req, res, filePath) {
    var data = '';
    const v261 = function (chunk) {
        data += chunk;
    };
    const v262 = req.on('data', v261);
    v262;
    const v264 = function () {
        const v263 = error(res, 404, 'Could\'t save file');
        v263;
    };
    const v265 = req.on('error', v264);
    v265;
    const v271 = function () {
        try {
            const v266 = fs.writeFileSync(filePath, data);
            v266;
        } catch (e) {
            const v267 = error(res, 404, 'Could\'t save file', e);
            return v267;
        }
        const v268 = writeHead(res, 200);
        v268;
        const v269 = res.end('OK');
        v269;
        const v270 = console.log('saved ', filePath);
        v270;
    };
    const v272 = req.on('end', v271);
    v272;
};
const getLocalIps = function () {
    var os = require('os');
    let interfaces;
    const v273 = os.networkInterfaces;
    const v274 = os.networkInterfaces();
    const v275 = {};
    if (v273) {
        interfaces = v274;
    } else {
        interfaces = v275;
    }
    var addresses = [];
    let k;
    for (k in interfaces) {
        let k2;
        const v276 = interfaces[k];
        for (k2 in v276) {
            const v277 = interfaces[k];
            var address = v277[k2];
            const v278 = address.family;
            const v279 = v278 === 'IPv4';
            const v280 = address.internal;
            const v281 = !v280;
            const v282 = v279 && v281;
            if (v282) {
                const v283 = address.address;
                const v284 = addresses.push(v283);
                v284;
            }
        }
    }
    return addresses;
};
const v285 = ip == '0.0.0.0';
const v286 = getLocalIps();
const v287 = v286[0];
let v288;
if (v285) {
    v288 = v287;
} else {
    v288 = ip;
}
const v289 = 'http://' + v288;
const v290 = v289 + ':';
const v291 = v290 + port;
const v292 = console.log(v291);
v292;