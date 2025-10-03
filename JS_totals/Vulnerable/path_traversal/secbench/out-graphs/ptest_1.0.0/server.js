'use strict';
var fs = require('fs');
var http = require('http');
var path = require('path');
var co = require('co');
var _util = require('util_extend_exclude');
const v159 = require('child_process');
var spawn = v159.spawn;
var HTTP_HOST = '0.0.0.0';
var HTTP_PORT = 8080;
var WS_PORT = 1280;
var ROUTE = {};
ROUTE['/'] = '/client.html';
var MIME = {};
MIME['.js'] = 'application/javascript';
MIME['.json'] = 'application/json';
MIME['.css'] = 'text/css';
MIME['.png'] = 'image/png';
const arrayLast = function (arr) {
    const v160 = arr.length;
    if (v160) {
        const v161 = arr.length;
        const v162 = v161 - 1;
        const v163 = arr[v162];
        return v163;
    }
};
const v178 = function (req, res) {
    const v164 = new Date();
    const v165 = v164.toLocaleString();
    const v166 = req.method;
    const v167 = req.url;
    const v168 = console.log(v165, v166, v167);
    v168;
    var filePath = req.url;
    const v169 = ROUTE[filePath];
    const v170 = v169 || filePath;
    filePath = '.' + v170;
    var ext = path.extname(filePath);
    const v171 = MIME[ext];
    var contentType = v171 || 'text/html';
    const v176 = function (err, data) {
        if (err) {
            res.statusCode = 404;
            const v172 = res.end();
            return v172;
        }
        const v173 = { 'Content-Type': contentType };
        const v174 = res.writeHeader(200, v173);
        v174;
        const v175 = res.end(data, 'utf8');
        v175;
    };
    const v177 = fs.readFile(filePath, v176);
    v177;
};
var HttpServer = http.createServer(v178);
const v179 = HttpServer.listen(HTTP_PORT, HTTP_HOST);
v179;
const v180 = console.log('server started at %s:%s', HTTP_HOST, HTTP_PORT);
v180;
var EventCache = [];
var ViewportCache = [];
const v181 = require('ws');
var WebSocketServer = v181.Server;
const v182 = { port: WS_PORT };
var wss = new WebSocketServer(v182);
const v224 = function connection(ws) {
    const v184 = function incoming(code, message) {
        const v183 = console.log('WS close: ', code, message);
        v183;
    };
    const v185 = ws.on('close', v184);
    v185;
    const v212 = function incoming(message) {
        var msg;
        try {
            msg = JSON.parse(message);
        } catch (e) {
            msg = message;
        }
        const v186 = typeof msg;
        const v187 = v186 !== 'object';
        if (v187) {
            return;
        }
        const v188 = msg.type;
        switch (v188) {
        case 'connection':
            const v189 = msg.name;
            ws.name = v189;
            const v190 = clientList();
            const v191 = {
                meta: 'clientList',
                data: v190
            };
            const v192 = broadcast(v191);
            v192;
            break;
        case 'command':
            const v193 = msg.meta;
            const v194 = v193 == 'server';
            if (v194) {
                try {
                    const v195 = msg.data;
                    const v196 = eval(v195);
                    msg.result = v196;
                } catch (e) {
                    const v197 = e.stack;
                    msg.result = v197;
                }
                const v198 = msg.data;
                const v199 = delete v198;
                v199;
                msg.type = 'command_result';
                const v200 = ws._send(msg);
                v200;
                return;
            }
        case 'window_resize':
        case 'window_scroll':
            const v201 = ViewportCache.push(msg);
            v201;
        default:
            const v202 = ws.name;
            const v203 = v202 === 'client';
            if (v203) {
                const v204 = Date.now();
                const v205 = {};
                const v206 = _util._extend(v205, msg);
                const v207 = arrayLast(ViewportCache);
                const v208 = {
                    time: v204,
                    msg: v206,
                    viewport: v207
                };
                const v209 = EventCache.push(v208);
                v209;
                const v210 = toPhantom(msg);
                v210;
            } else {
                const v211 = toClient(msg);
                v211;
            }
            break;
        }
    };
    const v213 = ws.on('message', v212);
    v213;
    const v221 = function (msg) {
        const v214 = ws.readyState;
        const v215 = v214 != 1;
        if (v215) {
            return;
        }
        const v216 = typeof msg;
        const v217 = v216 == 'string';
        const v218 = JSON.stringify(msg);
        let v219;
        if (v217) {
            v219 = msg;
        } else {
            v219 = v218;
        }
        const v220 = ws.send(v219);
        v220;
    };
    ws._send = v221;
    const v222 = {
        type: 'ws',
        msg: 'connected to socket 8080'
    };
    const v223 = ws._send(v222);
    v223;
};
const v225 = wss.on('connection', v224);
v225;
var STOPPED = 0;
var STOPPING = 1;
var PAUSING = 2;
var PAUSED = 4;
var RUNNING = 8;
const EventPlayBack = function EventPlayBack() {
    this.status = STOPPED;
    const v226 = () => {
    };
    this.resume = v226;
    const v227 = () => {
    };
    this.cancel = v227;
};
const play = function play() {
    var self = this;
    const v228 = self.status;
    const v229 = v228 === RUNNING;
    if (v229) {
        return;
    }
    const v230 = self.status;
    const v231 = v230 === PAUSED;
    if (v231) {
        const v232 = self.resume();
        return v232;
    }
    const v233 = EventCache.length;
    const v234 = v233 < 3;
    if (v234) {
        return;
    }
    let prev = EventCache[2];
    let last = arrayLast(EventCache);
    const v235 = last.time;
    const v236 = prev.time;
    const v237 = v235 - v236;
    const v238 = client_console('begin playback, total time:', v237, '(ms)');
    v238;
    const v265 = function* () {
        let i = 2;
        let n = EventCache.length;
        let v239 = i < n;
        while (v239) {
            const v241 = self.status;
            const v242 = v241 === STOPPING;
            if (v242) {
                const v243 = self.cancel();
                v243;
                self.status = STOPPED;
                return 'playback stopped';
            }
            const v244 = self.status;
            const v245 = v244 === PAUSING;
            if (v245) {
                const v252 = (resolve, reject) => {
                    self.status = PAUSED;
                    const v248 = () => {
                        self.status = RUNNING;
                        const v246 = () => {
                        };
                        self.resume = v246;
                        const v247 = resolve();
                        v247;
                    };
                    self.resume = v248;
                    const v251 = () => {
                        self.status = STOPPED;
                        const v249 = () => {
                        };
                        self.cancel = v249;
                        const v250 = reject('canceled');
                        v250;
                    };
                    self.cancel = v251;
                };
                const v253 = new Promise(v252);
                yield v253;
            }
            let e = EventCache[i];
            const v254 = e.time;
            const v255 = prev.time;
            let inter = v254 - v255;
            const v263 = (resolve, reject) => {
                const v261 = () => {
                    const v256 = e.msg;
                    const v257 = toPhantom(v256);
                    v257;
                    const v258 = e.viewport;
                    const v259 = toClient(v258);
                    v259;
                    prev = e;
                    const v260 = resolve(true);
                    v260;
                };
                const v262 = setTimeout(v261, inter);
                v262;
            };
            const v264 = new Promise(v263);
            let result = yield v264;
            const v240 = i++;
            v239 = i < n;
        }
        return 'playback complete';
    };
    const v266 = co(v265);
    const v268 = ret => {
        self.status = STOPPED;
        const v267 = client_console(ret);
        v267;
    };
    const v270 = err => {
        self.status = STOPPED;
        const v269 = client_console('playback incomplete:', err);
        v269;
    };
    const v271 = v266.then(v268, v270);
    v271;
};
EventPlayBack.play = play;
const pause = function pause() {
    this.status = PAUSING;
};
EventPlayBack.pause = pause;
const stop = function stop() {
    this.status = STOPPING;
};
EventPlayBack.stop = stop;
EventPlayBack['is_class'] = true;
var playBack = new EventPlayBack();
const clientList = function () {
    const v272 = wss.clients;
    const v274 = (v, i) => {
        const v273 = v.name;
        return v273;
    };
    const v275 = v272.map(v274);
    return v275;
};
const findClient = function (name) {
    const v276 = wss.clients;
    const v279 = (v, i) => {
        const v277 = v.name;
        const v278 = v277 == name;
        return v278;
    };
    const v280 = v276.find(v279);
    return v280;
};
const toClient = function (msg) {
    var client = findClient('client');
    if (client) {
        const v281 = client._send(msg);
        v281;
    }
};
const toPhantom = function (msg) {
    var phantom = findClient('phantom');
    if (phantom) {
        const v282 = phantom._send(msg);
        v282;
    }
};
const client_console = function () {
    var msg = '';
    let i = 0;
    const v283 = arguments.length;
    let v284 = i < v283;
    while (v284) {
        const v286 = arguments[i];
        msg += v286 + ' ';
        const v285 = i++;
        v284 = i < v283;
    }
    const v287 = new Date();
    const v288 = v287.toLocaleString();
    const v289 = v288 + ' [server] ';
    const v290 = v289 + msg;
    const v291 = {
        type: 'console_message',
        data: v290
    };
    const v292 = toClient(v291);
    v292;
};
const broadcast = function (data) {
    const v293 = wss.clients;
    const v295 = function each(client) {
        data.type = 'broadcast';
        const v294 = client._send(data);
        v294;
    };
    const v296 = v293.forEach(v295);
    v296;
};
const v297 = [
    '--config',
    'phantom.config',
    'ptest.js'
];
const v298 = {
    pwd: __dirname,
    stdio: 'pipe'
};
var ls = spawn('phantomjs', v297, v298);
const v299 = ls.stdout;
const v300 = v299.setEncoding('utf8');
v300;
const v301 = ls.stderr;
const v302 = v301.setEncoding('utf8');
v302;
const v303 = ls.stdout;
const v305 = function (data) {
    const v304 = console.log('stdout', data);
    v304;
};
const v306 = v303.on('data', v305);
v306;
const v307 = ls.stderr;
const v309 = function (data) {
    const v308 = console.log('stderr', data);
    v308;
};
const v310 = v307.on('data', v309);
v310;
const v312 = function (code) {
    const v311 = console.log('close', code);
    v311;
};
const v313 = ls.on('close', v312);
v313;
const v315 = function (code) {
    const v314 = console.log('error', code);
    v314;
};
const v316 = ls.on('error', v315);
v316;