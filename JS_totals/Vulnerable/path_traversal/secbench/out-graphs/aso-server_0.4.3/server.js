const APP_NAME = 'aso-server';
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 3000;
const getHostPortFromPrompt = () => {
    const args = process.argv;
    const v165 = args.length;
    const v166 = v165 > 3;
    if (v166) {
        const v167 = console.log('Expected zero or one arguments.\n');
        v167;
        const v168 = help();
        const v169 = process.exit(v168);
        v169;
    }
    const v170 = args.length;
    const v171 = v170 < 3;
    if (v171) {
        const v172 = [
            DEFAULT_HOST,
            DEFAULT_PORT
        ];
        return v172;
    }
    const v173 = args[2];
    const v174 = v173.indexOf('help');
    const v175 = -1;
    const v176 = v174 > v175;
    const v177 = args[2];
    const v178 = v177.indexOf('?');
    const v179 = -1;
    const v180 = v178 > v179;
    const v181 = v176 || v180;
    const v182 = args[2];
    const v183 = v182 === '-h';
    const v184 = v181 || v183;
    if (v184) {
        const v185 = help();
        const v186 = process.exit(v185);
        v186;
    }
    const v187 = args[2];
    const hostPort = v187.split(':');
    const v188 = hostPort.length;
    const v189 = v188 == 1;
    const v190 = hostPort[0];
    const v191 = v190 > 0;
    const v192 = hostPort[0];
    const v193 = [
        DEFAULT_HOST,
        v192
    ];
    const v194 = hostPort[0];
    const v195 = [
        v194,
        DEFAULT_PORT
    ];
    let v196;
    if (v191) {
        v196 = v193;
    } else {
        v196 = v195;
    }
    const v197 = hostPort[0];
    const v198 = v197 != '';
    const v199 = hostPort[0];
    let v200;
    if (v198) {
        v200 = v199;
    } else {
        v200 = DEFAULT_HOST;
    }
    const v201 = hostPort[1];
    const v202 = v201 != '';
    const v203 = hostPort[1];
    let v204;
    if (v202) {
        v204 = v203;
    } else {
        v204 = DEFAULT_PORT;
    }
    const v205 = [
        v200,
        v204
    ];
    let v206;
    if (v189) {
        v206 = v196;
    } else {
        v206 = v205;
    }
    return v206;
};
const help = () => {
    const v207 = `\
Usage: node server [host:port OR host OR port]
Starts a simple HTTP file server.

Examples:
  node server                Uses default host and port
  node server 12345          Uses default host, port 12345
  node server localhost      Uses host localhost, default port
  node server 0.0.0.0:33669  Uses specified host and port
`;
    const v208 = console.log(v207);
    v208;
};
const getHtml = (title, body) => {
    const v209 = `<html><head><title>${ title }</title><link rel="icon" href="/f/favicon.png"></head><body>${ body }\n<ul>\n`;
    return v209;
};
const connectionHandler = (req, res) => {
    let method = req.method;
    const v210 = req.url;
    const v211 = v210.substring(1);
    let action = v211.split('/');
    let value;
    try {
        const v212 = action.slice(1);
        const v213 = v212.join('/');
        value = decodeURI(v213);
    } catch (e) {
        const v214 = { 'Content-Type': 'text/plain' };
        const v215 = res.writeHead(400, v214);
        v215;
        const v216 = res.end('400 Bad request');
        return v216;
    }
    action = action[0];
    const v217 = action == 'f';
    if (v217) {
        const v218 = writeFileContents(res, value, false);
        return v218;
    } else {
        const v219 = action == 'f.';
        if (v219) {
            const v220 = writeFileContents(res, './', true);
            return v220;
        } else {
            const v221 = action == 'favicon.ico';
            if (v221) {
                const v222 = writeFileContents(res, './favicon.png', false);
                return v222;
            } else {
                const v223 = action == 'i';
                if (v223) {
                    const v224 = writeFileInfo(res, value);
                    return v224;
                } else {
                    const v225 = action == 'i.';
                    if (v225) {
                        const v226 = writeFileInfo(res, '.');
                        return v226;
                    } else {
                        const v227 = action == 'd';
                        if (v227) {
                            const v228 = writeDirFiles(res, value);
                            return v228;
                        } else {
                            const v229 = action == 'd.';
                            if (v229) {
                                const v230 = writeDirFiles(res, '.');
                                return v230;
                            } else {
                                let body = `<h1><a href="/">${ APP_NAME }</a></h1>`;
                                const v231 = action == '';
                                if (v231) {
                                    const v232 = '<h2>Browse files:</h2><dl>' + '<dt><code>/f</code><dd><a href="/f">Root DIR</a>';
                                    const v233 = v232 + '<dt><code>/f.</code><dd><a href="/f.">Current DIR</a>';
                                    const v234 = v233 + '<dt><code>/f/&lt;path&gt;/&lt;to&gt;/&lt;file&gt;</code><dd> Current DIR relative file';
                                    body += v234 + '<dt><code>/f//&lt;path&gt;/&lt;to&gt;/&lt;file&gt;</code><dd>Root DIR relative file</dl>';
                                }
                                body += `<h2>Request:</h2><dl><dt>method:<dd>${ method }<dt>action:<dd>${ action } &nbsp;<dt>value:<dd>${ value } &nbsp;</dl></h2>`;
                                const v235 = { 'Content-Type': 'text/html' };
                                const v236 = res.writeHead(200, v235);
                                v236;
                                const v237 = getHtml(APP_NAME, body);
                                const v238 = res.end(v237);
                                v238;
                            }
                        }
                    }
                }
            }
        }
    }
};
const fs = require('fs');
const writeFileContents = (res, path, dotCommand) => {
    const v239 = path == '';
    if (v239) {
        path = '/';
    }
    try {
        let contents = fs.readFileSync(path);
        const v240 = res.writeHead(200);
        v240;
        const v241 = res.end(contents);
        return v241;
    } catch (e) {
        const v242 = e.code;
        const v243 = v242 === 'ENOENT';
        if (v243) {
            const v244 = res.writeHead(404, 'Not Found');
            v244;
            const v245 = res.end('404 Not Found');
            return v245;
        } else {
            const v246 = e.code;
            const v247 = v246 === 'EACCES';
            if (v247) {
                const v248 = res.writeHead(403, 'Access Denied');
                v248;
                const v249 = res.end('403 Access Denied');
                return v249;
            } else {
                const v250 = e.code;
                const v251 = v250 === 'EISDIR';
                if (v251) {
                    const v252 = listDirHtml(res, path, dotCommand);
                    return v252;
                }
            }
        }
        const v253 = { 'Content-Type': 'text/plain' };
        const v254 = res.writeHead(400, v253);
        v254;
        const v255 = JSON.stringify(e);
        const v256 = res.end(v255);
        return v256;
    }
};
const writeFileInfo = (res, path) => {
    const v257 = path == '';
    if (v257) {
        path = '/';
    }
    try {
        let stats = fs.statSync(path);
        const v258 = res.writeHead(200);
        v258;
        const v259 = JSON.stringify(stats);
        const v260 = res.end(v259);
        return v260;
    } catch (e) {
        const v261 = { 'Content-Type': 'text/plain' };
        const v262 = res.writeHead(400, v261);
        v262;
        const v263 = JSON.stringify(e);
        const v264 = res.end(v263);
        return v264;
    }
};
const writeDirFiles = (res, path) => {
    const v265 = path == '';
    if (v265) {
        path = '/';
    }
    const v266 = { 'Content-Type': 'text/plain' };
    const v267 = res.writeHead(200, v266);
    v267;
    const v268 = getDirFiles(path);
    const v269 = JSON.stringify(v268);
    const v270 = res.end(v269);
    return v270;
};
const getDirFiles = path => {
    let files;
    try {
        files = fs.readdirSync(path);
    } catch (e) {
        const v271 = e.code;
        const v272 = v271 !== 'ENOENT';
        const v273 = {};
        v273.exists = v272;
        return v273;
    }
    const v274 = [];
    const v275 = [];
    let result = {};
    result.exists = true;
    result.files = v274;
    result.dirs = v275;
    for (i in files) {
        let file = files[i];
        let isDir;
        try {
            const v276 = path + file;
            let fstat = fs.statSync(v276);
            isDir = fstat.isDirectory();
        } catch (e) {
            isDir = false;
        }
        let v277;
        if (isDir) {
            v277 = 'dirs';
        } else {
            v277 = 'files';
        }
        const v278 = result[v277];
        const v279 = v278.push(file);
        v279;
    }
    return result;
};
const listDirHtml = (res, path, dotCommand) => {
    const v280 = { 'Content-Type': 'text/html' };
    const v281 = res.writeHead(200, v280);
    v281;
    let body = `<h1>${ path }</h1>\n<ul>\n`;
    let files = fs.readdirSync(path);
    const v282 = !dotCommand;
    if (v282) {
        const v283 = path == '/';
        if (v283) {
            path = '';
        } else {
            path = '/';
        }
    }
    for (i in files) {
        let file = files[i];
        let dir;
        try {
            const v284 = path + file;
            let fstat = fs.statSync(v284);
            const v285 = fstat.isDirectory();
            if (v285) {
                dir = '[DIR] ';
            } else {
                dir = '';
            }
        } catch (e) {
            dir = '[?] ';
        }
        body += `<li>${ dir }<a href="/f/${ path }${ file }">${ file }</a></li>\n`;
    }
    body += '</ul>';
    const v286 = getHtml(path, body);
    const v287 = res.end(v286);
    return v287;
};
const startServerFromPrompt = () => {
    const v288 = getHostPortFromPrompt();
    const hostname = v288[0];
    const port = v288[1];
    const v289 = require('http');
    let server = v289.createServer(connectionHandler);
    try {
        const v294 = e => {
            const v290 = e.code;
            switch (v290) {
            case 'EADDRINUSE':
                msg = `ERROR: [EADDRINUSE] Address ${ hostname }:${ port } is already in use!\nIs ${ APP_NAME } already running?`;
                break;
            case 'ENOTFOUND':
                msg = `Hostname ${ hostname } cannot be used.`;
                break;
            case 'EADDRNOTAVAIL':
                msg = `Address ${ hostname }:${ port } is not available.`;
                break;
            case 'EACCES':
                msg = `Address ${ hostname }:${ port } cannot be used.`;
                break;
            default:
                const v291 = e.code;
                msg = `ERROR: [${ v291 }] ${ e }`;
            }
            const v292 = console.log(msg);
            v292;
            const v293 = server.close();
            v293;
        };
        const v295 = server.on('error', v294);
        const v297 = e => {
            const v296 = console.log('Server stopped.');
            v296;
        };
        const v298 = v295.on('close', v297);
        const v301 = () => {
            const v299 = `Server running at http://${ hostname }:${ port }/\nHit CTRL+C (or CMD+C) to stop`;
            const v300 = console.log(v299);
            v300;
        };
        const v302 = v298.listen(port, hostname, v301);
        v302;
    } catch (e) {
        const v303 = e.message;
        const v304 = console.log(v303);
        v304;
    }
};
const exportServerAsModule = () => {
    const v323 = (hostname, port) => {
        let server;
        let errorCallback = e => {
            const v305 = console.log(e);
            v305;
        };
        let stopCallback = errorCallback;
        const v318 = (hostname, port, startCallback) => {
            try {
                const v306 = require('http');
                server = v306.createServer(connectionHandler);
                const v307 = () => {
                };
                if (startCallback) {
                    startCallback = startCallback;
                } else {
                    startCallback = v307;
                }
                const v309 = e => {
                    const v308 = errorCallback(e);
                    return v308;
                };
                const v310 = server.on('error', v309);
                const v312 = () => {
                    const v311 = stopCallback();
                    return v311;
                };
                const v313 = v310.on('close', v312);
                const v315 = () => {
                    const v314 = startCallback(serverModule);
                    return v314;
                };
                const v316 = v313.listen(port, hostname, v315);
                v316;
            } catch (e) {
                const v317 = errorCallback(e);
                v317;
            }
            return serverModule;
        };
        const v319 = fn => {
            errorCallback = fn;
            return serverModule;
        };
        const v320 = fn => {
            stopCallback = fn;
            return serverModule;
        };
        const v322 = () => {
            const v321 = server.close();
            v321;
            return serverModule;
        };
        let serverModule = {};
        serverModule.start = v318;
        serverModule.onError = v319;
        serverModule.onStop = v320;
        serverModule.stop = v322;
        return serverModule;
    };
    const v324 = v323();
    module.exports = v324;
};
const v325 = require.main;
const v326 = v325 === module;
if (v326) {
    const v327 = startServerFromPrompt();
    v327;
} else {
    const v328 = exportServerAsModule();
    v328;
}