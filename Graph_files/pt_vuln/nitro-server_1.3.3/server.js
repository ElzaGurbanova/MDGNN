'use strict';
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var $q = require('q-promise/no-native');
var colors = require('colors');
var mime = require('mime');
var cwd = process.cwd();
const extend = function () {
    const v212 = [];
    const v213 = v212.shift;
    var dest = v213.call(arguments);
    const v214 = [];
    const v215 = v214.shift;
    var src = v215.call(arguments);
    var key;
    while (src) {
        for (key in src) {
            const v216 = src[key];
            dest[key] = v216;
        }
        const v217 = [];
        const v218 = v217.shift;
        src = v218.call(arguments);
    }
    return dest;
};
const noop = function (value) {
    return value;
};
const clearSlash = function (path_str) {
    const v219 = path_str.replace(/^\/|\/$/g, '');
    return v219;
};
const qStat = function (filepath) {
    const v225 = function (resolve, reject) {
        const v223 = function (err, stat) {
            const v220 = err !== null;
            if (v220) {
                const v221 = reject(filepath);
                v221;
            }
            const v222 = resolve(stat);
            v222;
        };
        const v224 = fs.stat(filepath, v223);
        v224;
    };
    const v226 = $q(v225);
    return v226;
};
const tryFilesFn = function (basePath, uri, tryFiles) {
    var filepath = tryFiles.shift();
    const v227 = !filepath;
    if (v227) {
        const v228 = $q.reject();
        return v228;
    }
    const v229 = filepath.replace(/\$uri/, uri);
    filepath = path.join(basePath, v229);
    const v230 = qStat(filepath);
    const v239 = function (stat) {
        const v231 = stat.isDirectory();
        if (v231) {
            const v232 = /\/$/.test(filepath);
            let v233;
            if (v232) {
                v233 = '';
            } else {
                v233 = '/';
            }
            filepath += v233 + 'index.html';
            const v234 = qStat(filepath);
            const v235 = function () {
                return filepath;
            };
            const v236 = v234.then(v235);
            return v236;
        } else {
            const v237 = stat.isFile();
            const v238 = !v237;
            if (v238) {
                throw 'uri is not a file';
            }
        }
        return filepath;
    };
    const v240 = v230.then(v239);
    const v242 = function (reason) {
        const v241 = tryFilesFn(basePath, uri, tryFiles);
        return v241;
    };
    const v243 = v240.catch(v242);
    return v243;
};
const v244 = {};
var defaultOptions = {};
defaultOptions.protocol = 'http';
defaultOptions.hostname = '0.0.0.0';
defaultOptions.port = 8080;
defaultOptions.root = '.';
defaultOptions.keepalive = false;
defaultOptions.debug = false;
defaultOptions.livereload = false;
defaultOptions.open = false;
defaultOptions.dirAlias = v244;
defaultOptions.onStart = noop;
defaultOptions.onStop = noop;
defaultOptions.log = true;
const runServer = function (rootpath, options) {
    const v245 = {};
    options = options || v245;
    const v246 = typeof rootpath;
    const v247 = v246 === 'object';
    const v248 = rootpath != null;
    const v249 = v247 && v248;
    if (v249) {
        options = rootpath;
    } else {
        options.root = rootpath;
    }
    const v250 = Object.create(defaultOptions);
    options = extend(v250, options);
    const v251 = options.cwd;
    if (v251) {
        const v252 = options.cwd;
        cwd = path.resolve(cwd, v252);
    }
    const v253 = options.debug;
    if (v253) {
        const v254 = JSON.stringify(options);
        const v255 = 'options : ' + v254;
        const v256 = console.log(v255);
        v256;
    }
    var matchAlias = {};
    const v257 = options.dirAlias;
    const v258 = Object.keys(v257);
    const v261 = function (dir) {
        const v259 = clearSlash(dir);
        const v260 = '^' + v259;
        matchAlias[dir] = new RegExp(v260);
    };
    const v262 = v258.forEach(v261);
    v262;
    const v263 = cwd.replace(/\/$/, '');
    const v264 = options.root;
    const v265 = options.root;
    const v266 = '/' + v265;
    let v267;
    if (v264) {
        v267 = v266;
    } else {
        v267 = '';
    }
    var documentRoot = v263 + v267;
    const v349 = function (request, response) {
        const v268 = request.url;
        const v269 = url.parse(v268);
        var uri = v269.pathname;
        var uriClear = clearSlash(uri);
        var uriLog = uri;
        var basePath = documentRoot;
        var contentType = 'text/plain';
        const v270 = options.headers;
        if (v270) {
            let header;
            const v271 = options.headers;
            for (header in v271) {
                const v272 = options.headers;
                const v273 = v272[header];
                const v274 = response.setHeader(header, v273);
                v274;
            }
        }
        const v275 = options.dirAlias;
        const v276 = Object.keys(v275);
        const v286 = function (dir) {
            const v277 = matchAlias[dir];
            const v278 = v277.test(uriClear);
            if (v278) {
                const v279 = matchAlias[dir];
                const v280 = uriClear.replace(v279, '');
                var uriRelative = v280.replace(/^\//, '');
                basePath = cwd;
                const v281 = options.dirAlias;
                const v282 = v281[dir];
                uri = path.join(v282, uriRelative);
                const v283 = '/' + dir;
                const v284 = v283.blue;
                const v285 = v284 + '/';
                uriLog = v285 + uriRelative;
            }
        };
        const v287 = v276.forEach(v286);
        v287;
        const v288 = uri.replace(/\/$/, '');
        const v289 = ['$uri'];
        const v290 = options.tryFiles;
        const v291 = typeof v290;
        const v292 = v291 === 'string';
        const v293 = options.tryFiles;
        const v294 = v293.split(/\s+/);
        const v295 = options.tryFiles;
        const v296 = options.tryFiles;
        const v297 = v296.slice();
        const v298 = v295 && v297;
        const v299 = ['$uri.html'];
        const v300 = v298 || v299;
        let v301;
        if (v292) {
            v301 = v294;
        } else {
            v301 = v300;
        }
        const v302 = v289.concat(v301);
        const v303 = tryFilesFn(basePath, v288, v302);
        const v334 = function (filepath) {
            const v304 = /\w+\.\w+/.test(filepath);
            if (v304) {
                const v305 = mime.lookup(filepath);
                const v306 = v305 || contentType;
                contentType = v306 + '; charset=UTF-8';
            }
            const v332 = function (err, file) {
                if (err) {
                    const v307 = { 'Content-Type': contentType };
                    const v308 = response.writeHead(500, v307);
                    v308;
                    const v309 = err + '\n';
                    const v310 = response.write(v309);
                    v310;
                    const v311 = response.end();
                    v311;
                    const v312 = options.log;
                    if (v312) {
                        const v313 = '[500]'.lightred;
                        const v314 = ' ' + uriLog;
                        const v315 = v314.cyan;
                        const v316 = v313 + v315;
                        const v317 = console.log(v316);
                        v317;
                    }
                    return;
                }
                const v318 = { 'Content-Type': contentType };
                const v319 = response.writeHead(200, v318);
                v319;
                const v320 = response.write(file, 'binary');
                v320;
                const v321 = response.end();
                v321;
                const v322 = options.log;
                if (v322) {
                    const v323 = '[200]'.green;
                    const v324 = ' ' + uriLog;
                    const v325 = v324.white;
                    const v326 = v323 + v325;
                    const v327 = '  (' + contentType;
                    const v328 = v327 + ')';
                    const v329 = v328.yellow;
                    const v330 = v326 + v329;
                    const v331 = console.log(v330);
                    v331;
                }
            };
            const v333 = fs.readFile(filepath, 'binary', v332);
            v333;
        };
        const v347 = function () {
            const v335 = { 'Content-Type': 'text/html; charset=UTF-8' };
            const v336 = response.writeHead(404, v335);
            v336;
            const v337 = '<div style="text-align: center;"><div style="display: inline-block; min-width: 80%; border: 1px solid #999; padding: 0.5em; text-align: left;"><div><span style="color: red;">404</span> <span style="font-weight: bold;">' + uri;
            const v338 = v337 + '</span></div><div>Not Found</div></div></div>';
            const v339 = response.write(v338);
            v339;
            const v340 = response.end();
            v340;
            const v341 = options.log;
            if (v341) {
                const v342 = '[404]'.red;
                const v343 = ' ' + uriLog;
                const v344 = v343.cyan;
                const v345 = v342 + v344;
                const v346 = console.log(v345);
                v346;
            }
        };
        const v348 = v303.then(v334, v347);
        v348;
    };
    const v350 = http.createServer(v349);
    const v351 = options.port;
    const v352 = parseInt(v351, 10);
    const v353 = options.hostname;
    const v421 = function () {
        const v354 = options.hostname;
        const v355 = v354 === '0.0.0.0';
        const v356 = options.hostname;
        let v357;
        if (v355) {
            v357 = 'localhost';
        } else {
            v357 = v356;
        }
        const v358 = 'http://' + v357;
        const v359 = v358 + ':';
        const v360 = options.port;
        var url = v359 + v360;
        const v361 = options.log;
        if (v361) {
            const v362 = '\nStatic file server running at\n  => '.yellow;
            const v363 = url.green;
            const v364 = v362 + v363;
            const v365 = '/\nCTRL + C to shutdown\n'.yellow;
            const v366 = v364 + v365;
            const v367 = console.log(v366);
            v367;
            const v368 = 'Root directory is: '.yellow;
            const v369 = options.root;
            const v370 = path.join(cwd, v369);
            const v371 = v370.green;
            const v372 = v368 + v371;
            const v373 = v372 + '\n';
            const v374 = console.log(v373);
            v374;
        }
        const v375 = options.onStart;
        const v376 = v375 instanceof Function;
        if (v376) {
            const v377 = options.onStart;
            const v378 = v377.call(server);
            v378;
        }
        const v379 = options.openInBrowser;
        if (v379) {
            const v380 = require('opn');
            const v381 = options.openInBrowser;
            const v382 = typeof v381;
            const v383 = v382 === 'string';
            const v384 = options.openInBrowser;
            const v385 = { app: v384 };
            let v386;
            if (v383) {
                v386 = v385;
            } else {
                v386 = null;
            }
            const v387 = v380(url, v386);
            v387;
        }
        const v388 = options.livereload;
        if (v388) {
            const v389 = options.root;
            var watchDirs = [v389];
            let livereloadOptions;
            const v390 = options.livereload;
            const v391 = typeof v390;
            const v392 = v391 === 'number';
            const v393 = options.livereload;
            const v394 = { port: v393 };
            const v395 = options.livereload;
            const v396 = typeof v395;
            const v397 = v396 === 'object';
            const v398 = options.livereload;
            const v399 = {};
            const v400 = v398 || v399;
            const v401 = {};
            let v402;
            if (v397) {
                v402 = v400;
            } else {
                v402 = v401;
            }
            if (v392) {
                livereloadOptions = v394;
            } else {
                livereloadOptions = v402;
            }
            let d;
            const v403 = options.dirAlias;
            for (d in v403) {
                const v404 = options.dirAlias;
                const v405 = v404[d];
                const v406 = watchDirs.push(v405);
                v406;
            }
            const v407 = options.log;
            if (v407) {
                const v408 = 'livereload'.cyan;
                const v409 = console.log(v408);
                v409;
                const v410 = '  dirs'.yellow;
                const v411 = console.log(v410, watchDirs);
                v411;
                const v412 = '  options'.yellow;
                const v413 = console.log(v412, livereloadOptions);
                v413;
                const v414 = console.log('\n');
                v414;
            }
            const v415 = require('livereload');
            const v416 = v415.createServer(livereloadOptions);
            const v418 = function (dir) {
                const v417 = path.join(cwd, dir);
                return v417;
            };
            const v419 = watchDirs.map(v418);
            const v420 = v416.watch(v419);
            v420;
        }
    };
    var server = v350.listen(v352, v353, v421);
    return server;
};
const v422 = {};
v422.start = runServer;
module.exports = v422;