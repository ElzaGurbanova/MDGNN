'use strict';
const _interopDefault = function (ex) {
    const v153 = typeof ex;
    const v154 = v153 === 'object';
    const v155 = ex && v154;
    const v156 = 'default' in ex;
    const v157 = v155 && v156;
    const v158 = ex['default'];
    let v159;
    if (v157) {
        v159 = v158;
    } else {
        v159 = ex;
    }
    return v159;
};
var fs = require('fs');
var https = require('https');
var http = require('http');
var path = require('path');
const v160 = require('mime');
var mime = _interopDefault(v160);
const v161 = require('opener');
var opener = _interopDefault(v161);
const serve = function (options) {
    const v162 = void 0;
    const v163 = options === v162;
    if (v163) {
        options.contentBase = '';
        options = {};
        options = {};
    }
    const v164 = Array.isArray(options);
    const v165 = typeof options;
    const v166 = v165 === 'string';
    const v167 = v164 || v166;
    if (v167) {
        options.contentBase = options;
        options = {};
        options = {};
    }
    const v168 = options.contentBase;
    const v169 = Array.isArray(v168);
    const v170 = options.contentBase;
    const v171 = options.contentBase;
    const v172 = [v171];
    let v173;
    if (v169) {
        v173 = v170;
    } else {
        v173 = v172;
    }
    options.contentBase = v173;
    const v174 = options.host;
    options.host = v174 || 'localhost';
    const v175 = options.port;
    options.port = v175 || 10001;
    const v176 = options.headers;
    const v177 = {};
    options.headers = v176 || v177;
    const v178 = options.https;
    options.https = v178 || false;
    mime.default_type = 'text/plain';
    var requestListener = function (request, response) {
        const v179 = request.url;
        const v180 = v179.split('?');
        const v181 = v180[0];
        var urlPath = decodeURI(v181);
        const v182 = options.headers;
        const v183 = Object.keys(v182);
        const v187 = function (key) {
            const v184 = options.headers;
            const v185 = v184[key];
            const v186 = response.setHeader(key, v185);
            v186;
        };
        const v188 = v183.forEach(v187);
        v188;
        const v189 = options.allowCrossOrigin;
        if (v189) {
            const v190 = response.setHeader('Access-Control-Allow-Origin', '*');
            v190;
            const v191 = response.setHeader('Access-Control-Request-Method', '*');
            v191;
            const v192 = response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
            v192;
            const v193 = response.setHeader('Access-Control-Allow-Headers', '*');
            v193;
            const v194 = request.method;
            const v195 = v194 === 'OPTIONS';
            if (v195) {
                const v196 = response.writeHead(200);
                v196;
                const v197 = response.end();
                v197;
                return;
            }
        }
        const v198 = options.contentBase;
        const v230 = function (error, content, filePath) {
            const v199 = !error;
            if (v199) {
                const v200 = hasRange(request);
                if (v200) {
                    const v201 = serveWithRanges(request, response, content);
                    return v201;
                }
                const v202 = found(response, filePath, content);
                return v202;
            }
            const v203 = error.code;
            const v204 = v203 !== 'ENOENT';
            if (v204) {
                const v205 = response.writeHead(500);
                v205;
                const v206 = '500 Internal Server Error' + '\n\n';
                const v207 = v206 + filePath;
                const v208 = v207 + '\n\n';
                const v209 = Object.keys(error);
                const v211 = function (k) {
                    const v210 = error[k];
                    return v210;
                };
                const v212 = v209.map(v211);
                const v213 = v212.join('\n');
                const v214 = v208 + v213;
                const v215 = v214 + '\n\n(rollup-plugin-serve)';
                const v216 = response.end(v215, 'utf-8');
                v216;
                return;
            }
            const v217 = request.url;
            const v218 = v217 === '/favicon.ico';
            if (v218) {
                filePath = path.resolve(__dirname, '../dist/favicon.ico');
                const v221 = function (error, content) {
                    if (error) {
                        const v219 = notFound(response, filePath);
                        v219;
                    } else {
                        const v220 = found(response, filePath, content);
                        v220;
                    }
                };
                const v222 = fs.readFile(filePath, v221);
                v222;
            } else {
                const v223 = options.historyApiFallback;
                if (v223) {
                    const v224 = options.contentBase;
                    const v227 = function (error, content, filePath) {
                        if (error) {
                            const v225 = notFound(response, filePath);
                            v225;
                        } else {
                            const v226 = found(response, filePath, content);
                            v226;
                        }
                    };
                    const v228 = readFileFromContentBase(v224, '/index.html', v227);
                    v228;
                } else {
                    const v229 = notFound(response, filePath);
                    v229;
                }
            }
        };
        const v231 = readFileFromContentBase(v198, urlPath, v230);
        v231;
    };
    var server;
    const v232 = options.https;
    if (v232) {
        const v233 = options.https;
        const v234 = https.createServer(v233, requestListener);
        const v235 = options.port;
        server = v234.listen(v235);
    } else {
        const v236 = http.createServer(requestListener);
        const v237 = options.port;
        server = v236.listen(v237);
    }
    const v238 = closeServerOnTermination(server);
    v238;
    const v239 = options.verbose;
    var running = v239 === false;
    const v258 = function ongenerate() {
        const v240 = !running;
        if (v240) {
            running = true;
            const v241 = options.https;
            let v242;
            if (v241) {
                v242 = 'https';
            } else {
                v242 = 'http';
            }
            const v243 = v242 + '://';
            const v244 = options.host;
            const v245 = v243 + v244;
            const v246 = v245 + ':';
            const v247 = options.port;
            var url = v246 + v247;
            const v248 = options.contentBase;
            const v254 = function (base) {
                const v249 = green(url);
                const v250 = v249 + ' -> ';
                const v251 = path.resolve(base);
                const v252 = v250 + v251;
                const v253 = console.log(v252);
                v253;
            };
            const v255 = v248.forEach(v254);
            v255;
            const v256 = options.open;
            if (v256) {
                const v257 = opener(url);
                v257;
            }
        }
    };
    const v259 = {};
    v259.name = 'serve';
    v259.ongenerate = v258;
    return v259;
};
const readFileFromContentBase = function (contentBase, urlPath, callback) {
    const v260 = contentBase[0];
    const v261 = v260 || '.';
    const v262 = '.' + urlPath;
    var filePath = path.resolve(v261, v262);
    const v263 = urlPath.endsWith('/');
    if (v263) {
        filePath = path.resolve(filePath, 'index.html');
    }
    const v270 = function (error, content) {
        const v264 = contentBase.length;
        const v265 = v264 > 1;
        const v266 = error && v265;
        if (v266) {
            const v267 = contentBase.slice(1);
            const v268 = readFileFromContentBase(v267, urlPath, callback);
            v268;
        } else {
            const v269 = callback(error, content, filePath);
            v269;
        }
    };
    const v271 = fs.readFile(filePath, v270);
    v271;
};
const notFound = function (response, filePath) {
    const v272 = response.writeHead(404);
    v272;
    const v273 = '404 Not Found' + '\n\n';
    const v274 = v273 + filePath;
    const v275 = v274 + '\n\n(rollup-plugin-serve)';
    const v276 = response.end(v275, 'utf-8');
    v276;
};
const found = function (response, filePath, content) {
    const v277 = mime.lookup(filePath);
    const v278 = { 'Content-Type': v277 };
    const v279 = response.writeHead(200, v278);
    v279;
    const v280 = response.end(content, 'utf-8');
    v280;
};
const hasRange = function (request) {
    const v281 = request.headers;
    const v282 = v281.range;
    var range = v282 || '';
    const v283 = range.replace(/bytes=/, '');
    var parts = v283.split('-');
    var partialstart = parts[0];
    var partialend = parts[1];
    const v284 = partialstart && partialend;
    return v284;
};
const serveWithRanges = function (request, response, content) {
    const v285 = request.headers;
    var range = v285.range;
    var total = content.length;
    const v286 = range.replace(/bytes=/, '');
    var parts = v286.split('-');
    var partialstart = parts[0];
    var partialend = parts[1];
    var start = parseInt(partialstart, 10);
    let end;
    const v287 = parseInt(partialend, 10);
    if (partialend) {
        end = v287;
    } else {
        end = total;
    }
    var chunksize = end - start;
    const v288 = 'bytes ' + start;
    const v289 = v288 + '-';
    const v290 = v289 + end;
    const v291 = v290 + '/';
    const v292 = v291 + total;
    const v293 = {
        'Content-Range': v292,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize
    };
    const v294 = response.writeHead(206, v293);
    v294;
    const v295 = content.slice(start, end);
    const v296 = response.end(v295);
    v296;
};
const green = function (text) {
    const v297 = '\x1B[1m\x1B[32m' + text;
    const v298 = v297 + '\x1B[39m\x1B[22m';
    return v298;
};
const closeServerOnTermination = function (server) {
    var terminationSignals = [
        'SIGINT',
        'SIGTERM'
    ];
    const v303 = function (signal) {
        const v301 = function () {
            const v299 = server.close();
            v299;
            const v300 = process.exit();
            v300;
        };
        const v302 = process.on(signal, v301);
        v302;
    };
    const v304 = terminationSignals.forEach(v303);
    v304;
};
module.exports = serve;