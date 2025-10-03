var Http = require('http');
var Url = require('url');
var Fs = require('fs');
const v256 = require('child_process');
var execFile = v256.execFile;
var Path = require('path');
var Os = require('os');
var Tmp = require('temp');
const v257 = Tmp.track();
v257;
var Util = require('util');
var inspect = Util.inspect;
var isArray = Util.isArray;
var GitLabHook = function (_options, _callback) {
    const v258 = this instanceof GitLabHook;
    const v259 = !v258;
    if (v259) {
        const v260 = new GitLabHook(_options, _callback);
        return v260;
    }
    var callback = null;
    var options = null;
    const v261 = typeof _options;
    const v262 = v261 === 'function';
    if (v262) {
        callback = _options;
    } else {
        callback = _callback;
        options = _options;
    }
    const v263 = {};
    options = options || v263;
    const v264 = options.configFile;
    this.configFile = v264 || 'gitlabhook.conf';
    const v265 = options.configPathes;
    const v266 = [
        '/etc/gitlabhook/',
        '/usr/local/etc/gitlabhook/',
        '.'
    ];
    this.configPathes = v265 || v266;
    const v267 = options.port;
    this.port = v267 || 3420;
    const v268 = options.host;
    this.host = v268 || '0.0.0.0';
    const v269 = options.cmdshell;
    this.cmdshell = v269 || '/bin/sh';
    const v270 = options.keep;
    const v271 = typeof v270;
    const v272 = v271 === 'undefined';
    const v273 = options.keep;
    let v274;
    if (v272) {
        v274 = false;
    } else {
        v274 = v273;
    }
    this.keep = v274;
    const v275 = options.logger;
    this.logger = v275;
    this.callback = callback;
    var active = false;
    var tasks;
    const v276 = typeof callback;
    const v277 = v276 == 'function';
    if (v277) {
        active = true;
    } else {
        const v278 = this.configPathes;
        const v279 = this.configFile;
        cfg = readConfigFile(v278, v279);
        if (cfg) {
            const v280 = this.logger;
            const v281 = this.configFile;
            const v282 = 'loading config file: ' + v281;
            const v283 = v280.info(v282);
            v283;
            const v284 = this.logger;
            const v285 = Util.inspect(cfg);
            const v286 = 'config file:\n' + v285;
            const v287 = v284.info(v286);
            v287;
            let i;
            for (i in cfg) {
                const v288 = i == 'tasks';
                const v289 = cfg.tasks;
                const v290 = typeof v289;
                const v291 = v290 == 'object';
                const v292 = v288 && v291;
                const v293 = cfg.tasks;
                const v294 = Object.keys(v293);
                const v295 = v294.length;
                const v296 = v292 && v295;
                if (v296) {
                    const v297 = cfg.tasks;
                    this.tasks = v297;
                    active = true;
                } else {
                    const v298 = cfg[i];
                    this[i] = v298;
                }
            }
        } else {
            const v299 = this.logger;
            const v300 = this.configFile;
            const v301 = v299.error('can\'t read config file: ', v300);
            v301;
        }
    }
    const v302 = this.logger;
    const v303 = function () {
    };
    const v304 = function () {
    };
    const v305 = {
        info: v303,
        error: v304
    };
    this.logger = v302 || v305;
    const v306 = this.logger;
    const v307 = inspect(this);
    const v308 = 'self: ' + v307;
    const v309 = v308 + '\n';
    const v310 = v306.info(v309);
    v310;
    if (active) {
        const v311 = serverHandler.bind(this);
        const v312 = Http.createServer(v311);
        this.server = v312;
    }
};
const v313 = GitLabHook.prototype;
const v332 = function (callback) {
    var self = this;
    const v314 = self.server;
    const v315 = typeof v314;
    const v316 = v315 !== 'undefined';
    if (v316) {
        const v317 = self.server;
        const v318 = self.port;
        const v319 = self.host;
        const v328 = function () {
            const v320 = self.logger;
            const v321 = self.host;
            const v322 = self.port;
            const v323 = Util.format('listening for github events on %s:%d', v321, v322);
            const v324 = v320.info(v323);
            v324;
            const v325 = typeof callback;
            const v326 = v325 === 'function';
            if (v326) {
                const v327 = callback();
                v327;
            }
        };
        const v329 = v317.listen(v318, v319, v328);
        v329;
    } else {
        const v330 = self.logger;
        const v331 = v330.info('server disabled');
        v331;
    }
};
v313.listen = v332;
const readConfigFile = function (pathes, file) {
    var fname;
    var ret = false;
    var i = 0;
    const v333 = pathes.length;
    let v334 = i < v333;
    while (v334) {
        const v336 = pathes[i];
        fname = Path.join(v336, file);
        try {
            var data = Fs.readFileSync(fname, 'utf-8');
            ret = parse(data);
            break;
        } catch (err) {
        }
        const v335 = i++;
        v334 = i < v333;
    }
    return ret;
};
const parse = function (data) {
    var result;
    try {
        result = JSON.parse(data);
    } catch (e) {
        result = false;
    }
    return result;
};
const reply = function (statusCode, res) {
    var headers = {};
    headers['Content-Length'] = 0;
    const v337 = res.writeHead(statusCode, headers);
    v337;
    const v338 = res.end();
    v338;
};
const executeShellCmds = function (self, address, data) {
    const v339 = data.repository;
    const v340 = v339.name;
    var repo = v340.replace(/[&|;$`]/gi, '');
    let lastCommit;
    const v341 = data.commits;
    const v342 = data.commits;
    const v343 = data.commits;
    const v344 = v343.length;
    const v345 = v344 - 1;
    const v346 = v342[v345];
    if (v341) {
        lastCommit = v346;
    } else {
        lastCommit = null;
    }
    const v347 = data.object_kind;
    const v348 = data.repository;
    const v349 = data.repository;
    const v350 = v349.git_ssh_url;
    let v351;
    if (v348) {
        v351 = v350;
    } else {
        v351 = '';
    }
    const v352 = data.repository;
    const v353 = data.repository;
    const v354 = v353.git_http_url;
    let v355;
    if (v352) {
        v355 = v354;
    } else {
        v355 = '';
    }
    const v356 = data.user_name;
    const v357 = data.ref;
    const v358 = lastCommit.id;
    let v359;
    if (lastCommit) {
        v359 = v358;
    } else {
        v359 = '';
    }
    const v360 = lastCommit.timestamp;
    let v361;
    if (lastCommit) {
        v361 = v360;
    } else {
        v361 = '';
    }
    const v362 = lastCommit.message;
    let v363;
    if (lastCommit) {
        v363 = v362;
    } else {
        v363 = '';
    }
    var map = {};
    map['%r'] = repo;
    map['%k'] = v347;
    map['%g'] = v351;
    map['%h'] = v355;
    map['%u'] = v356;
    map['%b'] = v357;
    map['%i'] = v359;
    map['%t'] = v361;
    map['%m'] = v363;
    map['%s'] = address;
    const execute = function (path, idx) {
        const v364 = cmds.length;
        const v365 = idx == v364;
        if (v365) {
            const v366 = self.keep;
            const v367 = !v366;
            if (v367) {
                const v368 = self.logger;
                const v369 = self.path;
                const v370 = 'Remove working directory: ' + v369;
                const v371 = v368.info(v370);
                v371;
                const v372 = Tmp.cleanup();
                v372;
            } else {
                const v373 = self.logger;
                const v374 = self.path;
                const v375 = 'Keep working directory: ' + v374;
                const v376 = v373.info(v375);
                v376;
            }
            return;
        }
        const v377 = pad(idx, 3);
        const v378 = 'task-' + v377;
        var fname = Path.join(path, v378);
        const v379 = cmds[idx];
        const v407 = function (err) {
            if (err) {
                const v380 = self.logger;
                const v381 = 'File creation error: ' + err;
                const v382 = v380.error(v381);
                v382;
                return;
            }
            const v383 = self.logger;
            const v384 = 'File created: ' + fname;
            const v385 = v383.info(v384);
            v385;
            const v386 = self.cmdshell;
            const v387 = [fname];
            const v388 = process.env;
            const v389 = {
                cwd: path,
                env: v388
            };
            const v405 = function (err, stdout, stderr) {
                if (err) {
                    const v390 = self.logger;
                    const v391 = 'Exec error: ' + err;
                    const v392 = v390.error(v391);
                    v392;
                } else {
                    const v393 = self.logger;
                    const v394 = self.cmdshell;
                    const v395 = 'Executed: ' + v394;
                    const v396 = v395 + ' ';
                    const v397 = v396 + fname;
                    const v398 = v393.info(v397);
                    v398;
                    const v399 = process.stdout;
                    const v400 = v399.write(stdout);
                    v400;
                }
                const v401 = process.stderr;
                const v402 = v401.write(stderr);
                v402;
                const v403 = ++idx;
                const v404 = execute(path, v403);
                v404;
            };
            const v406 = execFile(v386, v387, v389, v405);
            v406;
        };
        const v408 = Fs.writeFile(fname, v379, v407);
        v408;
    };
    const v409 = self.tasks;
    var cmds = getCmds(v409, map, repo);
    const v410 = cmds.length;
    const v411 = v410 > 0;
    if (v411) {
        const v412 = self.logger;
        const v413 = inspect(cmds);
        const v414 = 'cmds: ' + v413;
        const v415 = v414 + '\n';
        const v416 = v412.info(v415);
        v416;
        const v417 = Os.tmpDir();
        const v418 = {
            dir: v417,
            prefix: 'gitlabhook.'
        };
        const v425 = function (err, path) {
            if (err) {
                const v419 = self.logger;
                const v420 = v419.error(err);
                v420;
                return;
            }
            self.path = path;
            const v421 = self.logger;
            const v422 = 'Tempdir: ' + path;
            const v423 = v421.info(v422);
            v423;
            var i = 0;
            const v424 = execute(path, i);
            v424;
        };
        const v426 = Tmp.mkdir(v418, v425);
        v426;
    } else {
        const v427 = self.logger;
        const v428 = 'No related commands for repository "' + repo;
        const v429 = v428 + '"';
        const v430 = v427.info(v429);
        v430;
    }
};
const serverHandler = function (req, res) {
    var self = this;
    const v431 = req.url;
    var url = Url.parse(v431, true);
    var buffer = [];
    var bufferLength = 0;
    var failed = false;
    const v432 = req.ip;
    const v433 = req.socket;
    const v434 = v433.remoteAddress;
    const v435 = v432 || v434;
    const v436 = req.socket;
    const v437 = v436.socket;
    const v438 = v437.remoteAddress;
    var remoteAddress = v435 || v438;
    const v440 = function (chunk) {
        if (failed) {
            return;
        }
        const v439 = buffer.push(chunk);
        v439;
        bufferLength += chunk.length;
    };
    const v441 = req.on('data', v440);
    v441;
    const v476 = function (chunk) {
        if (failed) {
            return;
        }
        var data;
        if (chunk) {
            const v442 = buffer.push(chunk);
            v442;
            bufferLength += chunk.length;
        }
        const v443 = self.logger;
        const v444 = Util.format('received %d bytes from %s\n\n', bufferLength, remoteAddress);
        const v445 = v443.info(v444);
        v445;
        const v446 = Buffer.concat(buffer, bufferLength);
        data = v446.toString();
        data = parse(data);
        const v447 = !data;
        const v448 = data.repository;
        const v449 = !v448;
        const v450 = v447 || v449;
        const v451 = data.repository;
        const v452 = v451.name;
        const v453 = !v452;
        const v454 = v450 || v453;
        if (v454) {
            const v455 = self.logger;
            const v456 = Util.format('received invalid data from %s, returning 400\n\n', remoteAddress);
            const v457 = v455.error(v456);
            v457;
            const v458 = reply(400, res);
            return v458;
        }
        const v459 = data.repository;
        const v460 = v459.name;
        var repo = v460.replace(/[&|;$`]/gi, '');
        const v461 = reply(200, res);
        v461;
        const v462 = self.logger;
        const v463 = data.ref;
        const v464 = Util.format('got event on %s:%s from %s\n\n', repo, v463, remoteAddress);
        const v465 = v462.info(v464);
        v465;
        const v466 = self.logger;
        const v467 = {
            showHidden: true,
            depth: 10
        };
        const v468 = Util.inspect(data, v467);
        const v469 = v468 + '\n\n';
        const v470 = v466.info(v469);
        v470;
        const v471 = self.callback;
        const v472 = typeof v471;
        const v473 = v472 == 'function';
        if (v473) {
            const v474 = self.callback(data);
            v474;
        } else {
            const v475 = executeShellCmds(self, remoteAddress, data);
            v475;
        }
    };
    const v477 = req.on('end', v476);
    v477;
    const v478 = req.method;
    const v479 = v478 !== 'POST';
    if (v479) {
        const v480 = self.logger;
        const v481 = Util.format('got invalid method from %s, returning 405', remoteAddress);
        const v482 = v480.error(v481);
        v482;
        failed = true;
        const v483 = reply(405, res);
        return v483;
    }
};
const getCmds = function (tasks, map, repo) {
    var ret = [];
    var x = [];
    const v484 = tasks.hasOwnProperty('*');
    if (v484) {
        const v485 = tasks['*'];
        const v486 = x.push(v485);
        v486;
    }
    const v487 = tasks.hasOwnProperty(repo);
    if (v487) {
        const v488 = tasks[repo];
        const v489 = x.push(v488);
        v489;
    }
    var i = 0;
    const v490 = x.length;
    let v491 = i < v490;
    while (v491) {
        let cmdStr;
        const v493 = x[i];
        const v494 = isArray(v493);
        const v495 = x[i];
        const v496 = v495.join('\n');
        const v497 = x[i];
        if (v494) {
            cmdStr = v496;
        } else {
            cmdStr = v497;
        }
        let j;
        for (j in map) {
            const v498 = new RegExp(j, 'g');
            const v499 = map[j];
            cmdStr = cmdStr.replace(v498, v499);
        }
        const v500 = cmdStr + '\n';
        const v501 = ret.push(v500);
        v501;
        const v492 = i++;
        v491 = i < v490;
    }
    return ret;
};
const pad = function (n, width, z) {
    z = z || '0';
    n = n + '';
    const v502 = n.length;
    const v503 = v502 >= width;
    const v504 = n.length;
    const v505 = width - v504;
    const v506 = v505 + 1;
    const v507 = new Array(v506);
    const v508 = v507.join(z);
    const v509 = v508 + n;
    let v510;
    if (v503) {
        v510 = n;
    } else {
        v510 = v509;
    }
    return v510;
};
module.exports = GitLabHook;