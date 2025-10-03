var os = require('os');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var child = require('child_process');
var spawn = child.spawn;
var util = require('util');
var events = require('events');
var basic = require('basic');
var mkdirp = require('mkdirp');
var pushover = require('pushover-giting');
const v234 = require('debug');
var debug = v234('git');
module.exports = Git;
const Git = function (opts) {
    const v235 = this instanceof Git;
    const v236 = !v235;
    if (v236) {
        const v237 = new Git(opts);
        return v237;
    }
    const v238 = events.EventEmitter;
    const v239 = v238.call(this);
    v239;
    var self = this;
    const v240 = {};
    this.opts = opts || v240;
    const v241 = opts.dir;
    const v242 = !v241;
    if (v242) {
        const v243 = process.cwd();
        opts.dir = v243;
    }
    const v244 = opts.repoDir;
    const v245 = opts.dir;
    const v246 = path.join(v245, 'repos');
    this.repoDir = v244 || v246;
    const v247 = opts.workDir;
    const v248 = opts.dir;
    const v249 = path.join(v248, 'checkouts');
    this.workDir = v247 || v249;
    const v250 = this.repoDir;
    const v251 = opts.autoCreate;
    let v252;
    if (v251) {
        v252 = true;
    } else {
        v252 = false;
    }
    const v253 = { autoCreate: v252 };
    const v254 = pushover(v250, v253);
    this.repos = v254;
    const v256 = function (repo) {
        const v255 = repo.accept();
        v255;
    };
    this.onPerm = v256;
    const v257 = this.repos;
    const v258 = this.onRequest;
    const v259 = v258.bind(this);
    const v260 = v257.on('push', v259);
    v260;
    const v261 = this.repos;
    const v262 = this.onRequest;
    const v263 = v262.bind(this);
    const v264 = v261.on('tag', v263);
    v264;
    const v265 = this.repos;
    const v266 = this.onRequest;
    const v267 = v266.bind(this);
    const v268 = v265.on('fetch', v267);
    v268;
    const v269 = this.repos;
    const v270 = this.onRequest;
    const v271 = v270.bind(this);
    const v272 = v269.on('info', v271);
    v272;
    const v273 = this.repos;
    const v274 = this.onRequest;
    const v275 = v274.bind(this);
    const v276 = v273.on('head', v275);
    v276;
    const v277 = opts.auth;
    const v278 = basic(v277);
    this.auth = v278;
};
;
const v279 = events.EventEmitter;
const v280 = util.inherits(Git, v279);
v280;
const v281 = Git.prototype;
const v312 = function (info) {
    var self = this;
    const v282 = info.method;
    const v283 = v282 == 'GET';
    const v284 = info.method;
    const v285 = v284 !== 'GET';
    const v286 = info.req;
    const v287 = v286.credentials;
    const v288 = info.cwd;
    const v289 = info.commit;
    const v290 = info.branch;
    const v291 = info.repo;
    const v292 = v291.split('/');
    const v293 = v292[1];
    const v294 = v293.split('.');
    const v295 = v294[0];
    const v296 = info.repo;
    const v297 = v296.split('/');
    const v298 = v297[0];
    const v299 = info.evName;
    const v300 = v299 == 'push';
    const v301 = info.evName;
    const v308 = function () {
        repo.accepted = true;
        const v302 = repo.sidebandable;
        if (v302) {
            const v303 = info.sideband();
            const v305 = function (sideband) {
                repo.sideband = sideband;
                const v304 = self.handlePush(repo);
                v304;
            };
            const v306 = v303.once('sideband', v305);
            v306;
        }
        const v307 = info.accept();
        v307;
    };
    const v310 = function () {
        repo.rejected = true;
        const v309 = info.reject();
        v309;
    };
    var repo = {};
    repo.read = v283;
    repo.write = v285;
    repo.credentials = v287;
    repo.cwd = v288;
    repo.commit = v289;
    repo.branch = v290;
    repo.name = v295;
    repo.organization = v298;
    repo.sidebandable = v300;
    repo.action = v301;
    repo.accepted = false;
    repo.rejected = false;
    repo.sideband = null;
    repo.accept = v308;
    repo.reject = v310;
    const v311 = this.onPerm(repo);
    v311;
};
v281.onRequest = v312;
const v313 = Git.prototype;
const v317 = function (organization, name, cb) {
    const v314 = this.repos;
    const v315 = path.join(organization, name);
    const v316 = v314.create(v315, cb);
    v316;
};
v313.create = v317;
const v318 = Git.prototype;
const v319 = function (cb) {
    this.onPerm = cb;
};
v318.perm = v319;
const v320 = Git.prototype;
const v348 = function (req, res) {
    var self = this;
    const v321 = req.headers;
    const v322 = v321['x-forwarded-for'];
    const v323 = req.connection;
    const v324 = v323.remoteAddress;
    const v325 = v322 || v324;
    const v326 = req.socket;
    const v327 = v326.remoteAddress;
    const v328 = v325 || v327;
    const v329 = req.connection;
    const v330 = v329.socket;
    const v331 = v330.remoteAddress;
    var ip = v328 || v331;
    const v332 = 'Git.handle ' + ip;
    const v333 = v332 + ' - ';
    const v334 = req.method;
    const v335 = v333 + v334;
    const v336 = v335 + ' - ';
    const v337 = req.url;
    const v338 = v336 + v337;
    const v339 = debug(v338);
    v339;
    const v346 = function (err, credentials) {
        if (err) {
            const v340 = debug('Git.handle auth invalid user/pass', ip);
            v340;
            res.statusCode = 401;
            const v341 = res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            v341;
            const v342 = res.end('<html><body>Need some creds son</body></html>');
            return v342;
            return;
        }
        req.credentials = credentials;
        const v343 = debug('Git.handle auth success, accepting request');
        v343;
        const v344 = self.repos;
        const v345 = v344.handle(req, res);
        v345;
    };
    const v347 = this.auth(req, res, v346);
    v347;
};
v320.handle = v348;
const v349 = Git.prototype;
const v360 = function (dir, cb) {
    var self = this;
    const v358 = function (exists) {
        if (exists) {
            const v350 = cb();
            return v350;
        }
        const v356 = function (err) {
            if (err) {
                const v351 = cb(err);
                return v351;
            }
            const v352 = 'Git.init creating new bare repo in ' + dir;
            const v353 = debug(v352);
            v353;
            const v354 = { cwd: dir };
            const v355 = child.exec('git init --bare', v354, cb);
            v355;
        };
        const v357 = mkdirp(dir, v356);
        v357;
    };
    const v359 = fs.exists(dir, v358);
    v359;
};
v349.init = v360;
const v361 = Git.prototype;
const v376 = function (repo, cb) {
    var self = this;
    const v362 = !cb;
    if (v362) {
        const noop = function () {
        };
        cb = noop;
    }
    const v363 = repo.organization;
    const v364 = repo.name;
    var checkoutDir = self.checkoutDir(v363, v364);
    const v374 = function (err) {
        if (err) {
            const v365 = repo.sideband;
            const v366 = err.message;
            const v367 = 'checkout error ' + v366;
            const v368 = v367 + '\n';
            const v369 = v365.write(v368);
            v369;
            const v370 = 'Git.handlePush update err: ' + err;
            const v371 = debug(v370);
            v371;
            const v372 = cb(err);
            return v372;
        }
        const v373 = self.emit('sideband', repo);
        v373;
    };
    const v375 = self.update(repo, v374);
    v375;
};
v361.handlePush = v376;
const v377 = Git.prototype;
const v380 = function (organization, name) {
    const v378 = this.workDir;
    const v379 = path.join(v378, organization, name);
    return v379;
};
v377.checkoutDir = v380;
const v381 = Git.prototype;
const v394 = function (repo, cb) {
    var self = this;
    const v382 = repo.organization;
    const v383 = repo.name;
    const v384 = this.checkoutDir(v382, v383);
    const v392 = function (exists) {
        const v385 = repo.name;
        const v386 = v385 + ' exists? ';
        const v387 = v386 + exists;
        const v388 = debug(v387);
        v388;
        const v389 = !exists;
        if (v389) {
            const v390 = self.checkout(repo, cb);
            return v390;
        }
        const v391 = self.pull(repo, cb);
        v391;
    };
    const v393 = fs.exists(v384, v392);
    v393;
};
v381.update = v394;
const v395 = Git.prototype;
const v398 = function (organization, name, cb) {
    const v396 = this.repoDir;
    var dir = path.join(v396, organization, name);
    const v397 = this.init(dir, cb);
    v397;
};
v395.createDir = v398;
const v399 = Git.prototype;
const v439 = function (repo, cb) {
    var self = this;
    const v400 = repo.organization;
    const v401 = repo.name;
    var dir = this.checkoutDir(v400, v401);
    const v402 = mkdirp(dir, init);
    v402;
    const init = function (err) {
        if (err) {
            const v403 = 'mkdirp(' + dir;
            const v404 = v403 + ') failed';
            const v405 = cb(v404);
            return v405;
        }
        const v406 = 'mkdirp() ' + dir;
        const v407 = v406 + ' finished';
        const v408 = debug(v407);
        v408;
        const v409 = { cwd: dir };
        const v415 = function (err, stdo, stde) {
            if (err) {
                const v410 = cb(err);
                return v410;
            }
            const v411 = 'init() ' + dir;
            const v412 = v411 + ' finished';
            const v413 = debug(v412);
            v413;
            const v414 = fetch();
            v414;
        };
        const v416 = child.exec('git init', v409, v415);
        v416;
    };
    const fetch = function () {
        const v417 = self.repoDir;
        const v418 = repo.organization;
        const v419 = repo.name;
        const v420 = path.resolve(v417, v418, v419);
        const v421 = 'file://' + v420;
        const v422 = repo.branch;
        const v423 = [
            'git',
            'fetch',
            v421,
            v422
        ];
        var cmd = v423.join(' ');
        const v424 = { cwd: dir };
        const v430 = function (err) {
            if (err) {
                const v425 = cb(err);
                return v425;
            }
            const v426 = 'fetch() ' + dir;
            const v427 = v426 + ' finished';
            const v428 = debug(v427);
            v428;
            const v429 = checkout();
            v429;
        };
        const v431 = child.exec(cmd, v424, v430);
        v431;
    };
    const checkout = function () {
        const v432 = repo.branch;
        const v433 = repo.commit;
        const v434 = [
            'git',
            'checkout',
            '-b',
            v432,
            v433
        ];
        var cmd = v434.join(' ');
        const v435 = { cwd: dir };
        const v437 = function (err, stdo, stde) {
            const v436 = cb(err, stdo, stde);
            v436;
        };
        const v438 = child.exec(cmd, v435, v437);
        v438;
    };
};
v399.checkout = v439;
const v440 = Git.prototype;
const v466 = function (repo, cb) {
    var self = this;
    const v441 = repo.organization;
    const v442 = repo.name;
    var dir = this.checkoutDir(v441, v442);
    const v443 = repo.commit;
    const v444 = v443 + '.';
    const v445 = Date.now();
    repo.id = v444 + v445;
    const v446 = self.repoDir;
    const v447 = repo.organization;
    const v448 = repo.name;
    const v449 = path.resolve(v446, v447, v448);
    const v450 = 'file://' + v449;
    const v451 = repo.branch;
    const v452 = [
        'git',
        'pull',
        v450,
        v451
    ];
    var cmd = v452.join(' ');
    const v453 = 'Git.pull ' + dir;
    const v454 = v453 + ': ';
    const v455 = v454 + cmd;
    const v456 = debug(v455);
    v456;
    const v457 = { cwd: dir };
    const v464 = function (err) {
        const v458 = 'Git.pull ' + dir;
        const v459 = v458 + ' done: ';
        const v460 = v459 + err;
        const v461 = debug(v460);
        v461;
        if (err) {
            const v462 = cb(err);
            return v462;
        }
        const v463 = cb(null);
        v463;
    };
    const v465 = child.exec(cmd, v457, v464);
    v465;
};
v440.pull = v466;