import { readFile } from 'fs';
import { createServer as createHttpsServer } from 'https';
import { createServer } from 'http';
import { resolve } from 'path';
import mime from 'mime';
import opener from 'opener';
let server;
const serve = function (options = { contentBase: '' }) {
    const v126 = Array.isArray(options);
    const v127 = typeof options;
    const v128 = v127 === 'string';
    const v129 = v126 || v128;
    if (v129) {
        options.contentBase = options;
        options = {};
        options = {};
    }
    const v130 = options.contentBase;
    const v131 = Array.isArray(v130);
    const v132 = options.contentBase;
    const v133 = options.contentBase;
    const v134 = v133 || '';
    const v135 = [v134];
    let v136;
    if (v131) {
        v136 = v132;
    } else {
        v136 = v135;
    }
    options.contentBase = v136;
    const v137 = options.port;
    options.port = v137 || 10001;
    const v138 = options.headers;
    const v139 = {};
    options.headers = v138 || v139;
    const v140 = options.https;
    options.https = v140 || false;
    const v141 = options.openPage;
    options.openPage = v141 || '';
    mime.default_type = 'text/plain';
    const requestListener = (request, response) => {
        const v142 = request.url;
        const v143 = v142.split('?');
        const v144 = v143[0];
        const urlPath = decodeURI(v144);
        const v145 = options.headers;
        const v146 = Object.keys(v145);
        const v150 = key => {
            const v147 = options.headers;
            const v148 = v147[key];
            const v149 = response.setHeader(key, v148);
            v149;
        };
        const v151 = v146.forEach(v150);
        v151;
        const v152 = options.contentBase;
        const v177 = function (error, content, filePath) {
            const v153 = !error;
            if (v153) {
                const v154 = found(response, filePath, content);
                return v154;
            }
            const v155 = error.code;
            const v156 = v155 !== 'ENOENT';
            if (v156) {
                const v157 = response.writeHead(500);
                v157;
                const v158 = '500 Internal Server Error' + '\n\n';
                const v159 = v158 + filePath;
                const v160 = v159 + '\n\n';
                const v161 = Object.values(error);
                const v162 = v161.join('\n');
                const v163 = v160 + v162;
                const v164 = v163 + '\n\n(rollup-plugin-serve)';
                const v165 = response.end(v164, 'utf-8');
                v165;
                return;
            }
            const v166 = options.historyApiFallback;
            if (v166) {
                let fallbackPath;
                const v167 = options.historyApiFallback;
                const v168 = typeof v167;
                const v169 = v168 === 'string';
                const v170 = options.historyApiFallback;
                if (v169) {
                    fallbackPath = v170;
                } else {
                    fallbackPath = '/index.html';
                }
                const v171 = options.contentBase;
                const v174 = function (error, content, filePath) {
                    if (error) {
                        const v172 = notFound(response, filePath);
                        v172;
                    } else {
                        const v173 = found(response, filePath, content);
                        v173;
                    }
                };
                const v175 = readFileFromContentBase(v171, fallbackPath, v174);
                v175;
            } else {
                const v176 = notFound(response, filePath);
                v176;
            }
        };
        const v178 = readFileFromContentBase(v152, urlPath, v177);
        v178;
    };
    if (server) {
        const v179 = server.close();
        v179;
    } else {
        const v180 = closeServerOnTermination();
        v180;
    }
    const v181 = options.https;
    if (v181) {
        const v182 = options.https;
        const v183 = createHttpsServer(v182, requestListener);
        const v184 = options.port;
        const v185 = options.host;
        server = v183.listen(v184, v185);
    } else {
        const v186 = createServer(requestListener);
        const v187 = options.port;
        const v188 = options.host;
        server = v186.listen(v187, v188);
    }
    let protocol;
    const v189 = options.https;
    if (v189) {
        protocol = 'https';
    } else {
        protocol = 'http';
    }
    const v190 = options.host;
    const hostname = v190 || 'localhost';
    const v191 = protocol + '://';
    const v192 = v191 + hostname;
    const v193 = v192 + ':';
    const v194 = options.port;
    const url = v193 + v194;
    const v200 = e => {
        const v195 = e.code;
        const v196 = v195 === 'EADDRINUSE';
        if (v196) {
            const v197 = url + ' is in use, either stop the other server or use a different port.';
            const v198 = console.error(v197);
            v198;
            const v199 = process.exit();
            v199;
        } else {
            throw e;
        }
    };
    const v201 = server.on('error', v200);
    v201;
    const v202 = options.verbose;
    let running = v202 === false;
    const v220 = function () {
        const v203 = !running;
        if (v203) {
            running = true;
            const v204 = options.contentBase;
            const v210 = base => {
                const v205 = green(url);
                const v206 = v205 + ' -> ';
                const v207 = resolve(base);
                const v208 = v206 + v207;
                const v209 = console.log(v208);
                v209;
            };
            const v211 = v204.forEach(v210);
            v211;
            const v212 = options.open;
            if (v212) {
                const v213 = options.openPage;
                const v214 = /https?:\/\/.+/.test(v213);
                if (v214) {
                    const v215 = options.openPage;
                    const v216 = opener(v215);
                    v216;
                } else {
                    const v217 = options.openPage;
                    const v218 = url + v217;
                    const v219 = opener(v218);
                    v219;
                }
            }
        }
    };
    const v221 = {};
    v221.name = 'serve';
    v221.generateBundle = v220;
    return v221;
};
const readFileFromContentBase = function (contentBase, urlPath, callback) {
    const v222 = contentBase[0];
    const v223 = v222 || '.';
    const v224 = '.' + urlPath;
    let filePath = resolve(v223, v224);
    const v225 = urlPath.endsWith('/');
    if (v225) {
        filePath = resolve(filePath, 'index.html');
    }
    const v232 = (error, content) => {
        const v226 = contentBase.length;
        const v227 = v226 > 1;
        const v228 = error && v227;
        if (v228) {
            const v229 = contentBase.slice(1);
            const v230 = readFileFromContentBase(v229, urlPath, callback);
            v230;
        } else {
            const v231 = callback(error, content, filePath);
            v231;
        }
    };
    const v233 = readFile(filePath, v232);
    v233;
};
const notFound = function (response, filePath) {
    const v234 = response.writeHead(404);
    v234;
    const v235 = '404 Not Found' + '\n\n';
    const v236 = v235 + filePath;
    const v237 = v236 + '\n\n(rollup-plugin-serve)';
    const v238 = response.end(v237, 'utf-8');
    v238;
};
const found = function (response, filePath, content) {
    const v239 = mime.getType(filePath);
    const v240 = { 'Content-Type': v239 };
    const v241 = response.writeHead(200, v240);
    v241;
    const v242 = response.end(content, 'utf-8');
    v242;
};
const green = function (text) {
    const v243 = '\x1B[1m\x1B[32m' + text;
    const v244 = v243 + '\x1B[39m\x1B[22m';
    return v244;
};
const closeServerOnTermination = function () {
    const terminationSignals = [
        'SIGINT',
        'SIGTERM',
        'SIGQUIT',
        'SIGHUP'
    ];
    const v249 = signal => {
        const v247 = () => {
            if (server) {
                const v245 = server.close();
                v245;
                const v246 = process.exit();
                v246;
            }
        };
        const v248 = process.on(signal, v247);
        v248;
    };
    const v250 = terminationSignals.forEach(v249);
    v250;
};
export default serve;