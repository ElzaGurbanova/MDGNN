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
const v237 = require('debug');
var debug = v237('git');
module.exports = Git;
const Git = function (opts) {
    const v238 = this instanceof Git;
    const v239 = !v238;
    if (v239) {
        const v240 = new Git(opts);
        return v240;
    }
    const v241 = events.EventEmitter;
    const v242 = v241.call(this);
    v242;
    var self = this;
    const v243 = {};
    this.opts = opts || v243;
    const v244 = opts.dir;
    const v245 = !v244;
    if (v245) {
        const v246 = process.cwd();
        opts.dir = v246;
    }
    const v247 = opts.repoDir;
    const v248 = opts.dir;
    const v249 = path.join(v248, 'repos');
    this.repoDir = v247 || v249;
    const v250 = opts.workDir;
    const v251 = opts.dir;
    const v252 = path.join(v251, 'checkouts');
    this.workDir = v250 || v252;
    const v253 = this.repoDir;
    const v254 = opts.autoCreate;
    let v255;
    if (v254) {
        v255 = true;
    } else {
        v255 = false;
    }
    const v256 = { autoCreate: v255 };
    const v257 = pushover(v253, v256);
    this.repos = v257;
    const v259 = function (repo) {
        const v258 = repo.accept();
        v258;
    };
    this.onPerm = v259;
    const v260 = this.repos;
    const v261 = this.onRequest;
    const v262 = v261.bind(this);
    const v263 = v260.on('push', v262);
    v263;
    const v264 = this.repos;
    const v265 = this.onRequest;
    const v266 = v265.bind(this);
    const v267 = v264.on('tag', v266);
    v267;
    const v268 = this.repos;
    const v269 = this.onRequest;
    const v270 = v269.bind(this);
    const v271 = v268.on('fetch', v270);
    v271;
    const v272 = this.repos;
    const v273 = this.onRequest;
    const v274 = v273.bind(this);
    const v275 = v272.on('info', v274);
    v275;
    const v276 = this.repos;
    const v277 = this.onRequest;
    const v278 = v277.bind(this);
    const v279 = v276.on('head', v278);
    v279;
    const v280 = opts.auth;
    const v281 = basic(v280);
    this.auth = v281;
};
;
const v282 = events.EventEmitter;
const v283 = util.inherits(Git, v282);
v283;
const v284 = Git.prototype;
const v315 = function (info) {
    var self = this;
    const v285 = info.method;
    const v286 = v285 == 'GET';
    const v287 = info.method;
    const v288 = v287 !== 'GET';
    const v289 = info.req;
    const v290 = v289.credentials;
    const v291 = info.cwd;
    const v292 = info.commit;
    const v293 = info.branch;
    const v294 = info.repo;
    const v295 = v294.split('/');
    const v296 = v295[1];
    const v297 = v296.split('.');
    const v298 = v297[0];
    const v299 = info.repo;
    const v300 = v299.split('/');
    const v301 = v300[0];
    const v302 = info.evName;
    const v303 = v302 == 'push';
    const v304 = info.evName;
    const v311 = function () {
        repo.accepted = true;
        const v305 = repo.sidebandable;
        if (v305) {
            const v306 = info.sideband();
            const v308 = function (sideband) {
                repo.sideband = sideband;
                const v307 = self.handlePush(repo);
                v307;
            };
            const v309 = v306.once('sideband', v308);
            v309;
        }
        const v310 = info.accept();
        v310;
    };
    const v313 = function () {
        repo.rejected = true;
        const v312 = info.reject();
        v312;
    };
    var repo = {};
    repo.read = v286;
    repo.write = v288;
    repo.credentials = v290;
    repo.cwd = v291;
    repo.commit = v292;
    repo.branch = v293;
    repo.name = v298;
    repo.organization = v301;
    repo.sidebandable = v303;
    repo.action = v304;
    repo.accepted = false;
    repo.rejected = false;
    repo.sideband = null;
    repo.accept = v311;
    repo.reject = v313;
    const v314 = this.onPerm(repo);
    v314;
};
v284.onRequest = v315;
const v316 = Git.prototype;
const v320 = function (organization, name, cb) {
    const v317 = this.repos;
    const v318 = path.join(organization, name);
    const v319 = v317.create(v318, cb);
    v319;
};
v316.create = v320;
const v321 = Git.prototype;
const v322 = function (cb) {
    this.onPerm = cb;
};
v321.perm = v322;
const v323 = Git.prototype;
const v351 = function (req, res) {
    var self = this;
    const v324 = req.headers;
    const v325 = v324['x-forwarded-for'];
    const v326 = req.connection;
    const v327 = v326.remoteAddress;
    const v328 = v325 || v327;
    const v329 = req.socket;
    const v330 = v329.remoteAddress;
    const v331 = v328 || v330;
    const v332 = req.connection;
    const v333 = v332.socket;
    const v334 = v333.remoteAddress;
    var ip = v331 || v334;
    const v335 = 'Git.handle ' + ip;
    const v336 = v335 + ' - ';
    const v337 = req.method;
    const v338 = v336 + v337;
    const v339 = v338 + ' - ';
    const v340 = req.url;
    const v341 = v339 + v340;
    const v342 = debug(v341);
    v342;
    const v349 = function (err, credentials) {
        if (err) {
            const v343 = debug('Git.handle auth invalid user/pass', ip);
            v343;
            res.statusCode = 401;
            const v344 = res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            v344;
            const v345 = res.end('<html><body>Need some creds son</body></html>');
            return v345;
            return;
        }
        req.credentials = credentials;
        const v346 = debug('Git.handle auth success, accepting request');
        v346;
        const v347 = self.repos;
        const v348 = v347.handle(req, res);
        v348;
    };
    const v350 = this.auth(req, res, v349);
    v350;
};
v323.handle = v351;
const v352 = Git.prototype;
const v363 = function (dir, cb) {
    var self = this;
    const v361 = function (exists) {
        if (exists) {
            const v353 = cb();
            return v353;
        }
        const v359 = function (err) {
            if (err) {
                const v354 = cb(err);
                return v354;
            }
            const v355 = 'Git.init creating new bare repo in ' + dir;
            const v356 = debug(v355);
            v356;
            const v357 = { cwd: dir };
            const v358 = child.exec('git init --bare', v357, cb);
            v358;
        };
        const v360 = mkdirp(dir, v359);
        v360;
    };
    const v362 = fs.exists(dir, v361);
    v362;
};
v352.init = v363;
const v364 = Git.prototype;
const v379 = function (repo, cb) {
    var self = this;
    const v365 = !cb;
    if (v365) {
        const noop = function () {
        };
        cb = noop;
    }
    const v366 = repo.organization;
    const v367 = repo.name;
    var checkoutDir = self.checkoutDir(v366, v367);
    const v377 = function (err) {
        if (err) {
            const v368 = repo.sideband;
            const v369 = err.message;
            const v370 = 'checkout error ' + v369;
            const v371 = v370 + '\n';
            const v372 = v368.write(v371);
            v372;
            const v373 = 'Git.handlePush update err: ' + err;
            const v374 = debug(v373);
            v374;
            const v375 = cb(err);
            return v375;
        }
        const v376 = self.emit('sideband', repo);
        v376;
    };
    const v378 = self.update(repo, v377);
    v378;
};
v364.handlePush = v379;
const v380 = Git.prototype;
const v383 = function (organization, name) {
    const v381 = this.workDir;
    const v382 = path.join(v381, organization, name);
    return v382;
};
v380.checkoutDir = v383;
const v384 = Git.prototype;
const v397 = function (repo, cb) {
    var self = this;
    const v385 = repo.organization;
    const v386 = repo.name;
    const v387 = this.checkoutDir(v385, v386);
    const v395 = function (exists) {
        const v388 = repo.name;
        const v389 = v388 + ' exists? ';
        const v390 = v389 + exists;
        const v391 = debug(v390);
        v391;
        const v392 = !exists;
        if (v392) {
            const v393 = self.checkout(repo, cb);
            return v393;
        }
        const v394 = self.pull(repo, cb);
        v394;
    };
    const v396 = fs.exists(v387, v395);
    v396;
};
v384.update = v397;
const v398 = Git.prototype;
const v401 = function (organization, name, cb) {
    const v399 = this.repoDir;
    var dir = path.join(v399, organization, name);
    const v400 = this.init(dir, cb);
    v400;
};
v398.createDir = v401;
const v402 = Git.prototype;
const v444 = function (repo, cb) {
    var self = this;
    const v403 = repo.organization;
    const v404 = repo.name;
    var dir = this.checkoutDir(v403, v404);
    const v405 = mkdirp(dir, init);
    v405;
    const init = function (err) {
        if (err) {
            const v406 = 'mkdirp(' + dir;
            const v407 = v406 + ') failed';
            const v408 = cb(v407);
            return v408;
        }
        const v409 = 'mkdirp() ' + dir;
        const v410 = v409 + ' finished';
        const v411 = debug(v410);
        v411;
        const v412 = { cwd: dir };
        const v418 = function (err, stdo, stde) {
            if (err) {
                const v413 = cb(err);
                return v413;
            }
            const v414 = 'init() ' + dir;
            const v415 = v414 + ' finished';
            const v416 = debug(v415);
            v416;
            const v417 = fetch();
            v417;
        };
        const v419 = child.exec('git init', v412, v418);
        v419;
    };
    const fetch = function () {
        const v420 = self.repoDir;
        const v421 = repo.organization;
        const v422 = repo.name;
        const v423 = path.resolve(v420, v421, v422);
        const v424 = 'file://' + v423;
        const v425 = repo.branch;
        const v426 = encodeURIComponent(v425);
        const v427 = [
            'git',
            'fetch',
            v424,
            v426
        ];
        var cmd = v427.join(' ');
        const v428 = { cwd: dir };
        const v434 = function (err) {
            if (err) {
                const v429 = cb(err);
                return v429;
            }
            const v430 = 'fetch() ' + dir;
            const v431 = v430 + ' finished';
            const v432 = debug(v431);
            v432;
            const v433 = checkout();
            v433;
        };
        const v435 = child.exec(cmd, v428, v434);
        v435;
    };
    const checkout = function () {
        const v436 = repo.branch;
        const v437 = encodeURIComponent(v436);
        const v438 = repo.commit;
        const v439 = [
            'git',
            'checkout',
            '-b',
            v437,
            v438
        ];
        var cmd = v439.join(' ');
        const v440 = { cwd: dir };
        const v442 = function (err, stdo, stde) {
            const v441 = cb(err, stdo, stde);
            v441;
        };
        const v443 = child.exec(cmd, v440, v442);
        v443;
    };
};
v402.checkout = v444;
const v445 = Git.prototype;
const v472 = function (repo, cb) {
    var self = this;
    const v446 = repo.organization;
    const v447 = repo.name;
    var dir = this.checkoutDir(v446, v447);
    const v448 = repo.commit;
    const v449 = v448 + '.';
    const v450 = Date.now();
    repo.id = v449 + v450;
    const v451 = self.repoDir;
    const v452 = repo.organization;
    const v453 = repo.name;
    const v454 = path.resolve(v451, v452, v453);
    const v455 = 'file://' + v454;
    const v456 = repo.branch;
    const v457 = encodeURIComponent(v456);
    const v458 = [
        'git',
        'pull',
        v455,
        v457
    ];
    var cmd = v458.join(' ');
    const v459 = 'Git.pull ' + dir;
    const v460 = v459 + ': ';
    const v461 = v460 + cmd;
    const v462 = debug(v461);
    v462;
    const v463 = { cwd: dir };
    const v470 = function (err) {
        const v464 = 'Git.pull ' + dir;
        const v465 = v464 + ' done: ';
        const v466 = v465 + err;
        const v467 = debug(v466);
        v467;
        if (err) {
            const v468 = cb(err);
            return v468;
        }
        const v469 = cb(null);
        v469;
    };
    const v471 = child.exec(cmd, v463, v470);
    v471;
};
v445.pull = v472;