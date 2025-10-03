'use strict';
const path = require('path');
const fs = require('graceful-fs');
const BB = require('bluebird');
const gentleFs = require('gentle-fs');
const v198 = gentleFs.linkIfExists;
const linkIfExists = BB.promisify(v198);
const v199 = gentleFs.binLink;
const gentleFsBinLink = BB.promisify(v199);
const v200 = fs.open;
const open = BB.promisify(v200);
const v201 = fs.close;
const close = BB.promisify(v201);
const v202 = fs.read;
const v203 = { multiArgs: true };
const read = BB.promisify(v202, v203);
const v204 = fs.chmod;
const chmod = BB.promisify(v204);
const v205 = fs.readFile;
const readFile = BB.promisify(v205);
const v206 = require('write-file-atomic');
const writeFileAtomic = BB.promisify(v206);
const normalize = require('npm-normalize-package-bin');
const v207 = BB.promisify(binLinks);
module.exports = v207;
const binLinks = function (pkg, folder, global, opts, cb) {
    pkg = normalize(pkg);
    let parent;
    const v208 = pkg.name;
    const v209 = pkg.name;
    const v210 = v209[0];
    const v211 = v210 === '@';
    const v212 = v208 && v211;
    const v213 = path.dirname(folder);
    const v214 = path.dirname(v213);
    const v215 = path.dirname(folder);
    if (v212) {
        parent = v214;
    } else {
        parent = v215;
    }
    const v216 = opts.globalDir;
    var gnm = global && v216;
    var gtop = parent === gnm;
    const v217 = opts.log;
    const v218 = opts.pkgId;
    const v219 = v217.info('linkStuff', v218);
    v219;
    const v220 = opts.log;
    const v221 = opts.pkgId;
    const v222 = v220.silly('linkStuff', v221, 'has', parent, 'as its parent node_modules');
    v222;
    if (global) {
        const v223 = opts.log;
        const v224 = opts.pkgId;
        const v225 = v223.silly('linkStuff', v224, 'is part of a global install');
        v225;
    }
    if (gnm) {
        const v226 = opts.log;
        const v227 = opts.pkgId;
        const v228 = v226.silly('linkStuff', v227, 'is installed into a global node_modules');
        v228;
    }
    if (gtop) {
        const v229 = opts.log;
        const v230 = opts.pkgId;
        const v231 = v229.silly('linkStuff', v230, 'is installed into the top-level global node_modules');
        v231;
    }
    const v232 = linkBins(pkg, folder, parent, gtop, opts);
    const v233 = linkMans(pkg, folder, parent, gtop, opts);
    const v234 = BB.join(v232, v233);
    const v235 = v234.asCallback(cb);
    return v235;
};
const isHashbangFile = function (file) {
    const v236 = open(file, 'r');
    const v254 = fileHandle => {
        const v237 = Buffer.alloc(2);
        const v238 = read(fileHandle, v237, 0, 2, 0);
        const v244 = (_, buf) => {
            const v239 = hasHashbang(buf);
            const v240 = !v239;
            if (v240) {
                const v241 = [];
                return v241;
            }
            const v242 = Buffer.alloc(2048);
            const v243 = read(fileHandle, v242, 0, 2048, 0);
            return v243;
        };
        const v245 = v238.spread(v244);
        const v248 = (_, buf) => {
            const v246 = hasCR(buf);
            const v247 = buf && v246;
            return v247;
        };
        const v249 = () => {
            return false;
        };
        const v250 = v245.spread(v248, v249);
        const v252 = () => {
            const v251 = close(fileHandle);
            return v251;
        };
        const v253 = v250.finally(v252);
        return v253;
    };
    const v255 = v236.then(v254);
    const v256 = () => {
        return false;
    };
    const v257 = v255.catch(v256);
    return v257;
};
const hasHashbang = function (buf) {
    const str = buf.toString();
    const v258 = str.slice(0, 2);
    const v259 = v258 === '#!';
    return v259;
};
const hasCR = function (buf) {
    const v260 = /^#![^\n]+\r\n/.test(buf);
    return v260;
};
const dos2Unix = function (file) {
    const v261 = readFile(file, 'utf8');
    const v264 = content => {
        const v262 = content.replace(/^(#![^\n]+)\r\n/, '$1\n');
        const v263 = writeFileAtomic(file, v262);
        return v263;
    };
    const v265 = v261.then(v264);
    return v265;
};
const getLinkOpts = function (opts, gently) {
    const v266 = {};
    const v267 = { gently: gently };
    const v268 = Object.assign(v266, opts, v267);
    return v268;
};
const linkBins = function (pkg, folder, parent, gtop, opts) {
    const v269 = pkg.bin;
    const v270 = !v269;
    const v271 = !gtop;
    const v272 = path.basename(parent);
    const v273 = v272 !== 'node_modules';
    const v274 = v271 && v273;
    const v275 = v270 || v274;
    if (v275) {
        return;
    }
    const v276 = gtop && folder;
    var linkOpts = getLinkOpts(opts, v276);
    const v277 = parseInt('0777', 8);
    const v278 = opts.umask;
    const v279 = ~v278;
    var execMode = v277 & v279;
    let binRoot;
    const v280 = opts.globalBin;
    const v281 = path.resolve(parent, '.bin');
    if (gtop) {
        binRoot = v280;
    } else {
        binRoot = v281;
    }
    const v282 = opts.log;
    const v283 = pkg.bin;
    const v284 = [
        v283,
        binRoot,
        gtop
    ];
    const v285 = v282.verbose('linkBins', v284);
    v285;
    const v286 = pkg.bin;
    const v287 = Object.keys(v286);
    const v339 = bin => {
        var dest = path.resolve(binRoot, bin);
        const v288 = pkg.bin;
        const v289 = v288[bin];
        var src = path.resolve(folder, v289);
        const v290 = src.indexOf(folder);
        const v291 = v290 !== 0;
        if (v291) {
            const v292 = pkg._id;
            const v293 = 'invalid bin entry for package ' + v292;
            const v294 = v293 + '. key=';
            const v295 = v294 + bin;
            const v296 = v295 + ', value=';
            const v297 = pkg.bin;
            const v298 = v297[bin];
            const v299 = v296 + v298;
            const v300 = new Error(v299);
            throw v300;
        }
        const v301 = linkBin(src, dest, linkOpts);
        const v303 = () => {
            const v302 = chmod(src, execMode);
            return v302;
        };
        const v304 = v301.then(v303);
        const v306 = () => {
            const v305 = isHashbangFile(src);
            return v305;
        };
        const v307 = v304.then(v306);
        const v312 = isHashbang => {
            const v308 = !isHashbang;
            if (v308) {
                return;
            }
            const v309 = opts.log;
            const v310 = v309.silly('linkBins', 'Converting line endings of hashbang file:', src);
            v310;
            const v311 = dos2Unix(src);
            return v311;
        };
        const v313 = v307.then(v312);
        const v331 = () => {
            const v314 = !gtop;
            if (v314) {
                return;
            }
            var dest = path.resolve(binRoot, bin);
            let out;
            const v315 = opts.parseable;
            const v316 = dest + '::';
            const v317 = v316 + src;
            const v318 = v317 + ':BINFILE';
            const v319 = dest + ' -> ';
            const v320 = v319 + src;
            if (v315) {
                out = v318;
            } else {
                out = v320;
            }
            const v321 = opts.json;
            const v322 = !v321;
            const v323 = opts.parseable;
            const v324 = !v323;
            const v325 = v322 && v324;
            if (v325) {
                const v326 = opts.log;
                const v327 = v326.clearProgress();
                v327;
                const v328 = console.log(out);
                v328;
                const v329 = opts.log;
                const v330 = v329.showProgress();
                v330;
            }
        };
        const v332 = v313.then(v331);
        const v337 = err => {
            const v333 = err.code;
            const v334 = v333 === 'ENOENT';
            const v335 = opts.ignoreScripts;
            const v336 = v334 && v335;
            if (v336) {
                return;
            }
            throw err;
        };
        const v338 = v332.catch(v337);
        return v338;
    };
    const v340 = BB.map(v287, v339);
    return v340;
};
const linkBin = function (from, to, opts) {
    const v341 = opts.globalBin;
    const v342 = opts.globalBin;
    const v343 = to.indexOf(v342);
    const v344 = v343 === 0;
    const v345 = v341 && v344;
    if (v345) {
        opts.clobberLinkGently = true;
    }
    const v346 = gentleFsBinLink(from, to, opts);
    return v346;
};
const linkMans = function (pkg, folder, parent, gtop, opts) {
    const v347 = pkg.man;
    const v348 = !v347;
    const v349 = !gtop;
    const v350 = v348 || v349;
    const v351 = process.platform;
    const v352 = v351 === 'win32';
    const v353 = v350 || v352;
    if (v353) {
        return;
    }
    const v354 = opts.prefix;
    var manRoot = path.resolve(v354, 'share', 'man');
    const v355 = opts.log;
    const v356 = pkg.man;
    const v357 = v355.verbose('linkMans', 'man files are', v356, 'in', manRoot);
    v357;
    const v358 = pkg.man;
    const v364 = function (acc, man) {
        const v359 = typeof man;
        const v360 = v359 !== 'string';
        if (v360) {
            return acc;
        }
        const v361 = path.join('/', man);
        const v362 = v361.replace(/\\|:/g, '/');
        const cleanMan = v362.substr(1);
        const v363 = path.basename(man);
        acc[v363] = cleanMan;
        return acc;
    };
    const v365 = {};
    var set = v358.reduce(v364, v365);
    const v366 = pkg.man;
    const v374 = function (man) {
        const v367 = typeof man;
        const v368 = v367 !== 'string';
        if (v368) {
            return false;
        }
        const v369 = path.join('/', man);
        const v370 = v369.replace(/\\|:/g, '/');
        const cleanMan = v370.substr(1);
        const v371 = path.basename(man);
        const v372 = set[v371];
        const v373 = v372 === cleanMan;
        return v373;
    };
    var manpages = v366.filter(v374);
    const v393 = man => {
        const v375 = opts.log;
        const v376 = v375.silly('linkMans', 'preparing to link', man);
        v376;
        var parseMan = man.match(/(.*\.([0-9]+)(\.gz)?)$/);
        const v377 = !parseMan;
        if (v377) {
            const v378 = man + ' is not a valid name for a man file.  ';
            const v379 = v378 + 'Man files must end with a number, ';
            const v380 = v379 + 'and optionally a .gz suffix if they are compressed.';
            const v381 = new Error(v380);
            throw v381;
        }
        var stem = parseMan[1];
        var sxn = parseMan[2];
        var bn = path.basename(stem);
        var manSrc = path.resolve(folder, man);
        const v382 = manSrc.indexOf(folder);
        const v383 = v382 !== 0;
        if (v383) {
            const v384 = pkg._id;
            const v385 = 'invalid man entry for package ' + v384;
            const v386 = v385 + '. man=';
            const v387 = v386 + manSrc;
            const v388 = new Error(v387);
            throw v388;
        }
        const v389 = 'man' + sxn;
        var manDest = path.join(manRoot, v389, bn);
        opts.clobberLinkGently = true;
        const v390 = gtop && folder;
        const v391 = getLinkOpts(opts, v390);
        const v392 = linkIfExists(manSrc, manDest, v391);
        return v392;
    };
    const v394 = BB.map(manpages, v393);
    return v394;
};