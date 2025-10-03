var SimpleStream = require('./SimpleStream');
var repl = require('repl');
var http = require('http');
var fs = require('fs');
var util = require('util');
var ReplHttpServer = function ReplHttpServer(prompt, stream, replServer, options) {
    this.running = false;
    this.prompt = prompt;
    this.stream = stream;
    this.replServer = replServer;
    this.webdir = __dirname;
    const v171 = options !== undefined;
    if (v171) {
        const v172 = options.username;
        const v173 = v172 !== undefined;
        if (v173) {
            const v174 = options.username;
            this.username = v174;
        }
        const v175 = options.username;
        const v176 = v175 !== undefined;
        if (v176) {
            const v177 = options.password;
            this.password = v177;
        }
        const v178 = options.hostname;
        const v179 = v178 !== undefined;
        if (v179) {
            const v180 = options.hostname;
            this.hostname = v180;
        }
    }
};
const v181 = ReplHttpServer.prototype;
const v204 = function (port) {
    var self = this;
    const v182 = this.username;
    const v183 = v182 !== undefined;
    const v184 = this.password;
    const v185 = v184 !== undefined;
    const v186 = v183 && v185;
    if (v186) {
        var httpdigest = require('./http-digest');
        const v187 = this.username;
        const v188 = this.password;
        const v190 = function (req, res) {
            const v189 = self.route(req, res);
            v189;
        };
        const v191 = httpdigest.createServer(v187, v188, v190);
        self.server = v191;
        const v192 = self.server;
        const v193 = this.hostname;
        const v194 = v192.listen(port, v193);
        v194;
    } else {
        const v196 = function (req, res) {
            const v195 = self.route(req, res);
            v195;
        };
        const v197 = http.createServer(v196);
        self.server = v197;
        const v198 = self.server;
        const v199 = function () {
        };
        const v200 = v198.on('error', v199);
        v200;
        const v201 = self.server;
        const v202 = this.hostname;
        const v203 = v201.listen(port, v202);
        v203;
    }
    return self;
};
v181.start = v204;
const v205 = ReplHttpServer.prototype;
const v312 = function (req, res) {
    var stream = this.stream;
    const v206 = function () {
    };
    const v207 = req.on('error', v206);
    v207;
    const v208 = function () {
    };
    const v209 = res.on('error', v208);
    v209;
    var match = null;
    const v210 = req.url;
    const v211 = v210.match(/^\/repl/);
    if (v211) {
        const v212 = req.method;
        const v213 = v212 === 'GET';
        if (v213) {
            const v214 = { 'Content-Type': 'text/plain' };
            const v215 = res.writeHead(200, v214);
            v215;
            var resBody = '';
            const v216 = stream.messages;
            const v217 = v216.length;
            let v218 = v217 > 0;
            while (v218) {
                const v219 = stream.messages;
                var msg = v219.shift();
                const v220 = this.prompt;
                const v221 = '^' + v220;
                const v222 = msg.match(v221);
                const v223 = !v222;
                if (v223) {
                    resBody += msg;
                }
                v218 = v217 > 0;
            }
            const v224 = res.end(resBody);
            v224;
        } else {
            const v225 = req.method;
            const v226 = v225 === 'POST';
            if (v226) {
                var allData = '';
                const v227 = function (data) {
                    allData += data;
                };
                const v228 = req.on('data', v227);
                v228;
                const v236 = function () {
                    allData += '\n';
                    const v229 = stream.emit('data', allData);
                    if (v229) {
                        const v230 = { 'Content-Type': 'text/plain' };
                        const v231 = res.writeHead(200, v230);
                        v231;
                        const v232 = res.end();
                        v232;
                    } else {
                        const v233 = { 'Content-Type': 'text/plain' };
                        const v234 = res.writeHead(500, v233);
                        v234;
                        const v235 = res.end();
                        v235;
                    }
                };
                const v237 = req.on('end', v236);
                v237;
            }
        }
    } else {
        const v238 = req.url;
        if (match = v238.match(/^\/context\/([a-zA-Z_$][0-9a-zA-Z_$\.]*)$/)) {
            try {
                const v239 = match[1];
                const v240 = 'this.replServer.context.' + v239;
                var obj = eval(v240);
                if (obj) {
                    const v241 = { 'Content-Type': 'application/json' };
                    const v242 = res.writeHead(200, v241);
                    v242;
                    const v243 = JSON.stringify(obj);
                    const v244 = res.end(v243);
                    v244;
                } else {
                    const v245 = res.writeHeader(404);
                    v245;
                    const v246 = res.end();
                    v246;
                }
            } catch (err) {
                const v247 = err.toString();
                const v248 = 'Error resolving context request: ' + v247;
                const v249 = console.log(v248);
                v249;
                const v250 = res.writeHeader(500);
                v250;
                const v251 = res.end();
                v251;
            }
        } else {
            const v252 = req.url;
            if (match = v252.match(/^\/complete\/(.*)/)) {
                const v253 = match[1];
                const v254 = v253.length;
                const v255 = v254 > 0;
                if (v255) {
                    const v256 = this.replServer;
                    const v257 = match[1];
                    const v263 = function (o, completions) {
                        const v258 = completions[0];
                        var cObj = {};
                        cObj['completions'] = v258;
                        const v259 = { 'Content-Type': 'application/json' };
                        const v260 = res.writeHead(200, v259);
                        v260;
                        const v261 = JSON.stringify(cObj);
                        const v262 = res.end(v261);
                        v262;
                    };
                    var completionsOld = v256.complete(v257, v263);
                    const v264 = completionsOld !== undefined;
                    if (v264) {
                        const v265 = completionsOld[0];
                        var cObj = {};
                        cObj['completions'] = v265;
                        const v266 = { 'Content-Type': 'application/json' };
                        const v267 = res.writeHead(200, v266);
                        v267;
                        const v268 = JSON.stringify(cObj);
                        const v269 = res.end(v268);
                        v269;
                    }
                } else {
                    const v270 = { 'Content-Type': 'application/json' };
                    const v271 = res.writeHead(500, v270);
                    v271;
                    const v272 = res.end();
                    v272;
                }
            } else {
                const v273 = req.url;
                const v274 = v273.match(/^\/info/);
                if (v274) {
                    let name;
                    const v275 = process.argv;
                    const v276 = v275.length;
                    const v277 = v276 > 1;
                    const v278 = process.argv;
                    const v279 = v278[1];
                    const v280 = process.argv;
                    const v281 = v280[0];
                    if (v277) {
                        name = v279;
                    } else {
                        name = v281;
                    }
                    const v282 = process.pid;
                    var info = {};
                    info['pid'] = v282;
                    info['name'] = name;
                    const v283 = { 'Content-Type': 'application/json' };
                    const v284 = res.writeHead(200, v283);
                    v284;
                    const v285 = JSON.stringify(info);
                    const v286 = res.end(v285);
                    v286;
                } else {
                    const v287 = req.url;
                    const v288 = v287.match(/^\/clear/);
                    const v289 = req.method;
                    const v290 = v289 === 'POST';
                    const v291 = v288 && v290;
                    if (v291) {
                        const v292 = this.replServer;
                        var rli = v292.rli;
                        const v293 = this.replServer;
                        const v294 = v293.bufferedCommand;
                        const v295 = this.replServer;
                        const v296 = v295.bufferedCommand;
                        const v297 = v296.length;
                        const v298 = v297 > 0;
                        const v299 = v294 && v298;
                        if (v299) {
                            const v300 = rli.write('\n');
                            v300;
                            const v301 = this.replServer;
                            v301.bufferedCommand = '';
                            const v302 = this.replServer;
                            const v303 = v302.displayPrompt();
                            v303;
                        }
                        const v304 = { 'Content-Type': 'text/plain' };
                        const v305 = res.writeHead(200, v304);
                        v305;
                        const v306 = res.end();
                        v306;
                    } else {
                        const v307 = req.url;
                        match = v307.match(/\/(.*)/);
                        if (match) {
                            var file = match[1];
                            const v308 = file === '';
                            if (v308) {
                                file = 'index.html';
                            }
                            const v309 = this.webdir;
                            const v310 = v309 + '/';
                            file = v310 + file;
                            const v311 = this.serveFile(file, res);
                            v311;
                        }
                    }
                }
            }
        }
    }
};
v205.route = v312;
const v313 = ReplHttpServer.prototype;
const v339 = function (file, response) {
    const contentType = function (file) {
        const v314 = file.match(/.js$/);
        if (v314) {
            return 'application/x-javascript';
        } else {
            const v315 = file.match(/.html$/);
            if (v315) {
                return 'text/html';
            } else {
                const v316 = file.match(/.css$/);
                if (v316) {
                    return 'text/css';
                }
            }
        }
        return 'text/plain';
    };
    const v337 = function (err, stat) {
        if (err) {
            const v317 = { 'Content-Type': 'text/plain' };
            const v318 = response.writeHead(404, v317);
            v318;
            const v319 = 'Cannot find file: ' + file;
            const v320 = response.write(v319);
            v320;
            const v321 = response.end();
            v321;
            return;
        }
        const v335 = function (err, data) {
            if (err) {
                const v322 = contentType(file);
                const v323 = { 'Content-Type': v322 };
                const v324 = response.writeHead(500, v323);
                v324;
                const v325 = 'Error opening file ' + file;
                const v326 = v325 + ': ';
                const v327 = v326 + err;
                const v328 = response.write(v327);
                v328;
            } else {
                const v329 = contentType(file);
                const v330 = data.length;
                const v331 = {
                    'Content-Type': v329,
                    'Content-Length': v330
                };
                const v332 = response.writeHead(200, v331);
                v332;
                const v333 = response.write(data, 'binary');
                v333;
            }
            const v334 = response.end();
            v334;
        };
        const v336 = fs.readFile(file, 'binary', v335);
        v336;
    };
    const v338 = fs.stat(file, v337);
    v338;
};
v313.serveFile = v339;
var start = function (port, options) {
    var stream = new SimpleStream();
    var prompt = 'node> ';
    var rs = new repl.REPLServer(prompt, stream);
    var replHttpServer = new ReplHttpServer(prompt, stream, rs, options);
    const v340 = replHttpServer.start(port);
    v340;
    return rs;
};
var exports = {};
exports['start'] = start;
module.exports = exports;