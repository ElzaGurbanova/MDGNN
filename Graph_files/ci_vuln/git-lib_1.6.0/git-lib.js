'use strict';
var Promise = require('promise');
const v172 = require('child_process');
var exec = v172.exec;
var async = require('async');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
const v173 = require('colors');
v173;
const v174 = require('xcept');
v174;
var add = function (files) {
    const v180 = function (resolve, reject) {
        const v175 = 'git add ' + files;
        const v178 = function (err) {
            if (err) {
                const v176 = reject(err);
                v176;
            } else {
                const v177 = resolve();
                v177;
            }
        };
        const v179 = exec(v175, v178);
        v179;
    };
    const v181 = new Promise(v180);
    return v181;
};
var commit = function (message, options) {
    options = options || '';
    const v190 = function (resolve, reject) {
        const v182 = 'git commit ' + options;
        const v183 = v182 + ' -m "';
        const v184 = v183 + message;
        const v185 = v184 + '"';
        const v188 = function (err) {
            if (err) {
                const v186 = reject(err);
                v186;
            } else {
                const v187 = resolve();
                v187;
            }
        };
        const v189 = exec(v185, v188);
        v189;
    };
    const v191 = new Promise(v190);
    return v191;
};
var getCurrentBranch = function () {
    const v198 = function (resolve, reject) {
        const v196 = function (err, result) {
            if (err) {
                const v192 = reject(err);
                v192;
            } else {
                const v193 = result.split('\n');
                const v194 = v193.join('');
                const v195 = resolve(v194);
                v195;
            }
        };
        const v197 = exec('git rev-parse --abbrev-ref HEAD', v196);
        v197;
    };
    const v199 = new Promise(v198);
    return v199;
};
var showFilesAdded = function () {
    const v211 = function (resolve, reject) {
        const v209 = function (err, result) {
            if (err) {
                const v200 = reject(err);
                v200;
            } else {
                var filesAdded = [];
                result = result.split('\n');
                const v205 = function (line) {
                    const v201 = line.indexOf('\t');
                    const v202 = -1;
                    const v203 = v201 > v202;
                    if (v203) {
                        const v204 = filesAdded.push(line);
                        v204;
                    }
                };
                const v206 = result.forEach(v205);
                v206;
                const v207 = filesAdded.join('\n');
                const v208 = resolve(v207);
                v208;
            }
        };
        const v210 = exec('git status', v209);
        v210;
    };
    const v212 = new Promise(v211);
    return v212;
};
var getFilesCached = function () {
    const v218 = function (resolve, reject) {
        const v216 = function (err, result) {
            if (err) {
                const v213 = reject(err);
                v213;
            } else {
                var files = result.split('\n');
                const v214 = files.pop();
                v214;
                const v215 = resolve(files);
                v215;
            }
        };
        const v217 = exec('git diff --name-only --cached', v216);
        v217;
    };
    const v219 = new Promise(v218);
    return v219;
};
var haveFilesToCommit = function () {
    const v230 = function (resolve, reject) {
        const v228 = function (err, result) {
            if (err) {
                const v220 = reject(err);
                v220;
            } else {
                result = result.split('\n');
                const v221 = result.pop();
                v221;
                const v222 = result.pop();
                const v223 = v222.indexOf('nothing to commit');
                const v224 = -1;
                const v225 = v223 > v224;
                if (v225) {
                    const v226 = reject('There are no files to commit');
                    v226;
                } else {
                    const v227 = resolve();
                    v227;
                }
            }
        };
        const v229 = exec('git status', v228);
        v229;
    };
    const v231 = new Promise(v230);
    return v231;
};
var showFilesModified = function () {
    const v237 = function (resolve, reject) {
        const v235 = function (err, result) {
            if (err) {
                const v232 = reject(err);
                v232;
            } else {
                var filesAdded = [];
                result = result.split('\n');
                const v233 = result.pop();
                v233;
                const v234 = resolve(result);
                v234;
            }
        };
        const v236 = exec('git diff --name-only', v235);
        v236;
    };
    const v238 = new Promise(v237);
    return v238;
};
var revert = function (files) {
    const v239 = Array.isArray(files);
    const v240 = [files];
    if (v239) {
        files = files;
    } else {
        files = v240;
    }
    const v251 = function (resolve, reject) {
        const v246 = function (file, next) {
            const v241 = 'git checkout -- ' + file;
            const v244 = function (err) {
                if (err) {
                    const v242 = next(err);
                    v242;
                } else {
                    const v243 = next();
                    v243;
                }
            };
            const v245 = exec(v241, v244);
            v245;
        };
        const v249 = function (err) {
            if (err) {
                const v247 = reject(err);
                v247;
            } else {
                const v248 = resolve();
                v248;
            }
        };
        const v250 = async.each(files, v246, v249);
        v250;
    };
    const v252 = new Promise(v251);
    return v252;
};
var isGit = function () {
    const v259 = function (resolve, reject) {
        const v253 = process.cwd();
        const v254 = path.join(v253, '.git');
        const v257 = function (err, exists) {
            if (err) {
                const v255 = reject('This is not a git repository. Please make sure this is a git repository before you continue');
                v255;
            } else {
                const v256 = resolve(exists);
                v256;
            }
        };
        const v258 = fs.lstat(v254, v257);
        v258;
    };
    const v260 = new Promise(v259);
    return v260;
};
var isGitSync = function () {
    const v261 = process.cwd();
    const v262 = path.join(v261, '.git');
    const v263 = fs.lstatSync(v262);
    let v264;
    if (v263) {
        v264 = true;
    } else {
        v264 = false;
    }
    return v264;
};
const v275 = function (result) {
    var branches = [];
    result = result.split('\n');
    const v265 = result.pop();
    v265;
    const v273 = function (branch) {
        branch = branch.substring(2);
        const v266 = branch.indexOf('remotes');
        const v267 = -1;
        const v268 = v266 > v267;
        if (v268) {
            branch = branch.replace('remotes/', '');
            const v269 = branch.indexOf('/');
            const v270 = v269 + 1;
            branch = branch.substring(v270);
            const v271 = branches.push(branch);
            v271;
        } else {
            const v272 = branches.push(branch);
            v272;
        }
    };
    const v274 = result.forEach(v273);
    v274;
    return branches;
};
const v287 = function (result) {
    var branches = [];
    const v276 = result.split('\n');
    const v285 = function (branch) {
        const v277 = branch.indexOf('refs/heads');
        const v278 = -1;
        const v279 = v277 > v278;
        if (v279) {
            const v280 = branch.replace('refs/heads', '');
            const v281 = branch.indexOf('refs/heads');
            const v282 = v281 + 1;
            const v283 = v280.substring(v282);
            const v284 = branches.push(v283);
            v284;
        }
    };
    const v286 = v276.forEach(v285);
    v286;
    return branches;
};
var parseBranches = {};
parseBranches.all = v275;
parseBranches.local = v287;
const v294 = function () {
    const v292 = function (resolve, reject) {
        const v290 = function (err, result) {
            if (err) {
                const v288 = reject(err);
                v288;
            } else {
                var branches = parseBranches.local(result);
                const v289 = resolve(branches);
                v289;
            }
        };
        const v291 = exec('git show-ref', v290);
        v291;
    };
    const v293 = new Promise(v292);
    return v293;
};
const v301 = function () {
    const v299 = function (resolve, reject) {
        const v297 = function (err, result) {
            if (err) {
                const v295 = reject(err);
                v295;
            } else {
                var branches = parseBranches.all(result);
                branches = _.uniq(branches);
                const v296 = resolve(branches);
                v296;
            }
        };
        const v298 = exec('git branch -a', v297);
        v298;
    };
    const v300 = new Promise(v299);
    return v300;
};
var getBranches = {};
getBranches.local = v294;
getBranches.all = v301;
var checkout = function (branch) {
    const v307 = function (resolve, reject) {
        const v302 = 'git checkout ' + branch;
        const v305 = function (err, result) {
            if (err) {
                const v303 = reject(err);
                v303;
            } else {
                const v304 = resolve(branch);
                v304;
            }
        };
        const v306 = exec(v302, v305);
        v306;
    };
    const v308 = new Promise(v307);
    return v308;
};
var newBranch = function (newBranchName) {
    const v314 = function (resolve, reject) {
        const v309 = 'git checkout -b ' + newBranchName;
        const v312 = function (err) {
            if (err) {
                const v310 = reject(err);
                v310;
            } else {
                const v311 = resolve(newBranchName);
                v311;
            }
        };
        const v313 = exec(v309, v312);
        v313;
    };
    const v315 = new Promise(v314);
    return v315;
};
var deleteBranch = function (branch) {
    const v321 = function (resolve, reject) {
        const v316 = 'git branch -d ' + branch;
        const v319 = function (err) {
            if (err) {
                const v317 = reject(err);
                v317;
            } else {
                const v318 = resolve();
                v318;
            }
        };
        const v320 = exec(v316, v319);
        v320;
    };
    const v322 = new Promise(v321);
    return v322;
};
var deleteBranches = function (branches) {
    const v323 = [];
    const v324 = [];
    var obj = {};
    obj.success = v323;
    obj.failure = v324;
    const v340 = function (resolve) {
        const v336 = function (branch, next) {
            const v325 = deleteBranch(branch);
            const v329 = function () {
                const v326 = obj.success;
                const v327 = v326.push(branch);
                v327;
                const v328 = next();
                v328;
            };
            const v330 = v325.then(v329);
            const v334 = function (err) {
                const v331 = obj.failure;
                const v332 = v331.push(branch);
                v332;
                const v333 = next();
                v333;
            };
            const v335 = v330.catch(v334);
            v335;
        };
        const v338 = function () {
            const v337 = resolve(obj);
            v337;
        };
        const v339 = async.each(branches, v336, v338);
        v339;
    };
    const v341 = new Promise(v340);
    return v341;
};
const v342 = {};
v342.haveFilesToCommit = haveFilesToCommit;
v342.add = add;
v342.getCurrentBranch = getCurrentBranch;
v342.showFilesAdded = showFilesAdded;
v342.showFilesModified = showFilesModified;
v342.commit = commit;
v342.revert = revert;
v342.isGit = isGit;
v342.isGitSync = isGitSync;
v342.getBranches = getBranches;
v342.newBranch = newBranch;
v342.checkout = checkout;
v342.getFilesCached = getFilesCached;
v342.deleteBranch = deleteBranch;
v342.deleteBranches = deleteBranches;
module.exports = v342;