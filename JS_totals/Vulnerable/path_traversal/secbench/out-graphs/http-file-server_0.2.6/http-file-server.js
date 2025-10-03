var host = 'localhost';
var port = 8080;
var filesPath = null;
var browse = false;
var debug = false;
var noCache = false;
var defEnc = 'utf-8';
const v237 = 'text/html; charset=' + defEnc;
const v238 = 'text/css; charset=' + defEnc;
const v239 = 'text/css; charset=' + defEnc;
const v240 = 'text/javascript; charset=' + defEnc;
const v241 = 'text/plain; charset=' + defEnc;
const v242 = 'image/svg+xml; charset=' + defEnc;
const v243 = 'image/svg+xml; charset=' + defEnc;
var contentTypes = {};
contentTypes['.html'] = v237;
contentTypes['.css'] = v238;
contentTypes['.less'] = v239;
contentTypes['.js'] = v240;
contentTypes['.txt'] = v241;
contentTypes['.png'] = 'image/png';
contentTypes['.jpeg'] = 'image/jpeg';
contentTypes['.jpg'] = 'image/jpeg';
contentTypes['.jpe'] = 'image/jpeg';
contentTypes['.gif'] = 'image/gif';
contentTypes['.svg'] = v242;
contentTypes['.svgz'] = v243;
contentTypes['.ico'] = 'image/x-icon';
contentTypes['.eot'] = 'application/vnd.ms-fontobject';
contentTypes['.woff'] = 'application/font-woff';
contentTypes['.ttf'] = 'font/ttf';
contentTypes['*'] = 'application/octet-stream';
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
const v244 = require('child_process');
var spawn = v244.spawn;
var i = 2;
const v245 = process.argv;
var arg = v245[i];
const v246 = process.argv;
const v247 = v246.length;
let v248 = i < v247;
while (v248) {
    const v251 = /^--help$/.test(arg);
    if (v251) {
        const v252 = '\nUSAGE\n=====\n\n' + '--help      View this information\n';
        const v253 = v252 + '--path=abc  Set path of file server root directory (default is current dir)\n';
        const v254 = v253 + '--host=abc  Hostname of http-server (default is "';
        const v255 = v254 + host;
        const v256 = v255 + '"), use "*" for any host\n';
        const v257 = v256 + '--port=abc  Port of http-server (default is "';
        const v258 = v257 + port;
        const v259 = v258 + '")\n';
        const v260 = v259 + '--browse    Open hostname in browser (via "xdg-open")\n';
        const v261 = v260 + '--debug     Logging every request\n';
        const v262 = v261 + '--no-cache  Disable caching in headers\n';
        const v263 = console.log(v262);
        v263;
        const v264 = process.exit(0);
        v264;
    } else {
        const v265 = /^--path=.+$/.test(arg);
        if (v265) {
            const v266 = filesPath === null;
            if (v266) {
                filesPath = arg.replace(/^--path=/, '');
            }
        } else {
            const v267 = /^--host=.+$/.test(arg);
            if (v267) {
                host = arg.replace(/^--host=/, '');
                const v268 = host == '*';
                if (v268) {
                    host = null;
                }
            } else {
                const v269 = /^--port=.+$/.test(arg);
                if (v269) {
                    port = arg.replace(/^--port=/, '');
                } else {
                    const v270 = /^--browse$/.test(arg);
                    if (v270) {
                        browse = true;
                    } else {
                        const v271 = /^--debug$/.test(arg);
                        if (v271) {
                            debug = true;
                        } else {
                            const v272 = /^--no-cache$/.test(arg);
                            if (v272) {
                                noCache = true;
                            } else {
                                const v273 = 'Unknown argument "' + arg;
                                const v274 = v273 + '"';
                                const v275 = console.error(v274);
                                v275;
                                const v276 = console.log('Run with --help argument for view usage information');
                                v276;
                                const v277 = process.exit(1);
                                v277;
                            }
                        }
                    }
                }
            }
        }
    }
    const v249 = i++;
    const v250 = process.argv;
    v248 = i < v247;
}
const v278 = filesPath === null;
if (v278) {
    filesPath = process.cwd();
    const v279 = 'Path is empty! Will be used current work dir: "' + filesPath;
    const v280 = v279 + '"';
    const v281 = console.warn(v280);
    v281;
    const v282 = console.warn('For specific path, start this app with: --path=/specific/path');
    v282;
}
const v283 = process.env;
const v284 = v283['HOME'];
const v285 = filesPath.replace('~', v284);
const v286 = process.cwd();
const v287 = v286 + '/';
filesPath = v285.replace(/^\.\//, v287);
const v453 = function (req, res) {
    var msgHTTP200 = ' (HTTP status: 200)';
    var msgHTTP404 = ' (HTTP status: 404)';
    var msgHTTP500 = ' (HTTP status: 500)';
    const v288 = req.url;
    const v289 = url.parse(v288);
    var pathname = v289.pathname;
    const v290 = pathname.split('+');
    const v291 = v290.join(' ');
    pathname = decodeURIComponent(v291);
    const v292 = pathname.substr(0, 1);
    let v293 = v292 == '/';
    while (v293) {
        pathname = pathname.substr(1);
        v293 = v292 == '/';
    }
    const v294 = 'HTTP-request for pathname: "/' + pathname;
    const v295 = v294 + '"';
    const v296 = console.log(v295);
    const v297 = debug && v296;
    v297;
    var fullPath = path.join(filesPath, pathname);
    var fileDescriptor = null;
    var fileStat = null;
    const tellAboutError = function (errNum, errMsg) {
        const v298 = { 'Content-Type': 'text/plain; charset=utf-8' };
        const v299 = res.writeHead(errNum, v298);
        v299;
        const v300 = 'Error ' + errNum;
        const v301 = v300 + '. ';
        const v302 = v301 + errMsg;
        const v303 = res.end(v302);
        v303;
    };
    const listDir = function () {
        const v304 = '<!doctype html>' + '<html>';
        const v305 = v304 + '<head>';
        const v306 = v305 + '<meta charset="utf-8">';
        const v307 = v306 + '<title>Directory "#PATHNAME#"</title>';
        const v308 = v307 + '</head>';
        const v309 = v308 + '<body>';
        const v310 = v309 + '<h1>Directory "#PATHNAME#"</h1>';
        const v311 = v310 + '<ul>';
        const v312 = v311 + '#LIST_ELEMENTS#';
        const v313 = v312 + '</ul>';
        const v314 = v313 + '</body>';
        var template = v314 + '</html>';
        var listElementTemplate = '<li>#TYPE# <a href="#LINK#">#TITLE#</a></li>';
        const v315 = 'Listing directory "' + fullPath;
        const v316 = v315 + '" ...';
        const v317 = console.log(v316);
        const v318 = debug && v317;
        v318;
        const v357 = function (err, files) {
            if (err) {
                const v319 = 'Read dir error "' + fullPath;
                const v320 = v319 + '"';
                const v321 = v320 + msgHTTP500;
                const v322 = console.error(v321);
                const v323 = debug && v322;
                v323;
                const v324 = tellAboutError(500, 'Cannot read directory.');
                v324;
                return;
            }
            var dirsList = [];
            var filesList = [];
            var listElements = '';
            const v325 = pathname !== '';
            const v326 = pathname !== '/';
            const v327 = v325 && v326;
            if (v327) {
                const v328 = listElementTemplate.replace(/#TYPE#/g, '[D]');
                const v329 = v328.replace(/#LINK#/g, './..');
                listElements += v329.replace(/#TITLE#/g, '..');
            }
            const v334 = function (file) {
                var filePath = path.join(fullPath, file);
                var stat = fs.statSync(filePath);
                const v330 = stat.isDirectory();
                if (v330) {
                    const v331 = dirsList.push(file);
                    v331;
                } else {
                    const v332 = stat.isFile();
                    if (v332) {
                        const v333 = filesList.push(file);
                        v333;
                    }
                }
            };
            const v335 = files.forEach(v334);
            v335;
            dirsList = dirsList.sort();
            filesList = filesList.sort();
            const v340 = function (name) {
                const v336 = listElementTemplate.replace(/#TYPE#/g, '[D]');
                const v337 = './' + name;
                const v338 = v337 + '/';
                const v339 = v336.replace(/#LINK#/g, v338);
                listElements += v339.replace(/#TITLE#/g, name);
            };
            const v341 = dirsList.forEach(v340);
            v341;
            const v345 = function (name) {
                const v342 = listElementTemplate.replace(/#TYPE#/g, '[F]');
                const v343 = './' + name;
                const v344 = v342.replace(/#LINK#/g, v343);
                listElements += v344.replace(/#TITLE#/g, name);
            };
            const v346 = filesList.forEach(v345);
            v346;
            const v347 = '/' + pathname;
            const v348 = template.replace(/#PATHNAME#/g, v347);
            var html = v348.replace(/#LIST_ELEMENTS#/g, listElements);
            var head = {};
            head['Content-Type'] = 'text/html; charset=utf-8';
            const v349 = Buffer.byteLength(html, defEnc);
            head['Content-Length'] = v349;
            if (noCache) {
                head['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                head['Pragma'] = 'no-cache';
                head['Expires'] = '0';
            }
            const v350 = 'Directory "' + fullPath;
            const v351 = v350 + '" is opened';
            const v352 = v351 + msgHTTP200;
            const v353 = console.log(v352);
            const v354 = debug && v353;
            v354;
            const v355 = res.writeHead(200, head);
            v355;
            const v356 = res.end(html);
            v356;
        };
        const v358 = fs.readdir(fullPath, v357);
        v358;
    };
    const openFile = function () {
        const v359 = 'Opening file "' + fullPath;
        const v360 = v359 + '" ...';
        const v361 = console.log(v360);
        const v362 = debug && v361;
        v362;
        const v363 = {
            flags: 'r',
            encoding: defEnc,
            autoClose: true
        };
        var stream = fs.createReadStream(fullPath, 'binary', v363);
        var head = {};
        const v364 = fileStat.size;
        head['Content-Length'] = v364;
        if (noCache) {
            head['Cache-Control'] = 'no-cache, no-store, must-revalidate';
            head['Pragma'] = 'no-cache';
            head['Expires'] = '0';
        }
        let ext;
        for (ext in contentTypes) {
            const v365 = ext == '*';
            if (v365) {
                continue;
            }
            const v366 = path.extname(fullPath);
            const v367 = ext == v366;
            if (v367) {
                const v368 = 'File "' + fullPath;
                const v369 = v368 + '" mime-type is "';
                const v370 = contentTypes[ext];
                const v371 = v369 + v370;
                const v372 = v371 + '"';
                const v373 = v372 + msgHTTP200;
                const v374 = console.log(v373);
                const v375 = debug && v374;
                v375;
                const v376 = contentTypes[ext];
                head['Content-Type'] = v376;
            }
        }
        const v377 = 'Content-Type' in head;
        const v378 = !v377;
        if (v378) {
            const v379 = contentTypes['*'];
            const v380 = typeof v379;
            const v381 = v380 === 'string';
            if (v381) {
                const v382 = 'File "' + fullPath;
                const v383 = v382 + '" mime-type is "';
                const v384 = contentTypes['*'];
                const v385 = v383 + v384;
                const v386 = v385 + '"';
                const v387 = v386 + msgHTTP200;
                const v388 = console.log(v387);
                const v389 = debug && v388;
                v389;
                const v390 = contentTypes['*'];
                head['Content-Type'] = v390;
            } else {
                const v391 = 'Cannot detect file mime-type "' + fullPath;
                const v392 = v391 + '"';
                const v393 = v392 + msgHTTP200;
                const v394 = console.log(v393);
                const v395 = debug && v394;
                v395;
            }
        }
        const v396 = res.writeHead(200, head);
        v396;
        const v397 = 'Reading file "' + fullPath;
        const v398 = v397 + '" ...';
        const v399 = console.log(v398);
        const v400 = debug && v399;
        v400;
        const v402 = function (chunk) {
            const v401 = res.write(chunk, 'binary');
            v401;
        };
        const v403 = stream.on('data', v402);
        v403;
        const v410 = function (err) {
            const v404 = 'Read file error "' + fullPath;
            const v405 = v404 + '"';
            const v406 = v405 + msgHTTP500;
            const v407 = console.error(v406);
            const v408 = debug && v407;
            v408;
            const v409 = tellAboutError(500, 'Cannot read file.');
            v409;
        };
        const v411 = stream.on('error', v410);
        v411;
        const v417 = function () {
            const v412 = 'Reading file "' + fullPath;
            const v413 = v412 + '" is finished';
            const v414 = console.log(v413);
            const v415 = debug && v414;
            v415;
            const v416 = res.end();
            v416;
        };
        const v418 = stream.on('end', v417);
        v418;
    };
    const getStatCallback = function (err, stat) {
        if (err) {
            const v419 = 'Cannot get file stat "' + fullPath;
            const v420 = v419 + '"';
            const v421 = v420 + msgHTTP500;
            const v422 = console.error(v421);
            const v423 = debug && v422;
            v423;
            const v424 = tellAboutError(500, 'Cannot open this path.');
            v424;
            return;
        }
        fileStat = stat;
        const v425 = fileStat.isFile();
        if (v425) {
            const v426 = process.nextTick(openFile);
            v426;
        } else {
            const v427 = fileStat.isDirectory();
            if (v427) {
                const v428 = process.nextTick(listDir);
                v428;
            } else {
                const v429 = 'Unknown type of inode "' + fullPath;
                const v430 = v429 + '"';
                const v431 = v430 + msgHTTP500;
                const v432 = console.error(v431);
                const v433 = debug && v432;
                v433;
                const v434 = tellAboutError(500, 'Cannot open this path.');
                v434;
                return;
            }
        }
    };
    const v451 = function (exists) {
        const v435 = !exists;
        if (v435) {
            const v436 = 'Path "' + fullPath;
            const v437 = v436 + '" is not found';
            const v438 = v437 + msgHTTP404;
            const v439 = console.error(v438);
            const v440 = debug && v439;
            v440;
            const v441 = tellAboutError(404, 'Page not found.');
            v441;
            return;
        }
        const v449 = function (err, fd) {
            if (err) {
                const v442 = 'Cannot open file descriptor "' + fullPath;
                const v443 = v442 + '"';
                const v444 = v443 + msgHTTP500;
                const v445 = console.error(v444);
                const v446 = debug && v445;
                v446;
                const v447 = tellAboutError(500, 'Cannot open this path.');
                v447;
                return;
            }
            fileDescriptor = fd;
            const v448 = fs.fstat(fileDescriptor, getStatCallback);
            v448;
        };
        const v450 = fs.open(fullPath, 'r', v449);
        v450;
    };
    const v452 = fs.exists(fullPath, v451);
    v452;
};
const v454 = http.createServer(v453);
const v471 = function () {
    let v455;
    if (host) {
        v455 = host;
    } else {
        v455 = 'localhost';
    }
    const v456 = 'http://' + v455;
    const v457 = v456 + ':';
    var httpAddr = v457 + port;
    let host;
    if (host) {
        host = host;
    } else {
        host = '*';
    }
    const v458 = 'HTTP-server started at ' + host;
    const v459 = v458 + ':';
    const v460 = v459 + port;
    const v461 = v460 + ', files path is: "';
    const v462 = v461 + filesPath;
    const v463 = v462 + '"';
    const v464 = console.log(v463);
    v464;
    if (browse) {
        const v465 = 'Start xdg-open to open page "' + httpAddr;
        const v466 = v465 + '" in browser';
        const v467 = console.log(v466);
        v467;
        const v468 = [httpAddr];
        const v469 = { stdio: 'inherit' };
        const v470 = spawn('xdg-open', v468, v469);
        v470;
    }
};
const v472 = v454.listen(port, host, v471);
v472;