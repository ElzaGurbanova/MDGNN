'use strict';
var child_process_1 = require('child_process');
var path = require('path');
var pify = require('pify');
var fs = require('fs');
var mkdirp_1 = require('./wrappers/mkdirp');
var rimraf_1 = require('./wrappers/rimraf');
var unpack_1 = require('./unpack');
const v212 = { value: true };
const v213 = Object.defineProperty(exports, '__esModule', v212);
v213;
exports.default = publish;
const publish = function (packageDir, gitRemoteUrl, options, tagName, tagMessageText, tempDir, packageInfo) {
    const v214 = typeof options;
    const v215 = v214 === 'string';
    if (v215) {
        const v216 = Promise.resolve(options);
        const v217 = Promise.resolve(tagName);
        const v218 = Promise.resolve(tagMessageText);
        const v220 = function (path) {
            const v219 = Promise.resolve(true);
            return v219;
        };
        const v221 = {
            commitTextOp: v216,
            mainTagNameOp: v217,
            tagMessageTextOp: v218,
            prepublishCallback: v220,
            tempDir: tempDir,
            originalPackageInfo: packageInfo
        };
        const v222 = doPublish(packageDir, gitRemoteUrl, v221);
        const v226 = function (result) {
            const v223 = result.conclusion;
            const v224 = publish.PUSHED;
            const v225 = v223 === v224;
            return v225;
        };
        const v227 = v222.then(v226);
        return v227;
    } else {
        const v228 = createParams(packageDir, gitRemoteUrl, options);
        const v230 = function (params) {
            const v229 = doPublish(packageDir, gitRemoteUrl, params);
            return v229;
        };
        const v231 = v228.then(v230);
        return v231;
    }
};
exports.publish = publish;
var publish;
const v232 = function (publish) {
    publish.PUSHED = 'pushed', publish.SKIPPED = 'skipped', publish.CANCELLED = 'cancelled';
};
const v233 = exports.publish;
const v234 = {};
publish = exports.publish || (exports.publish = {});
const v235 = v232(publish);
v235;
const doPublish = function (packageDir, gitRemoteUrl, params) {
    const v236 = fs.writeFile;
    var writeFile = pify(v236);
    const v237 = params.tempDir;
    var gitRepoDir = path.join(v237, 'repo');
    const v238 = params.tempDir;
    var packDir = path.join(v238, 'pack');
    const v239 = params.tempDir;
    var commitTextPath = path.join(v239, 'commitMessage.txt');
    const v240 = params.tempDir;
    var tagTextPath = path.join(v240, 'tagMessage.txt');
    var cleanupOperations = [];
    const v241 = params.tempDir;
    const v242 = { glob: false };
    var initialCleanDone = rimraf_1.default(v241, v242);
    const v244 = function () {
        const v243 = mkdirp_1.default(packDir);
        return v243;
    };
    var directoryReady = initialCleanDone.then(v244);
    const v245 = params.commitTextOp;
    const v246 = [
        v245,
        directoryReady
    ];
    const v247 = Promise.all(v246);
    const v249 = function (_a) {
        var commitText = _a[0];
        const v248 = writeFile(commitTextPath, commitText);
        return v248;
    };
    var commitTextWritten = v247.then(v249);
    const v250 = params.tagMessageTextOp;
    const v251 = [
        v250,
        directoryReady
    ];
    const v252 = Promise.all(v251);
    const v254 = function (_a) {
        var tagMessageText = _a[0];
        const v253 = writeFile(tagTextPath, tagMessageText);
        return v253;
    };
    var tagTextWritten = v252.then(v254);
    var tarballCreated = packPackageIntoTarball();
    var doneCloning = cloneRemoteToTempRepo();
    const v255 = replaceRepoWithPackContents();
    const v256 = v255.then(stageAllRepoChanges);
    const v258 = function () {
        const v257 = params.prepublishCallback(gitRepoDir);
        return v257;
    };
    const v259 = v256.then(v258);
    const v264 = function (shouldContinue) {
        const v260 = finishReleaseAndReturnResult();
        const v261 = publish.CANCELLED;
        const v262 = cleanUpAndReturnChanged(v261);
        let v263;
        if (shouldContinue) {
            v263 = v260;
        } else {
            v263 = v262;
        }
        return v263;
    };
    const v265 = v259.then(v264);
    return v265;
    const finishReleaseAndReturnResult = function () {
        const v266 = stageAllRepoChanges();
        const v267 = v266.then(queryRepoStatus);
        const v271 = function (hasChanges) {
            const v268 = commitChanges();
            const v269 = Promise.resolve();
            let v270;
            if (hasChanges) {
                v270 = v268;
            } else {
                v270 = v269;
            }
            return v270;
        };
        const v272 = v267.then(v271);
        const v273 = v272.then(tagLastCommit);
        const v274 = v273.then(pushDefaultBranch);
        const v277 = function () {
            const v275 = publish.PUSHED;
            const v276 = cleanUpAndReturnChanged(v275);
            return v276;
        };
        const v278 = v274.then(v277);
        return v278;
    };
    const cleanUpAndReturnChanged = function (conclusion) {
        const v279 = params.tempDir;
        const v280 = { glob: false };
        const v281 = rimraf_1.default(v279, v280);
        const v282 = cleanupOperations.push(v281);
        v282;
        const v283 = Promise.all(cleanupOperations);
        const v285 = function () {
            const v284 = {};
            v284.conclusion = conclusion;
            return v284;
        };
        const v286 = v283.then(v285);
        return v286;
    };
    const packPackageIntoTarball = function () {
        const v291 = function () {
            const v287 = 'npm pack "' + packageDir;
            const v288 = v287 + '"';
            const v289 = { cwd: packDir };
            const v290 = exec(v288, v289);
            return v290;
        };
        const v292 = directoryReady.then(v291);
        const v304 = function () {
            const v293 = params.originalPackageInfo;
            const v294 = v293.name;
            const v295 = 'npm cache clean ' + v294;
            const v296 = v295 + '@';
            const v297 = params.originalPackageInfo;
            const v298 = v297.version;
            const v299 = v296 + v298;
            const v300 = exec(v299);
            const v301 = cleanupOperations.push(v300);
            v301;
            const v302 = computeTarballName();
            const v303 = path.join(packDir, v302);
            return v303;
        };
        const v305 = v292.then(v304);
        return v305;
    };
    const computeTarballName = function () {
        const v306 = params.originalPackageInfo;
        var name = v306.name;
        const v307 = name[0];
        const v308 = v307 === '@';
        if (v308) {
            const v309 = name.substr(1);
            name = v309.replace(/\//g, '-');
        }
        const v310 = name + '-';
        const v311 = params.originalPackageInfo;
        const v312 = v311.version;
        const v313 = v310 + v312;
        const v314 = v313 + '.tgz';
        return v314;
    };
    const cloneRemoteToTempRepo = function () {
        const v321 = function () {
            const v315 = 'git clone --quiet --depth 1 ' + gitRemoteUrl;
            const v316 = v315 + ' "';
            const v317 = v316 + gitRepoDir;
            const v318 = v317 + '"';
            const v319 = { stdio: 'inherit' };
            const v320 = child_process_1.execSync(v318, v319);
            v320;
        };
        const v322 = initialCleanDone.then(v321);
        return v322;
    };
    const replaceRepoWithPackContents = function () {
        var cleanPattern = path.join(gitRepoDir, '!(.git)');
        const v323 = {};
        v323.dot = true;
        var cleanOptions = {};
        cleanOptions.glob = v323;
        const v325 = function () {
            const v324 = rimraf_1.default(cleanPattern, cleanOptions);
            return v324;
        };
        var doneCleaning = doneCloning.then(v325);
        const v326 = [
            tarballCreated,
            doneCleaning
        ];
        const v327 = Promise.all(v326);
        const v329 = function (_a) {
            var tarballPath = _a[0];
            const v328 = unpack_1.default(tarballPath, gitRepoDir);
            return v328;
        };
        const v330 = v327.then(v329);
        return v330;
    };
    const stageAllRepoChanges = function () {
        const v331 = { cwd: gitRepoDir };
        const v332 = exec('git add --all', v331);
        return v332;
    };
    const queryRepoStatus = function () {
        const v333 = { cwd: gitRepoDir };
        const v334 = exec('git status --porcelain', v333);
        const v338 = function (statusOutput) {
            const v335 = statusOutput.trim();
            const v336 = v335.length;
            const v337 = v336 !== 0;
            return v337;
        };
        const v339 = v334.then(v338);
        return v339;
    };
    const commitChanges = function () {
        const v340 = 'git commit --file="' + commitTextPath;
        var commitCommandText = v340 + '" --allow-empty-message --no-verify';
        const v343 = function () {
            const v341 = { cwd: gitRepoDir };
            const v342 = exec(commitCommandText, v341);
            return v342;
        };
        const v344 = commitTextWritten.then(v343);
        return v344;
    };
    const tagLastCommit = function () {
        const v345 = params.mainTagNameOp;
        const v346 = [
            v345,
            tagTextWritten
        ];
        const v347 = Promise.all(v346);
        const v369 = function (_a) {
            var tagName = _a[0];
            const v348 = 'git tag -a --file="' + tagTextPath;
            const v349 = v348 + '" "';
            const v350 = v349 + tagName;
            const v351 = v350 + '"';
            const v352 = { cwd: gitRepoDir };
            const v353 = exec(v351, v352);
            const v367 = function () {
                var promises = [];
                const v354 = params.extraBranchNames;
                const v355 = [];
                const v356 = v354 || v355;
                const v364 = function (extraBranchName) {
                    const v357 = 'git branch -f "' + extraBranchName;
                    const v358 = v357 + '" "';
                    const v359 = v358 + tagName;
                    const v360 = v359 + '"';
                    const v361 = { cwd: gitRepoDir };
                    const v362 = exec(v360, v361);
                    const v363 = promises.push(v362);
                    v363;
                };
                const v365 = v356.forEach(v364);
                v365;
                const v366 = Promise.all(promises);
                return v366;
            };
            const v368 = v353.then(v367);
            return v368;
        };
        const v370 = v347.then(v369);
        return v370;
    };
    const pushDefaultBranch = function () {
        const v371 = params.extraBranchNames;
        const v372 = [];
        const v373 = v371 || v372;
        var extraBranchNames = v373.join(' ');
        const v374 = 'git push --follow-tags --force origin HEAD ' + extraBranchNames;
        const v375 = {
            cwd: gitRepoDir,
            stdio: 'inherit'
        };
        const v376 = child_process_1.execSync(v374, v375);
        v376;
    };
};
const readPkg = function (packageDir) {
    const v377 = require('read-pkg');
    const v378 = v377(packageDir);
    return v378;
};
const createParams = function (packageDir, gitRemoteUrl, options) {
    const v379 = {};
    options = options || v379;
    var requestedCommitText = options.commitText;
    var requestedPrepublishCallback = options.prepublishCallback;
    var requestedTagName = options.tagName;
    var requestedTagMessageText = options.tagMessageText;
    var providedTempDirectory = options.tempDir;
    const v380 = options.originalPackageInfo;
    if (v380) {
        const v381 = options.originalPackageInfo;
        const v382 = provideRemainingDefaults(v381);
        const v383 = Promise.resolve(v382);
        return v383;
    } else {
        const v384 = readPkg(packageDir);
        const v385 = v384.then(provideRemainingDefaults);
        return v385;
    }
    const provideRemainingDefaults = function (originalPackageInfo) {
        var prepublishCallback;
        var versionOp;
        const v386 = !requestedPrepublishCallback;
        if (v386) {
            const v388 = function (path) {
                const v387 = Promise.resolve(true);
                return v387;
            };
            prepublishCallback = v388;
            const v389 = originalPackageInfo.version;
            versionOp = Promise.resolve(v389);
        } else {
            var callbackOp_1 = null;
            var setVersionOp_1;
            const v390 = function (resolver) {
                setVersionOp_1 = resolver;
            };
            versionOp = new Promise(v390);
            const v398 = function (tempPackagePath) {
                const v391 = callbackOp_1 === null;
                if (v391) {
                    callbackOp_1 = requestedPrepublishCallback(tempPackagePath);
                    const v393 = function () {
                        const v392 = readPkg(tempPackagePath);
                        return v392;
                    };
                    const v394 = callbackOp_1.then(v393);
                    const v396 = function (updatedPackageInfo) {
                        const v395 = updatedPackageInfo.version;
                        return v395;
                    };
                    var readUpdatedVersionOp = v394.then(v396);
                    const v397 = setVersionOp_1(readUpdatedVersionOp);
                    v397;
                }
                return callbackOp_1;
            };
            prepublishCallback = v398;
        }
        let commitTextOp;
        const v399 = Promise.resolve(requestedCommitText);
        const v401 = function (version) {
            const v400 = 'release: version ' + version;
            return v400;
        };
        const v402 = versionOp.then(v401);
        if (requestedCommitText) {
            commitTextOp = v399;
        } else {
            commitTextOp = v402;
        }
        const v403 = Promise.resolve(requestedTagMessageText);
        let v404;
        if (requestedTagMessageText) {
            v404 = v403;
        } else {
            v404 = commitTextOp;
        }
        const v405 = Promise.resolve(requestedTagName);
        const v407 = function (version) {
            const v406 = 'v' + version;
            return v406;
        };
        const v408 = versionOp.then(v407);
        let v409;
        if (requestedTagName) {
            v409 = v405;
        } else {
            v409 = v408;
        }
        const v410 = options.extraBranchNames;
        const v411 = require('unique-temp-dir');
        const v412 = v411();
        const v413 = providedTempDirectory || v412;
        const v414 = {};
        v414.commitTextOp = commitTextOp;
        v414.tagMessageTextOp = v404;
        v414.mainTagNameOp = v409;
        v414.extraBranchNames = v410;
        v414.prepublishCallback = prepublishCallback;
        v414.tempDir = v413;
        v414.originalPackageInfo = originalPackageInfo;
        return v414;
    };
};
const exec = function (command, options) {
    const v421 = function (resolve, reject) {
        const v419 = function (error, stdout, stderr) {
            if (error) {
                if (stdout) {
                    const v415 = console.log(stdout);
                    v415;
                }
                if (stderr) {
                    const v416 = console.error(stderr);
                    v416;
                }
                const v417 = reject(error);
                v417;
            } else {
                const v418 = resolve(stdout);
                v418;
            }
        };
        const v420 = child_process_1.exec(command, options, v419);
        v420;
    };
    const v422 = new Promise(v421);
    return v422;
};