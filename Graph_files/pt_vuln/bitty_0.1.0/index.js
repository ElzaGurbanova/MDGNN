var http = require('http');
var fs = require('fs');
var child = require('child_process');
var util = require('util');
var path = require('path');
var chokidar = require('chokidar');
var program = require('commander');
var cri = require('chrome-remote-interface');
const v131 = program.usage('[options] <entries> -- [bundler options]');
v131;
const v132 = process.cwd();
const v133 = program.option('-C, --directory <path>', 'change the working directory', v132);
v133;
const v134 = program.option('-W, --watch <glob>', 'specify the file watcher glob pattern', '*/**');
v134;
const v135 = program.option('-b, --bundler <cmd>', 'specify the bundle command', 'browserify');
v135;
const v136 = program.option('-p, --port <port>', 'specify the http port', 4000);
v136;
const v137 = program.option('-h, --host <host>', 'specify the http hostname', undefined);
v137;
const v138 = program.option('-o, --open <program>', 'specify the client program');
v138;
const v139 = program.option('-i, --inject', 'enable bundle injection');
v139;
var pkg = require('./package.json');
const v140 = pkg.version;
const v141 = program.version(v140);
v141;
const v142 = process.argv;
var sub = v142.indexOf('--');
const v143 = -1;
const v144 = index > v143;
if (v144) {
    const v145 = process.argv;
    const v146 = v145.slice(0, sub);
    const v147 = program.parse(v146);
    v147;
    const v148 = program.bundler;
    const v149 = process.argv;
    const v150 = sub + 1;
    const v151 = v149.slice(v150);
    const v152 = v148.concat(v151);
    v152;
} else {
    const v153 = process.argv;
    const v154 = program.parse(v153);
    v154;
}
const file = function (req, res) {
    const v155 = program.directory;
    const v156 = req.url;
    var filepath = path.join(v155, v156);
    const v168 = function (exists) {
        if (exists) {
            const v163 = function (error, buffer) {
                if (error) {
                    const v157 = res.writeHead(500);
                    v157;
                    const v158 = res.write('500');
                    v158;
                    const v159 = res.end();
                    v159;
                }
                const v160 = res.writeHead(200);
                v160;
                const v161 = res.write(buffer);
                v161;
                const v162 = res.end();
                v162;
            };
            const v164 = fs.readFile(filepath, v163);
            v164;
        } else {
            const v165 = res.writeHead(404);
            v165;
            const v166 = res.write('404');
            v166;
            const v167 = res.end();
            v167;
        }
    };
    const v169 = fs.exists(filepath, v168);
    v169;
};
const bundle = function (req, res) {
    const v170 = res.setHeader('content-type', 'text/javascript');
    v170;
    const v171 = program.bundler;
    const v172 = program.args;
    const v173 = v172.join(' ');
    var cmd = util.format('%s %s', v171, v173);
    const v174 = console.log(cmd);
    v174;
    const v179 = function (error, stdout, stderr) {
        if (error) {
            const v175 = error.toString();
            const v176 = res.write(v175);
            v176;
        }
        if (stderr) {
            const v177 = console.error(stderr);
            v177;
        }
        const v178 = res.end(stdout);
        v178;
    };
    const v180 = child.exec(cmd, v179);
    v180;
};
const index = function (req, res) {
    const v184 = function (exists) {
        if (exists) {
            const v181 = file(req, res);
            return v181;
        } else {
            const v182 = res.setHeader('content-type', 'text/html');
            v182;
            const v183 = res.end('<!doctype html><head><meta charset="utf-8"></head><body><script src="index.js"></script></body></html>');
            v183;
        }
    };
    const v185 = fs.exists('index.html', v184);
    v185;
};
const watch = function (req, res) {
    const v186 = req.setTimeout(Infinity);
    v186;
    const v187 = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    };
    const v188 = res.writeHead(200, v187);
    v188;
    const v189 = res.write('\n');
    v189;
    var listener = function (filename) {
        const v190 = filename[0];
        const v191 = v190 == '.';
        if (v191) {
            return;
        }
        const v192 = path.extname(filename);
        const v193 = v192 == '.js';
        if (v193) {
            filename = 'index.js';
        }
        const v194 = 'data: ' + filename;
        const v195 = v194 + '\n\n';
        const v196 = res.write(v195);
        v196;
    };
    const v197 = watcher.on('change', listener);
    v197;
    const v199 = function () {
        const v198 = watcher.removeListener('change', listener);
        v198;
    };
    const v200 = res.on('close', v199);
    v200;
};
const v201 = program.watch;
var watcher = chokidar.watch(v201);
var server = http.createServer();
const v207 = function (req, res) {
    const v202 = req.url;
    switch (v202) {
    case '/watch':
        const v203 = watch(req, res);
        return v203;
    case '/index.js':
        const v204 = bundle(req, res);
        return v204;
    case '/':
        const v205 = index(req, res);
        return v205;
    default:
        const v206 = file(req, res);
        return v206;
    }
};
const v208 = server.on('request', v207);
v208;
const v209 = program.port;
const v210 = program.host;
const v222 = function () {
    var address = server.address();
    const v211 = address.address;
    const v212 = address.port;
    const v213 = console.log('serving on http://%s:%d', v211, v212);
    v213;
    const v214 = program.open;
    if (v214) {
        const v215 = program.open;
        const v216 = address.address;
        const v217 = address.port;
        var cmd = util.format('%s http://%s:%d', v215, v216, v217);
        const v218 = console.log(cmd);
        v218;
        const v220 = function (error, stdout, stderr) {
            if (error) {
                const v219 = console.error(stderr);
                return v219;
            }
        };
        const v221 = child.exec(cmd, v220);
        v221;
    }
};
const v223 = server.listen(v209, v210, v222);
v223;
const v224 = program.inject;
if (v224) {
    var bundleId = undefined;
    const v259 = function connect() {
        var client = cri();
        const v226 = function () {
            const v225 = setTimeout(connect, 500);
            v225;
        };
        const v227 = client.on('error', v226);
        v227;
        const v257 = function (chrome) {
            const v245 = function injectBundle(filename) {
                const v228 = path.extname(filename);
                const v229 = v228 == '.js';
                if (v229) {
                    const v230 = program.bundler;
                    const v231 = program.args;
                    const v232 = v231.join(' ');
                    var cmd = util.format('%s %s', v230, v232);
                    const v243 = function (error, stdout, stderr) {
                        if (error) {
                            const v233 = console.error(stderr);
                            return v233;
                        }
                        const v234 = bundleId == undefined;
                        if (v234) {
                            const v235 = console.log('buhu');
                            v235;
                        }
                        if (stdout) {
                            const v236 = console.log(bundleId);
                            v236;
                            const v237 = chrome.Debugger;
                            const v238 = {
                                scriptId: bundleId,
                                scriptSource: stdout
                            };
                            const v241 = function (error, response) {
                                if (error) {
                                    const v239 = console.log(response);
                                    return v239;
                                }
                                const v240 = console.log('Recompilation and update succeeded.');
                                v240;
                            };
                            const v242 = v237.setScriptSource(v238, v241);
                            v242;
                        }
                    };
                    const v244 = child.exec(cmd, v243);
                    v244;
                }
            };
            const v246 = watcher.on('change', v245);
            v246;
            const v248 = function () {
                const v247 = watcher.removeListener('change', injectBundle);
                v247;
            };
            const v249 = chrome.on('close', v248);
            v249;
            const v252 = function (params) {
                const v250 = params.url;
                const v251 = v250 == 'http://0.0.0.0:4000/index.js';
                if (v251) {
                    bundleId = params.scriptId;
                }
            };
            const v253 = chrome.on('Debugger.scriptParsed', v252);
            v253;
            const v254 = chrome.Debugger;
            const v255 = function () {
            };
            const v256 = v254.enable(v255);
            v256;
        };
        const v258 = client.on('connect', v257);
        v258;
    };
    const v260 = setTimeout(v259, 500);
    v260;
}