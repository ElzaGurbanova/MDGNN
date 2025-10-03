'use strict';
const _interopDefault = function (ex) {
    const v122 = typeof ex;
    const v123 = v122 === 'object';
    const v124 = ex && v123;
    const v125 = 'default' in ex;
    const v126 = v124 && v125;
    const v127 = ex['default'];
    let v128;
    if (v126) {
        v128 = v127;
    } else {
        v128 = ex;
    }
    return v128;
};
var fs = require('fs');
var https = require('https');
var http = require('http');
var path = require('path');
const v129 = require('mime');
var mime = _interopDefault(v129);
const v130 = require('opener');
var opener = _interopDefault(v130);
const serve = function (options) {
    const v131 = void 0;
    const v132 = options === v131;
    if (v132) {
        options.contentBase = '';
        options = {};
        options = {};
    }
    const v133 = Array.isArray(options);
    const v134 = typeof options;
    const v135 = v134 === 'string';
    const v136 = v133 || v135;
    if (v136) {
        options.contentBase = options;
        options = {};
        options = {};
    }
    const v137 = options.contentBase;
    const v138 = Array.isArray(v137);
    const v139 = options.contentBase;
    const v140 = options.contentBase;
    const v141 = [v140];
    let v142;
    if (v138) {
        v142 = v139;
    } else {
        v142 = v141;
    }
    options.contentBase = v142;
    const v143 = options.host;
    options.host = v143 || 'localhost';
    const v144 = options.port;
    options.port = v144 || 10001;
    const v145 = options.index;
    options.index = v145 || 'index.html';
    const v146 = options.headers;
    const v147 = {};
    options.headers = v146 || v147;
    const v148 = options.https;
    options.https = v148 || false;
    const v149 = options.favicon;
    const v150 = path.resolve(__dirname, '../dist/favicon.ico');
    options.favicon = v149 || v150;
    mime.default_type = 'text/plain';
    var requestListener = function (request, response) {
        const v151 = request.url;
        const v152 = v151.split('?');
        const v153 = v152[0];
        var urlPath = decodeURI(v153);
        const v154 = options.headers;
        const v155 = Object.keys(v154);
        const v159 = function (key) {
            const v156 = options.headers;
            const v157 = v156[key];
            const v158 = response.setHeader(key, v157);
            v158;
        };
        const v160 = v155.forEach(v159);
        v160;
        const v161 = options.contentBase;
        const v193 = function (error, content, filePath) {
            const v162 = !error;
            if (v162) {
                const v163 = found(response, filePath, content);
                return v163;
            }
            const v164 = error.code;
            const v165 = v164 !== 'ENOENT';
            if (v165) {
                const v166 = response.writeHead(500);
                v166;
                const v167 = '500 Internal Server Error' + '\n\n';
                const v168 = v167 + filePath;
                const v169 = v168 + '\n\n';
                const v170 = Object.keys(error);
                const v172 = function (k) {
                    const v171 = error[k];
                    return v171;
                };
                const v173 = v170.map(v172);
                const v174 = v173.join('\n');
                const v175 = v169 + v174;
                const v176 = v175 + '\n\n(rollup-plugin-serve)';
                const v177 = response.end(v176, 'utf-8');
                v177;
                return;
            }
            const v178 = request.url;
            const v179 = v178 === '/favicon.ico';
            if (v179) {
                filePath = options.favicon;
                const v182 = function (error, content) {
                    if (error) {
                        const v180 = notFound(response, filePath);
                        v180;
                    } else {
                        const v181 = found(response, filePath, content);
                        v181;
                    }
                };
                const v183 = fs.readFile(filePath, v182);
                v183;
            } else {
                const v184 = options.historyApiFallback;
                if (v184) {
                    const v185 = options.contentBase;
                    const v186 = options.index;
                    const v187 = '/' + v186;
                    const v190 = function (error, content, filePath) {
                        if (error) {
                            const v188 = notFound(response, filePath);
                            v188;
                        } else {
                            const v189 = found(response, filePath, content);
                            v189;
                        }
                    };
                    const v191 = readFileFromContentBase(options, v185, v187, v190);
                    v191;
                } else {
                    const v192 = notFound(response, filePath);
                    v192;
                }
            }
        };
        const v194 = readFileFromContentBase(options, v161, urlPath, v193);
        v194;
    };
    var server;
    const v195 = options.https;
    if (v195) {
        const v196 = options.https;
        const v197 = https.createServer(v196, requestListener);
        const v198 = options.port;
        server = v197.listen(v198);
    } else {
        const v199 = http.createServer(requestListener);
        const v200 = options.port;
        server = v199.listen(v200);
    }
    const v201 = closeServerOnTermination(server);
    v201;
    const v202 = options.verbose;
    var running = v202 === false;
    const v213 = function ongenerate() {
        const v203 = !running;
        if (v203) {
            running = true;
            const v204 = options.https;
            let v205;
            if (v204) {
                v205 = 'https';
            } else {
                v205 = 'http';
            }
            const v206 = v205 + '://';
            const v207 = options.host;
            const v208 = v206 + v207;
            const v209 = v208 + ':';
            const v210 = options.port;
            var url = v209 + v210;
            const v211 = options.open;
            if (v211) {
                const v212 = opener(url);
                v212;
            }
        }
    };
    const v214 = {};
    v214.name = 'serve';
    v214.ongenerate = v213;
    return v214;
};
const readFileFromContentBase = function (options, contentBase, urlPath, callback) {
    const v215 = contentBase[0];
    const v216 = v215 || '.';
    const v217 = '.' + urlPath;
    var filePath = path.resolve(v216, v217);
    const v218 = urlPath.endsWith('/');
    if (v218) {
        const v219 = options.index;
        filePath = path.resolve(filePath, v219);
    }
    const v226 = function (error, content) {
        const v220 = contentBase.length;
        const v221 = v220 > 1;
        const v222 = error && v221;
        if (v222) {
            const v223 = contentBase.slice(1);
            const v224 = readFileFromContentBase(options, v223, urlPath, callback);
            v224;
        } else {
            const v225 = callback(error, content, filePath);
            v225;
        }
    };
    const v227 = fs.readFile(filePath, v226);
    v227;
};
const notFound = function (response, filePath) {
    const v228 = response.writeHead(404);
    v228;
    const v229 = '404 Not Found' + '\n\n';
    const v230 = v229 + filePath;
    const v231 = v230 + '\n\n(rollup-plugin-serve)';
    const v232 = response.end(v231, 'utf-8');
    v232;
};
const found = function (response, filePath, content) {
    const v233 = mime.lookup(filePath);
    const v234 = { 'Content-Type': v233 };
    const v235 = response.writeHead(200, v234);
    v235;
    const v236 = response.end(content, 'utf-8');
    v236;
};
const closeServerOnTermination = function (server) {
    var terminationSignals = [
        'SIGINT',
        'SIGTERM'
    ];
    const v241 = function (signal) {
        const v239 = function () {
            const v237 = server.close();
            v237;
            const v238 = process.exit();
            v238;
        };
        const v240 = process.on(signal, v239);
        v240;
    };
    const v242 = terminationSignals.forEach(v241);
    v242;
};
module.exports = serve;