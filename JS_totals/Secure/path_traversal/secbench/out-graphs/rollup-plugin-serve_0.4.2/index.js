import { readFile } from 'fs';
import { createServer as createHttpsServer } from 'https';
import { createServer } from 'http';
import {
    resolve,
    normalize
} from 'path';
import mime from 'mime';
import opener from 'opener';
let server;
const serve = function (options = { contentBase: '' }) {
    const v116 = Array.isArray(options);
    const v117 = typeof options;
    const v118 = v117 === 'string';
    const v119 = v116 || v118;
    if (v119) {
        options.contentBase = options;
        options = {};
        options = {};
    }
    const v120 = options.contentBase;
    const v121 = Array.isArray(v120);
    const v122 = options.contentBase;
    const v123 = options.contentBase;
    const v124 = [v123];
    let v125;
    if (v121) {
        v125 = v122;
    } else {
        v125 = v124;
    }
    options.contentBase = v125;
    const v126 = options.host;
    options.host = v126 || 'localhost';
    const v127 = options.port;
    options.port = v127 || 10001;
    const v128 = options.headers;
    const v129 = {};
    options.headers = v128 || v129;
    const v130 = options.https;
    options.https = v130 || false;
    const v131 = options.openPage;
    options.openPage = v131 || '';
    mime.default_type = 'text/plain';
    const requestListener = (request, response) => {
        const v132 = request.url;
        const v133 = v132.split('?');
        const v134 = v133[0];
        const unsafePath = decodeURI(v134);
        const urlPath = normalize(unsafePath);
        const v135 = options.headers;
        const v136 = Object.keys(v135);
        const v140 = key => {
            const v137 = options.headers;
            const v138 = v137[key];
            const v139 = response.setHeader(key, v138);
            v139;
        };
        const v141 = v136.forEach(v140);
        v141;
        const v142 = options.contentBase;
        const v167 = function (error, content, filePath) {
            const v143 = !error;
            if (v143) {
                const v144 = found(response, filePath, content);
                return v144;
            }
            const v145 = error.code;
            const v146 = v145 !== 'ENOENT';
            if (v146) {
                const v147 = response.writeHead(500);
                v147;
                const v148 = '500 Internal Server Error' + '\n\n';
                const v149 = v148 + filePath;
                const v150 = v149 + '\n\n';
                const v151 = Object.values(error);
                const v152 = v151.join('\n');
                const v153 = v150 + v152;
                const v154 = v153 + '\n\n(rollup-plugin-serve)';
                const v155 = response.end(v154, 'utf-8');
                v155;
                return;
            }
            const v156 = options.historyApiFallback;
            if (v156) {
                let fallbackPath;
                const v157 = options.historyApiFallback;
                const v158 = typeof v157;
                const v159 = v158 === 'string';
                const v160 = options.historyApiFallback;
                if (v159) {
                    fallbackPath = v160;
                } else {
                    fallbackPath = '/index.html';
                }
                const v161 = options.contentBase;
                const v164 = function (error, content, filePath) {
                    if (error) {
                        const v162 = notFound(response, filePath);
                        v162;
                    } else {
                        const v163 = found(response, filePath, content);
                        v163;
                    }
                };
                const v165 = readFileFromContentBase(v161, fallbackPath, v164);
                v165;
            } else {
                const v166 = notFound(response, filePath);
                v166;
            }
        };
        const v168 = readFileFromContentBase(v142, urlPath, v167);
        v168;
    };
    if (server) {
        const v169 = server.close();
        v169;
    }
    const v170 = options.https;
    if (v170) {
        const v171 = options.https;
        const v172 = createHttpsServer(v171, requestListener);
        const v173 = options.port;
        const v174 = options.host;
        server = v172.listen(v173, v174);
    } else {
        const v175 = createServer(requestListener);
        const v176 = options.port;
        const v177 = options.host;
        server = v175.listen(v176, v177);
    }
    const v178 = closeServerOnTermination(server);
    v178;
    const v179 = options.verbose;
    var running = v179 === false;
    const v200 = function () {
        const v180 = !running;
        if (v180) {
            running = true;
            const v181 = options.https;
            let v182;
            if (v181) {
                v182 = 'https';
            } else {
                v182 = 'http';
            }
            const v183 = v182 + '://';
            const v184 = options.host;
            const v185 = v183 + v184;
            const v186 = v185 + ':';
            const v187 = options.port;
            const url = v186 + v187;
            const v188 = options.contentBase;
            const v194 = base => {
                const v189 = green(url);
                const v190 = v189 + ' -> ';
                const v191 = resolve(base);
                const v192 = v190 + v191;
                const v193 = console.log(v192);
                v193;
            };
            const v195 = v188.forEach(v194);
            v195;
            const v196 = options.open;
            if (v196) {
                const v197 = options.openPage;
                const v198 = url + v197;
                const v199 = opener(v198);
                v199;
            }
        }
    };
    const v201 = {};
    v201.name = 'serve';
    v201.generateBundle = v200;
    return v201;
};
const readFileFromContentBase = function (contentBase, urlPath, callback) {
    const v202 = contentBase[0];
    const v203 = v202 || '.';
    const v204 = '.' + urlPath;
    let filePath = resolve(v203, v204);
    const v205 = urlPath.endsWith('/');
    if (v205) {
        filePath = resolve(filePath, 'index.html');
    }
    const v212 = (error, content) => {
        const v206 = contentBase.length;
        const v207 = v206 > 1;
        const v208 = error && v207;
        if (v208) {
            const v209 = contentBase.slice(1);
            const v210 = readFileFromContentBase(v209, urlPath, callback);
            v210;
        } else {
            const v211 = callback(error, content, filePath);
            v211;
        }
    };
    const v213 = readFile(filePath, v212);
    v213;
};
const notFound = function (response, filePath) {
    const v214 = response.writeHead(404);
    v214;
    const v215 = '404 Not Found' + '\n\n';
    const v216 = v215 + filePath;
    const v217 = v216 + '\n\n(rollup-plugin-serve)';
    const v218 = response.end(v217, 'utf-8');
    v218;
};
const found = function (response, filePath, content) {
    const v219 = mime.getType(filePath);
    const v220 = { 'Content-Type': v219 };
    const v221 = response.writeHead(200, v220);
    v221;
    const v222 = response.end(content, 'utf-8');
    v222;
};
const green = function (text) {
    const v223 = '\x1B[1m\x1B[32m' + text;
    const v224 = v223 + '\x1B[39m\x1B[22m';
    return v224;
};
const closeServerOnTermination = function (server) {
    const terminationSignals = [
        'SIGINT',
        'SIGTERM'
    ];
    const v229 = signal => {
        const v227 = () => {
            const v225 = server.close();
            v225;
            const v226 = process.exit();
            v226;
        };
        const v228 = process.on(signal, v227);
        v228;
    };
    const v230 = terminationSignals.forEach(v229);
    v230;
};
export default serve;