var path = require('path');
var url = require('url');
var fs = require('fs');
var cluster = require('cluster');
var child = require('child_process');
var exec = child.exec;
var util = require('util');
var shellescape = require('shell-escape');
var mkdirp = require('mkdirp');
const v183 = require('debug');
var debug = v183('clb-branch');
const isValidBranchName = function (branchName) {
    const v184 = branchName.match(/\.\./);
    const v185 = !v184;
    const v186 = branchName && v185;
    return v186;
};
const Branch = function (config) {
    const v187 = config.repository;
    this.repository = v187;
    const v188 = config.destination;
    this.destination = v188;
    const v189 = config.name;
    this.name = v189;
    const v190 = this.name;
    const v191 = isValidBranchName(v190);
    const v192 = !v191;
    if (v192) {
        const v193 = new Error('Invalid branch name');
        throw v193;
    }
};
const v194 = Branch.prototype;
const v279 = function (command, options, callback) {
    var branchName = this.name;
    const v195 = !callback;
    const v196 = typeof options;
    const v197 = v196 === 'function';
    const v198 = v195 && v197;
    if (v198) {
        callback = options;
        options = {};
    }
    const v199 = 30 * 1000;
    const v200 = {
        timeout: v199,
        killSignal: 'SIGTERM'
    };
    options = Object.assign(v200, options);
    const v201 = Array.isArray(command);
    if (v201) {
        const v202 = command[0];
        var file = String(v202);
        const v203 = command.slice(1);
        var args = v203.map(String);
        const v204 = branchName + ' > ';
        const v205 = [file];
        const v206 = v205.concat(args);
        const v207 = v206.join(' ');
        const v208 = v204 + v207;
        const v209 = debug(v208);
        v209;
        const v210 = options.cwd;
        const v211 = options.cwd;
        const v212 = fs.existsSync(v211);
        const v213 = !v212;
        const v214 = v210 && v213;
        if (v214) {
            const v215 = options.cwd;
            const v216 = 'Branch directory ' + v215;
            const v217 = v216 + ' does not exist while trying to run: ';
            const v218 = v217 + file;
            const v219 = v218 + ' ';
            const v220 = args.join(' ');
            const v221 = v219 + v220;
            const v222 = new Error(v221);
            const v223 = callback(v222);
            const v224 = callback && v223;
            return v224;
        }
        const v225 = {};
        const v226 = { shell: false };
        const v227 = Object.assign(v225, options, v226);
        const v244 = function (err, stdout, stderr) {
            const v228 = branchName + ' > ';
            const v229 = stderr || '';
            const v230 = v229.toString();
            const v231 = err || v230;
            const v232 = stdout || '';
            const v233 = v232.toString();
            const v234 = v231 || v233;
            const v235 = v228 + v234;
            const v236 = debug(v235);
            v236;
            if (callback) {
                const v237 = stdout || '';
                const v238 = v237.toString();
                const v239 = v238.replace(/\s/gm, '');
                const v240 = stderr || '';
                const v241 = v240.toString();
                const v242 = v241.replace(/\s/gm, '');
                const v243 = callback(err, v239, v242);
                v243;
            }
        };
        var childProc = child.execFile(file, args, v227, v244);
        return childProc;
    }
    var escapedCommand = command;
    const v245 = branchName + ' > ';
    const v246 = v245 + command;
    const v247 = debug(v246);
    v247;
    const v248 = options.cwd;
    const v249 = options.cwd;
    const v250 = fs.existsSync(v249);
    const v251 = !v250;
    const v252 = v248 && v251;
    if (v252) {
        const v253 = options.cwd;
        const v254 = 'Branch directory ' + v253;
        const v255 = v254 + ' does not exist while trying to run: ';
        const v256 = v255 + command;
        const v257 = new Error(v256);
        const v258 = callback(v257);
        const v259 = callback && v258;
        return v259;
    }
    const v277 = function (err, stdout, stderr) {
        const v260 = branchName + ' > ';
        const v261 = stderr || '';
        const v262 = v261.toString();
        const v263 = err || v262;
        const v264 = stdout || '';
        const v265 = v264.toString();
        const v266 = v263 || v265;
        const v267 = v260 + v266;
        const v268 = debug(v267);
        v268;
        const v269 = stdout || '';
        const v270 = v269.toString();
        const v271 = v270.replace(/\s/gm, '');
        const v272 = stderr || '';
        const v273 = v272.toString();
        const v274 = v273.replace(/\s/gm, '');
        const v275 = callback(err, v271, v274);
        const v276 = callback && v275;
        v276;
    };
    const v278 = exec(escapedCommand, options, v277);
    return v278;
};
v194.exec = v279;
const v280 = Branch.prototype;
const v284 = function () {
    const v281 = this.destination;
    const v282 = this.name;
    const v283 = path.join(v281, v282);
    return v283;
};
v280.getDirectory = v284;
const v285 = Branch.prototype;
const v315 = function (callback, currentProcessUpdate) {
    var branch = this;
    var branchName = this.name;
    var destinationDir = this.getDirectory();
    var repo = this.repository;
    var currentProcess = null;
    const v286 = function noop() {
    };
    currentProcessUpdate = currentProcessUpdate || v286;
    const v313 = function (err, branchExist) {
        const v287 = !branchExist;
        const v288 = err || v287;
        if (v288) {
            const v289 = 'Branch not found ' + branchName;
            const v290 = new Error(v289);
            const v291 = err || v290;
            const v292 = callback(v291);
            return v292;
        }
        const v293 = currentProcessUpdate(null);
        v293;
        const v311 = function (err) {
            const v294 = !err;
            if (v294) {
                const v295 = branch.update(callback);
                return v295;
            }
            const v309 = function (err) {
                if (err) {
                    const v296 = callback(err, destinationDir);
                    return v296;
                }
                const v297 = repo.getDirectory();
                const v298 = [
                    'git',
                    'clone',
                    v297,
                    destinationDir
                ];
                const v307 = function (err) {
                    if (err) {
                        const v299 = callback(err, destinationDir);
                        return v299;
                    }
                    const v300 = branch.name;
                    const v301 = [
                        'git',
                        'checkout',
                        v300
                    ];
                    const v302 = { cwd: destinationDir };
                    const v305 = function (err) {
                        const v303 = currentProcessUpdate(null);
                        v303;
                        const v304 = callback(err, destinationDir);
                        v304;
                    };
                    currentProcess = branch.exec(v301, v302, v305);
                    const v306 = currentProcessUpdate(currentProcess);
                    v306;
                };
                currentProcess = branch.exec(v298, v307);
                const v308 = currentProcessUpdate(currentProcess);
                v308;
            };
            const v310 = mkdirp(destinationDir, v309);
            v310;
        };
        const v312 = fs.stat(destinationDir, v311);
        v312;
    };
    currentProcess = this.exists(v313);
    const v314 = currentProcessUpdate(currentProcess);
    v314;
};
v285.checkout = v315;
const v316 = Branch.prototype;
const v323 = function (callback) {
    var branch = this;
    const v317 = branch.getDirectory();
    const v318 = { cwd: v317 };
    const v321 = function (err) {
        const v319 = branch.getDirectory();
        const v320 = callback(err, v319);
        v320;
    };
    const v322 = branch.exec('git fetch origin; git reset --hard @{u}', v318, v321);
    return v322;
};
v316.update = v323;
const v324 = Branch.prototype;
const v332 = function (callback) {
    var branch = this;
    const v325 = branch.getDirectory();
    const v326 = { cwd: v325 };
    const v330 = function (err, stdout) {
        const v327 = stdout.length;
        const v328 = v327 === 0;
        const v329 = callback(err, v328);
        v329;
    };
    const v331 = branch.exec('git fetch origin > /dev/null; if [ $(git rev-parse @) != $(git rev-parse @{u}) ]; then echo "not up to date"; fi;', v326, v330);
    return v331;
};
v324.isUpToDate = v332;
const v333 = Branch.prototype;
const v339 = function (callback) {
    var branch = this;
    const v334 = this.getDirectory();
    const v335 = { cwd: v334 };
    const v337 = function (err, stdout) {
        const v336 = callback(err, stdout);
        v336;
    };
    const v338 = branch.exec('git rev-parse HEAD', v335, v337);
    return v338;
};
v333.getLastCommit = v339;
const v340 = Branch.prototype;
const v355 = function (sinceCommit, inDirs, callback) {
    var branch = this;
    const v341 = !inDirs;
    const v342 = inDirs.length;
    const v343 = v342 === 0;
    const v344 = v341 || v343;
    if (v344) {
        inDirs = ['.'];
    }
    const v345 = sinceCommit + '..HEAD';
    const v346 = [
        'git',
        'diff',
        '--name-only',
        v345
    ];
    const v347 = v346.concat(inDirs);
    const v348 = this.getDirectory();
    const v349 = { cwd: v348 };
    const v353 = function (err, stdout) {
        const v350 = stdout.length;
        const v351 = v350 > 0;
        const v352 = callback(err, v351);
        v352;
    };
    const v354 = branch.exec(v347, v349, v353);
    return v354;
};
v340.hasChanged = v355;
const v356 = Branch.prototype;
const v364 = function (callback) {
    var branch = this;
    var repo = this.repository;
    const v357 = repo.getDirectory();
    const v358 = branch.name;
    const v359 = [
        'git',
        'ls-remote',
        v357,
        v358
    ];
    const v362 = function (err, stdout) {
        const v360 = stdout.length;
        var branchExist = v360 > 0;
        const v361 = callback(err, branchExist);
        v361;
    };
    const v363 = branch.exec(v359, v362);
    return v363;
};
v356.exists = v364;
module.exports = Branch;