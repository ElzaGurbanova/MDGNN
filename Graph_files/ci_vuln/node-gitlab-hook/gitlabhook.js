var Http = require('http');
var Url = require('url');
var Fs = require('fs');
const v254 = require('child_process');
var execFile = v254.execFile;
var Path = require('path');
var Os = require('os');
var Tmp = require('temp');
const v255 = Tmp.track();
v255;
var Util = require('util');
var inspect = Util.inspect;
var isArray = Util.isArray;
var GitLabHook = function (_options, _callback) {
    const v256 = this instanceof GitLabHook;
    const v257 = !v256;
    if (v257) {
        const v258 = new GitLabHook(_options, _callback);
        return v258;
    }
    var callback = null;
    var options = null;
    const v259 = typeof _options;
    const v260 = v259 === 'function';
    if (v260) {
        callback = _options;
    } else {
        callback = _callback;
        options = _options;
    }
    const v261 = {};
    options = options || v261;
    const v262 = options.configFile;
    this.configFile = v262 || 'gitlabhook.conf';
    const v263 = options.configPathes;
    const v264 = [
        '/etc/gitlabhook/',
        '/usr/local/etc/gitlabhook/',
        '.'
    ];
    this.configPathes = v263 || v264;
    const v265 = options.port;
    this.port = v265 || 3420;
    const v266 = options.host;
    this.host = v266 || '0.0.0.0';
    const v267 = options.cmdshell;
    this.cmdshell = v267 || '/bin/sh';
    const v268 = options.keep;
    const v269 = typeof v268;
    const v270 = v269 === 'undefined';
    const v271 = options.keep;
    let v272;
    if (v270) {
        v272 = false;
    } else {
        v272 = v271;
    }
    this.keep = v272;
    const v273 = options.logger;
    this.logger = v273;
    this.callback = callback;
    var active = false;
    var tasks;
    const v274 = typeof callback;
    const v275 = v274 == 'function';
    if (v275) {
        active = true;
    } else {
        const v276 = this.configPathes;
        const v277 = this.configFile;
        cfg = readConfigFile(v276, v277);
        if (cfg) {
            const v278 = this.logger;
            const v279 = this.configFile;
            const v280 = 'loading config file: ' + v279;
            const v281 = v278.info(v280);
            v281;
            const v282 = this.logger;
            const v283 = Util.inspect(cfg);
            const v284 = 'config file:\n' + v283;
            const v285 = v282.info(v284);
            v285;
            let i;
            for (i in cfg) {
                const v286 = i == 'tasks';
                const v287 = cfg.tasks;
                const v288 = typeof v287;
                const v289 = v288 == 'object';
                const v290 = v286 && v289;
                const v291 = cfg.tasks;
                const v292 = Object.keys(v291);
                const v293 = v292.length;
                const v294 = v290 && v293;
                if (v294) {
                    const v295 = cfg.tasks;
                    this.tasks = v295;
                    active = true;
                } else {
                    const v296 = cfg[i];
                    this[i] = v296;
                }
            }
        } else {
            const v297 = this.logger;
            const v298 = this.configFile;
            const v299 = v297.error('can\'t read config file: ', v298);
            v299;
        }
    }
    const v300 = this.logger;
    const v301 = function () {
    };
    const v302 = function () {
    };
    const v303 = {
        info: v301,
        error: v302
    };
    this.logger = v300 || v303;
    const v304 = this.logger;
    const v305 = inspect(this);
    const v306 = 'self: ' + v305;
    const v307 = v306 + '\n';
    const v308 = v304.info(v307);
    v308;
    if (active) {
        const v309 = serverHandler.bind(this);
        const v310 = Http.createServer(v309);
        this.server = v310;
    }
};
const v311 = GitLabHook.prototype;
const v330 = function (callback) {
    var self = this;
    const v312 = self.server;
    const v313 = typeof v312;
    const v314 = v313 !== 'undefined';
    if (v314) {
        const v315 = self.server;
        const v316 = self.port;
        const v317 = self.host;
        const v326 = function () {
            const v318 = self.logger;
            const v319 = self.host;
            const v320 = self.port;
            const v321 = Util.format('listening for github events on %s:%d', v319, v320);
            const v322 = v318.info(v321);
            v322;
            const v323 = typeof callback;
            const v324 = v323 === 'function';
            if (v324) {
                const v325 = callback();
                v325;
            }
        };
        const v327 = v315.listen(v316, v317, v326);
        v327;
    } else {
        const v328 = self.logger;
        const v329 = v328.info('server disabled');
        v329;
    }
};
v311.listen = v330;
const readConfigFile = function (pathes, file) {
    var fname;
    var ret = false;
    var i = 0;
    const v331 = pathes.length;
    let v332 = i < v331;
    while (v332) {
        const v334 = pathes[i];
        fname = Path.join(v334, file);
        try {
            var data = Fs.readFileSync(fname, 'utf-8');
            ret = parse(data);
            break;
        } catch (err) {
        }
        const v333 = i++;
        v332 = i < v331;
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
    const v335 = res.writeHead(statusCode, headers);
    v335;
    const v336 = res.end();
    v336;
};
const executeShellCmds = function (self, address, data) {
    const v337 = data.repository;
    var repo = v337.name;
    let lastCommit;
    const v338 = data.commits;
    const v339 = data.commits;
    const v340 = data.commits;
    const v341 = v340.length;
    const v342 = v341 - 1;
    const v343 = v339[v342];
    if (v338) {
        lastCommit = v343;
    } else {
        lastCommit = null;
    }
    const v344 = data.object_kind;
    const v345 = data.repository;
    const v346 = data.repository;
    const v347 = v346.git_ssh_url;
    let v348;
    if (v345) {
        v348 = v347;
    } else {
        v348 = '';
    }
    const v349 = data.repository;
    const v350 = data.repository;
    const v351 = v350.git_http_url;
    let v352;
    if (v349) {
        v352 = v351;
    } else {
        v352 = '';
    }
    const v353 = data.user_name;
    const v354 = data.ref;
    const v355 = lastCommit.id;
    let v356;
    if (lastCommit) {
        v356 = v355;
    } else {
        v356 = '';
    }
    const v357 = lastCommit.timestamp;
    let v358;
    if (lastCommit) {
        v358 = v357;
    } else {
        v358 = '';
    }
    const v359 = lastCommit.message;
    let v360;
    if (lastCommit) {
        v360 = v359;
    } else {
        v360 = '';
    }
    var map = {};
    map['%r'] = repo;
    map['%k'] = v344;
    map['%g'] = v348;
    map['%h'] = v352;
    map['%u'] = v353;
    map['%b'] = v354;
    map['%i'] = v356;
    map['%t'] = v358;
    map['%m'] = v360;
    map['%s'] = address;
    const execute = function (path, idx) {
        const v361 = cmds.length;
        const v362 = idx == v361;
        if (v362) {
            const v363 = self.keep;
            const v364 = !v363;
            if (v364) {
                const v365 = self.logger;
                const v366 = self.path;
                const v367 = 'Remove working directory: ' + v366;
                const v368 = v365.info(v367);
                v368;
                const v369 = Tmp.cleanup();
                v369;
            } else {
                const v370 = self.logger;
                const v371 = self.path;
                const v372 = 'Keep working directory: ' + v371;
                const v373 = v370.info(v372);
                v373;
            }
            return;
        }
        const v374 = pad(idx, 3);
        const v375 = 'task-' + v374;
        var fname = Path.join(path, v375);
        const v376 = cmds[idx];
        const v404 = function (err) {
            if (err) {
                const v377 = self.logger;
                const v378 = 'File creation error: ' + err;
                const v379 = v377.error(v378);
                v379;
                return;
            }
            const v380 = self.logger;
            const v381 = 'File created: ' + fname;
            const v382 = v380.info(v381);
            v382;
            const v383 = self.cmdshell;
            const v384 = [fname];
            const v385 = process.env;
            const v386 = {
                cwd: path,
                env: v385
            };
            const v402 = function (err, stdout, stderr) {
                if (err) {
                    const v387 = self.logger;
                    const v388 = 'Exec error: ' + err;
                    const v389 = v387.error(v388);
                    v389;
                } else {
                    const v390 = self.logger;
                    const v391 = self.cmdshell;
                    const v392 = 'Executed: ' + v391;
                    const v393 = v392 + ' ';
                    const v394 = v393 + fname;
                    const v395 = v390.info(v394);
                    v395;
                    const v396 = process.stdout;
                    const v397 = v396.write(stdout);
                    v397;
                }
                const v398 = process.stderr;
                const v399 = v398.write(stderr);
                v399;
                const v400 = ++idx;
                const v401 = execute(path, v400);
                v401;
            };
            const v403 = execFile(v383, v384, v386, v402);
            v403;
        };
        const v405 = Fs.writeFile(fname, v376, v404);
        v405;
    };
    const v406 = self.tasks;
    var cmds = getCmds(v406, map, repo);
    const v407 = cmds.length;
    const v408 = v407 > 0;
    if (v408) {
        const v409 = self.logger;
        const v410 = inspect(cmds);
        const v411 = 'cmds: ' + v410;
        const v412 = v411 + '\n';
        const v413 = v409.info(v412);
        v413;
        const v414 = Os.tmpDir();
        const v415 = {
            dir: v414,
            prefix: 'gitlabhook.'
        };
        const v422 = function (err, path) {
            if (err) {
                const v416 = self.logger;
                const v417 = v416.error(err);
                v417;
                return;
            }
            self.path = path;
            const v418 = self.logger;
            const v419 = 'Tempdir: ' + path;
            const v420 = v418.info(v419);
            v420;
            var i = 0;
            const v421 = execute(path, i);
            v421;
        };
        const v423 = Tmp.mkdir(v415, v422);
        v423;
    } else {
        const v424 = self.logger;
        const v425 = 'No related commands for repository "' + repo;
        const v426 = v425 + '"';
        const v427 = v424.info(v426);
        v427;
    }
};
const serverHandler = function (req, res) {
    var self = this;
    const v428 = req.url;
    var url = Url.parse(v428, true);
    var buffer = [];
    var bufferLength = 0;
    var failed = false;
    const v429 = req.ip;
    const v430 = req.socket;
    const v431 = v430.remoteAddress;
    const v432 = v429 || v431;
    const v433 = req.socket;
    const v434 = v433.socket;
    const v435 = v434.remoteAddress;
    var remoteAddress = v432 || v435;
    const v437 = function (chunk) {
        if (failed) {
            return;
        }
        const v436 = buffer.push(chunk);
        v436;
        bufferLength += chunk.length;
    };
    const v438 = req.on('data', v437);
    v438;
    const v472 = function (chunk) {
        if (failed) {
            return;
        }
        var data;
        if (chunk) {
            const v439 = buffer.push(chunk);
            v439;
            bufferLength += chunk.length;
        }
        const v440 = self.logger;
        const v441 = Util.format('received %d bytes from %s\n\n', bufferLength, remoteAddress);
        const v442 = v440.info(v441);
        v442;
        const v443 = Buffer.concat(buffer, bufferLength);
        data = v443.toString();
        data = parse(data);
        const v444 = !data;
        const v445 = data.repository;
        const v446 = !v445;
        const v447 = v444 || v446;
        const v448 = data.repository;
        const v449 = v448.name;
        const v450 = !v449;
        const v451 = v447 || v450;
        if (v451) {
            const v452 = self.logger;
            const v453 = Util.format('received invalid data from %s, returning 400\n\n', remoteAddress);
            const v454 = v452.error(v453);
            v454;
            const v455 = reply(400, res);
            return v455;
        }
        const v456 = data.repository;
        var repo = v456.name;
        const v457 = reply(200, res);
        v457;
        const v458 = self.logger;
        const v459 = data.ref;
        const v460 = Util.format('got event on %s:%s from %s\n\n', repo, v459, remoteAddress);
        const v461 = v458.info(v460);
        v461;
        const v462 = self.logger;
        const v463 = {
            showHidden: true,
            depth: 10
        };
        const v464 = Util.inspect(data, v463);
        const v465 = v464 + '\n\n';
        const v466 = v462.info(v465);
        v466;
        const v467 = self.callback;
        const v468 = typeof v467;
        const v469 = v468 == 'function';
        if (v469) {
            const v470 = self.callback(data);
            v470;
        } else {
            const v471 = executeShellCmds(self, remoteAddress, data);
            v471;
        }
    };
    const v473 = req.on('end', v472);
    v473;
    const v474 = req.method;
    const v475 = v474 !== 'POST';
    if (v475) {
        const v476 = self.logger;
        const v477 = Util.format('got invalid method from %s, returning 405', remoteAddress);
        const v478 = v476.error(v477);
        v478;
        failed = true;
        const v479 = reply(405, res);
        return v479;
    }
};
const getCmds = function (tasks, map, repo) {
    var ret = [];
    var x = [];
    const v480 = tasks.hasOwnProperty('*');
    if (v480) {
        const v481 = tasks['*'];
        const v482 = x.push(v481);
        v482;
    }
    const v483 = tasks.hasOwnProperty(repo);
    if (v483) {
        const v484 = tasks[repo];
        const v485 = x.push(v484);
        v485;
    }
    var i = 0;
    const v486 = x.length;
    let v487 = i < v486;
    while (v487) {
        let cmdStr;
        const v489 = x[i];
        const v490 = isArray(v489);
        const v491 = x[i];
        const v492 = v491.join('\n');
        const v493 = x[i];
        if (v490) {
            cmdStr = v492;
        } else {
            cmdStr = v493;
        }
        let j;
        for (j in map) {
            const v494 = new RegExp(j, 'g');
            const v495 = map[j];
            cmdStr = cmdStr.replace(v494, v495);
        }
        const v496 = cmdStr + '\n';
        const v497 = ret.push(v496);
        v497;
        const v488 = i++;
        v487 = i < v486;
    }
    return ret;
};
const pad = function (n, width, z) {
    z = z || '0';
    n = n + '';
    const v498 = n.length;
    const v499 = v498 >= width;
    const v500 = n.length;
    const v501 = width - v500;
    const v502 = v501 + 1;
    const v503 = new Array(v502);
    const v504 = v503.join(z);
    const v505 = v504 + n;
    let v506;
    if (v499) {
        v506 = n;
    } else {
        v506 = v505;
    }
    return v506;
};
module.exports = GitLabHook;