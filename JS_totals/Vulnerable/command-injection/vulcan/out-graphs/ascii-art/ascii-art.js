var argv;
var yargs = require('yargs');
var fs = require('fs');
var art = require('../ascii-art');
const v225 = yargs.usage('Usage: $0 <command> [options] <target>');
v225;
const v226 = yargs.command('image', 'convert an image to ascii');
const v227 = v226.command('art', 'get some ascii art from various sites');
const v228 = v227.command('text', 'add styles and/or font rendering to text');
const v229 = v228.demand(2);
const v230 = v229.example('$0 art textfiles.com/spock.art ', 'request the file "spock.art" remotely from "textfiles.com"');
const v231 = v230.example('$0 install Font.flf ', 'install a figlet font');
const v232 = v231.example('$0 image foo.jpg ', 'output foo.jpg as inline ascii text with ansi colors');
const v233 = v232.example('$0 text -F Doom "Some Titles"', 'outputs "Some Titles" in the Doom font');
const v234 = v233.example('$0 text -s red+underline "Some Titles"', 'outputs "Some Titles" with a red and underlined terminal style');
const v235 = v234.example('$0 text -F Doom "Some Titles"', 'outputs "Some Titles" in the Doom font');
const v236 = v235.example('$0 list all', 'show all fonts available at figlet.org');
const v237 = v236.example('$0 preview weird', 'visit the prieview page for weird.flf at figlet.org');
const v238 = v237.example('$0 install weird', 'install weird.flf into the local "/Fonts" directory');
const v239 = v238.example('$0 install weird -g', 'install weird.flf into the currently executing ascii-art instance');
const v240 = v239.alias('s', 'style');
const v241 = v240.nargs('s', 1);
const v242 = v241.describe('s', 'render a ansi style onto a string');
const v243 = v242.alias('F', 'font');
const v244 = v243.nargs('F', 1);
const v245 = v244.describe('F', 'render the output in the specified font');
const v246 = v245.alias('g', 'global');
const v247 = v246.nargs('g', 0);
const v248 = v247.describe('g', 'install the font globally');
const v249 = v248.alias('o', 'output');
const v250 = v249.nargs('o', 1);
const v251 = v250.describe('o', 'Save to a file');
const v252 = v251.alias('a', 'alphabet');
const v253 = v252.alias('a', 'alpha');
const v254 = v253.nargs('a', 1);
const v255 = art.valueScales;
const v256 = Object.keys(v255);
const v257 = v254.choices('a', v256);
const v258 = v257.describe('a', 'Which alphabet to use');
const v259 = v258.help('h');
const v260 = v259.alias('h', 'help');
const v261 = v260.epilog('\xA92016 - Abbey Hawk Sparrow');
v261;
argv = yargs.argv;
const v262 = argv._;
var action = v262.shift();
const v263 = argv._;
var target = v263.pop();
var ftp;
var request;
switch (action) {
case 'image':
    var options = {};
    options.filepath = target;
    const v264 = argv.a;
    if (v264) {
        const v265 = argv.a;
        options.alphabet = v265;
    }
    const v266 = process.stdout;
    const v267 = process && v266;
    const v268 = process.stdout;
    const v269 = v268.columns;
    const v270 = v267 && v269;
    if (v270) {
        const v271 = process.stdout;
        const v272 = v271.columns;
        options.width = v272;
    }
    var image = new art.Image(options);
    const v277 = function (err, rendered) {
        const v273 = argv.o;
        if (v273) {
            const v274 = argv.o;
            const v275 = fs.writeFile(v274, rendered);
            v275;
        } else {
            const v276 = console.log(rendered);
            v276;
        }
    };
    const v278 = image.write(v277);
    v278;
    break;
case 'art':
    const v279 = target || '';
    var parts = v279.split('/');
    const v280 = !request;
    if (v280) {
        request = require('request');
    }
    const page2List = function (text, base, omit) {
        const v281 = text.match(/<A(.*?)<\/A>/g);
        const v285 = function (i) {
            const v282 = i.indexOf('?');
            const v283 = -1;
            const v284 = v282 === v283;
            return v284;
        };
        const v286 = v281.filter(v285);
        const v299 = function (line) {
            const v287 = line.match(/".*?"/);
            const v288 = v287[0];
            var name = v288 || '';
            const v289 = line.match(/>.*?</);
            const v290 = v289[0];
            var file = v290 || '';
            const v291 = name.length;
            const v292 = v291 - 1;
            const v293 = name.substring(1, v292);
            const v294 = file.length;
            const v295 = v294 - 1;
            const v296 = file.substring(1, v295);
            const v297 = base + v296;
            const v298 = {};
            v298.name = v293;
            v298.file = v297;
            return v298;
        };
        const v300 = v286.map(v299);
        const v317 = function (i) {
            const v301 = [];
            const v302 = omit || v301;
            const v303 = i.name;
            const v304 = v302.indexOf(v303);
            const v305 = -1;
            const v306 = v304 === v305;
            const v307 = i.name;
            const v308 = v307.indexOf('://');
            const v309 = -1;
            const v310 = v308 === v309;
            const v311 = v306 && v310;
            const v312 = i.name;
            const v313 = v312.toUpperCase();
            const v314 = i.name;
            const v315 = v313 !== v314;
            const v316 = v311 && v315;
            return v316;
        };
        var matches = v300.filter(v317);
        return matches;
    };
    var exclusions = [
        '/apple',
        '/bbs',
        'LOGOS',
        'SEQ',
        '../archives/asciiart.zip',
        'NFOS',
        'LOGOS',
        'RTTY',
        '/piracy'
    ];
    const v318 = parts[0];
    switch (v318) {
    case 'textfiles.com':
        const v319 = parts[1];
        if (v319) {
            var pre = '';
            var post = '';
            const v320 = parts[1];
            switch (v320) {
            case 'NFOS':
                post = 'asciiart/';
            case 'asciiart':
                pre = 'artscene.';
                break;
            case 'LOGOS':
            case 'DECUS':
                post = 'art/';
                break;
            case 'RAZOR':
            case 'FAIRLIGHT':
            case 'DREAMTEAM':
            case 'HUMBLE':
            case 'HYBRID':
            case 'PRESTIGE':
            case 'INC':
            case 'TDUJAM':
            case 'ANSI':
                post = 'piracy/';
                break;
            }
            const v321 = parts[2];
            if (v321) {
                const v322 = 'http://' + pre;
                const v323 = v322 + 'textfiles.com/';
                const v324 = v323 + post;
                const v325 = parts[1];
                const v326 = v324 + v325;
                const v327 = v326 + '/';
                const v328 = parts[2];
                const v329 = v327 + v328;
                const v331 = function (err, req, data) {
                    const v330 = console.log(data);
                    v330;
                };
                const v332 = request(v329, v331);
                v332;
            } else {
                const v333 = 'http://' + pre;
                const v334 = v333 + 'textfiles.com/';
                const v335 = v334 + post;
                const v336 = parts[1];
                const v337 = v335 + v336;
                var base = v337 + '/';
                const v342 = function (err, req, data) {
                    if (err) {
                        throw err;
                    }
                    var text = data.toString();
                    var matches = page2List(text, base, exclusions);
                    const v338 = { data: matches };
                    const v340 = function (rendered) {
                        const v339 = console.log(rendered);
                        v339;
                    };
                    const v341 = art.table(v338, v340);
                    v341;
                };
                const v343 = request(base, v342);
                v343;
            }
        } else {
            const v344 = {
                name: 'asciiart',
                detail: 'community shared'
            };
            const v345 = {
                name: 'art',
                detail: 'classic files'
            };
            const v346 = {
                name: 'RTTY',
                detail: 'Teletype Art'
            };
            const v347 = {
                name: 'LOGOS',
                detail: 'Classic Logos'
            };
            const v348 = {
                name: 'DECUS',
                detail: 'Printer Art'
            };
            const v349 = {
                name: 'RAZOR',
                detail: 'Cracking Group'
            };
            const v350 = {
                name: 'FAIRLIGHT',
                detail: 'Cracking Group'
            };
            const v351 = {
                name: 'DREAMTEAM',
                detail: 'Cracking Group'
            };
            const v352 = {
                name: 'HUMBLE',
                detail: 'Cracking Group'
            };
            const v353 = {
                name: 'HYBRID',
                detail: 'Cracking Group'
            };
            const v354 = {
                name: 'PRESTIGE',
                detail: 'Cracking Group'
            };
            const v355 = {
                name: 'INC',
                detail: 'Cracking Group'
            };
            const v356 = {
                name: 'TDUJAM',
                detail: 'Cracking Group'
            };
            const v357 = {
                name: 'ANSI',
                detail: 'Misc ANSI Files'
            };
            const v358 = {
                name: 'NFOS',
                detail: 'Misc NFO Files'
            };
            const v359 = [
                v344,
                v345,
                v346,
                v347,
                v348,
                v349,
                v350,
                v351,
                v352,
                v353,
                v354,
                v355,
                v356,
                v357,
                v358
            ];
            const v360 = { data: v359 };
            const v362 = function (rendered) {
                const v361 = console.log(rendered);
                v361;
            };
            const v363 = art.table(v360, v362);
            v363;
        }
        break;
    case '':
        break;
    default:
        const v364 = parts[0];
        const v365 = 'unknown art source:' + v364;
        const v366 = new Error(v365);
        throw v366;
    }
    var options = {};
    options.filepath = target;
    break;
case 'text':
    var output = function (result) {
        const v367 = console.log(result);
        v367;
    };
    const v368 = argv.F;
    if (v368) {
        const v369 = argv.s;
        if (v369) {
            const v370 = argv.F;
            const v371 = argv.s;
            const v372 = art.font(target, v370, v371, output);
            v372;
        } else {
            const v373 = argv.F;
            const v374 = art.font(target, v373, output);
            v374;
        }
    } else {
        const v375 = argv.s;
        const v376 = v375 || '';
        const v377 = art.style(target, v376, true);
        const v378 = console.log(v377);
        v378;
    }
    break;
case 'list':
    var JSFtp = ftp || (ftp = require('jsftp'));
    const v379 = { host: 'ftp.figlet.org' };
    var client = new JSFtp(v379);
    var results = [];
    const v401 = function (err, res) {
        const v380 = !err;
        if (v380) {
            const v383 = function (item) {
                const v381 = item.name;
                const v382 = 'ours/' + v381;
                return v382;
            };
            const v384 = res.map(v383);
            results = results.concat(v384);
        }
        const v399 = function (err, res) {
            const v385 = !err;
            if (v385) {
                const v388 = function (item) {
                    const v386 = item.name;
                    const v387 = 'contributed/' + v386;
                    return v387;
                };
                const v389 = res.map(v388);
                results = results.concat(v389);
            }
            const v397 = function (err, data) {
                if (err) {
                    const v390 = console.error(err);
                    return v390;
                }
                const v395 = function (path) {
                    const v391 = path.split('/');
                    const v392 = v391.pop();
                    const v393 = v392.split('.');
                    const v394 = v393.shift();
                    return v394;
                };
                var names = results.map(v395);
                const v396 = console.log(names);
                v396;
            };
            const v398 = client.raw('quit', v397);
            v398;
        };
        const v400 = client.ls('pub/figlet/fonts/contributed', v399);
        v400;
    };
    const v402 = client.ls('pub/figlet/fonts/ours', v401);
    v402;
    break;
case 'preview':
    const v403 = require('child_process');
    var exec = v403.exec;
    const v404 = target.toLowerCase();
    const v405 = 'open "http://www.figlet.org/fontdb_example.cgi?font=' + v404;
    const v406 = v405 + '.flf"';
    const v407 = exec(v406);
    v407;
    break;
case 'install':
    var JSFtp = ftp || (ftp = require('jsftp'));
    const v408 = { host: 'ftp.figlet.org' };
    var ftp = new JSFtp(v408);
    var subdir = 'contributed';
    var makeURLForDirectory = function (dir) {
        const v409 = 'pub/figlet/fonts/' + dir;
        const v410 = v409 + '/';
        const v411 = target.toLowerCase();
        const v412 = v410 + v411;
        const v413 = v412 + '.flf';
        return v413;
    };
    var handle = function (sock) {
        var str = '';
        const v414 = function (d) {
            str += d.toString();
        };
        const v415 = sock.on('data', v414);
        v415;
        const v432 = function (err) {
            if (err) {
                const v416 = 'There was an error retrieving the font ' + target;
                const v417 = console.error(v416);
                v417;
            } else {
                let dir;
                const v418 = argv.g;
                const v419 = process.cwd();
                const v420 = v419 + '/Fonts/';
                const v421 = __dirname + '/../Fonts/';
                if (v418) {
                    dir = v420;
                } else {
                    dir = v421;
                }
                const v422 = target.toLowerCase();
                const v423 = dir + v422;
                const v424 = v423 + '.flf';
                const v430 = function (err) {
                    const v428 = function (err, data) {
                        if (err) {
                            const v425 = console.error(err);
                            return v425;
                        }
                        const v426 = target + ' written';
                        const v427 = console.log(v426);
                        v427;
                    };
                    const v429 = ftp.raw('quit', v428);
                    v429;
                };
                const v431 = fs.writeFile(v424, str, v430);
                v431;
            }
        };
        const v433 = sock.on('close', v432);
        v433;
        const v434 = sock.resume();
        v434;
    };
    const v435 = makeURLForDirectory('contributed');
    const v445 = function (err, socket) {
        if (err) {
            const v436 = makeURLForDirectory('international');
            const v442 = function (err2, socket) {
                if (err2) {
                    const v437 = makeURLForDirectory('ours');
                    const v439 = function (err3, socket) {
                        if (err3) {
                            return;
                        }
                        const v438 = handle(socket);
                        v438;
                    };
                    const v440 = ftp.get(v437, v439);
                    return v440;
                }
                const v441 = handle(socket);
                v441;
            };
            const v443 = ftp.get(v436, v442);
            return v443;
        }
        const v444 = handle(socket);
        v444;
    };
    const v446 = ftp.get(v435, v445);
    v446;
    break;
default:
    const v447 = 'unknown action: ' + action;
    const v448 = new Error(v447);
    throw v448;
}