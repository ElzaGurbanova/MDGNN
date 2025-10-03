const v194 = require('es6-promise');
var Promise = v194.Promise;
var path = require('path');
var fs = require('fs');
var util = require('util');
const v195 = require('child-process-promise');
var spawn = v195.spawn;
const PDFImage = function (pdfFilePath, options) {
    const v196 = !options;
    if (v196) {
        options = {};
    }
    this.pdfFilePath = pdfFilePath;
    const v197 = options.pdfFileBaseName;
    const v198 = this.setPdfFileBaseName(v197);
    v198;
    const v199 = options.convertOptions;
    const v200 = this.setConvertOptions(v199);
    v200;
    const v201 = options.convertExtension;
    const v202 = this.setConvertExtension(v201);
    v202;
    const v203 = options.graphicsMagick;
    this.useGM = v203 || false;
    const v204 = options.combinedImage;
    this.combinedImage = v204 || false;
    const v205 = options.outputDirectory;
    const v206 = path.dirname(pdfFilePath);
    this.outputDirectory = v205 || v206;
};
const v210 = function () {
    const v207 = this.pdfFilePath;
    const v208 = [v207];
    const v209 = {};
    v209.cmd = 'pdfinfo';
    v209.args = v208;
    return v209;
};
const v217 = function (output) {
    var info = {};
    const v211 = output.split('\n');
    const v215 = function (line) {
        const v212 = line.match(/^(.*?):[ \t]*(.*)$/);
        if (v212) {
            const v213 = RegExp.$1;
            const v214 = RegExp.$2;
            info[v213] = v214;
        }
    };
    const v216 = v211.forEach(v215);
    v216;
    return info;
};
const v232 = function () {
    var self = this;
    var getInfoCommand = this.constructGetInfoCommand();
    const v230 = function (resolve, reject) {
        const v218 = getInfoCommand.cmd;
        const v219 = getInfoCommand.args;
        const v220 = [
            'stdout',
            'stderr'
        ];
        const v221 = { capture: v220 };
        const v222 = spawn(v218, v219, v221);
        const v227 = function (cmdResult) {
            const v223 = cmdResult.stdout;
            const v224 = v223.toString();
            const v225 = self.parseGetInfoCommandOutput(v224);
            const v226 = resolve(v225);
            v226;
        };
        const v228 = v222.then(v227);
        const v229 = v228.catch(reject);
        v229;
    };
    const v231 = new Promise(v230);
    return v231;
};
const v237 = function () {
    const v233 = this.getInfo();
    const v235 = function (info) {
        const v234 = info['Pages'];
        return v234;
    };
    const v236 = v233.then(v235);
    return v236;
};
const v246 = function (pageNumber) {
    const v238 = this.outputDirectory;
    const v239 = this.pdfFileBaseName;
    const v240 = v239 + '-';
    const v241 = v240 + pageNumber;
    const v242 = v241 + '.';
    const v243 = this.convertExtension;
    const v244 = v242 + v243;
    const v245 = path.join(v238, v244);
    return v245;
};
const v253 = function () {
    const v247 = this.outputDirectory;
    const v248 = this.pdfFileBaseName;
    const v249 = v248 + '.';
    const v250 = this.convertExtension;
    const v251 = v249 + v250;
    const v252 = path.join(v247, v251);
    return v252;
};
const v255 = function (convertOptions) {
    const v254 = {};
    this.convertOptions = convertOptions || v254;
};
const v258 = function (pdfFileBaseName) {
    const v256 = this.pdfFilePath;
    const v257 = path.basename(v256, '.pdf');
    this.pdfFileBaseName = pdfFileBaseName || v257;
};
const v259 = function (convertExtension) {
    this.convertExtension = convertExtension || 'png';
};
const v268 = function (pageNumber) {
    var pdfFilePath = this.pdfFilePath;
    var outputImagePath = this.getOutputImagePathForPage(pageNumber);
    var convertOptions = this.constructConvertOptions();
    var args = [];
    if (convertOptions) {
        args = convertOptions.slice();
    }
    const v260 = pdfFilePath + '[';
    const v261 = v260 + pageNumber;
    const v262 = v261 + ']';
    const v263 = args.push(v262);
    v263;
    const v264 = args.push(outputImagePath);
    v264;
    const v265 = this.useGM;
    let v266;
    if (v265) {
        v266 = 'gm convert';
    } else {
        v266 = 'convert';
    }
    const v267 = {};
    v267.cmd = v266;
    v267.args = args;
    return v267;
};
const v275 = function (imagePaths) {
    var args = imagePaths.slice();
    const v269 = this.getOutputImagePathForFile();
    const v270 = args.push(v269);
    v270;
    const v271 = args.unshift('-append');
    v271;
    const v272 = this.useGM;
    let v273;
    if (v272) {
        v273 = 'gm convert';
    } else {
        v273 = 'convert';
    }
    const v274 = {};
    v274.cmd = v273;
    v274.args = args;
    return v274;
};
const v289 = function () {
    var convertOptions = [];
    const v276 = this.convertOptions;
    const v277 = Object.keys(v276);
    const v278 = v277.sort();
    const v287 = function (optionName) {
        const v279 = this.convertOptions;
        const v280 = v279[optionName];
        const v281 = v280 !== null;
        if (v281) {
            const v282 = convertOptions.push(optionName);
            v282;
            const v283 = this.convertOptions;
            const v284 = v283[optionName];
            const v285 = convertOptions.push(v284);
            v285;
        } else {
            const v286 = convertOptions.push(optionName);
            v286;
        }
    };
    const v288 = v278.map(v287, this);
    v288;
    return convertOptions;
};
const v309 = function (imagePaths) {
    var pdfImage = this;
    var combineCommand = pdfImage.constructCombineCommandForFile(imagePaths);
    const v307 = function (resolve, reject) {
        const v290 = combineCommand.cmd;
        const v291 = combineCommand.args;
        const v292 = [
            'stdout',
            'stderr'
        ];
        const v293 = { capture: v292 };
        const v294 = spawn(v290, v291, v293);
        const v298 = function () {
            const v295 = spawn('rm', imagePaths);
            v295;
            const v296 = pdfImage.getOutputImagePathForFile();
            const v297 = resolve(v296);
            v297;
        };
        const v299 = v294.then(v298);
        const v305 = function (error) {
            const v300 = error.message;
            const v301 = error.stdout;
            const v302 = error.stderr;
            const v303 = {
                message: 'Failed to combine images',
                error: v300,
                stdout: v301,
                stderr: v302
            };
            const v304 = reject(v303);
            v304;
        };
        const v306 = v299.catch(v305);
        v306;
    };
    const v308 = new Promise(v307);
    return v308;
};
const v341 = function () {
    var pdfImage = this;
    const v339 = function (resolve, reject) {
        const v310 = pdfImage.numberOfPages();
        const v337 = function (totalPages) {
            const v325 = function (resolve, reject) {
                var imagePaths = [];
                var i = 0;
                let v311 = i < totalPages;
                while (v311) {
                    const v313 = pdfImage.convertPage(i);
                    const v320 = function (imagePath) {
                        const v314 = imagePaths.push(imagePath);
                        v314;
                        const v315 = imagePaths.length;
                        const v316 = parseInt(totalPages);
                        const v317 = v315 === v316;
                        if (v317) {
                            const v318 = imagePaths.sort();
                            v318;
                            const v319 = resolve(imagePaths);
                            v319;
                        }
                    };
                    const v321 = v313.then(v320);
                    const v323 = function (error) {
                        const v322 = reject(error);
                        v322;
                    };
                    const v324 = v321.catch(v323);
                    v324;
                    const v312 = i++;
                    v311 = i < totalPages;
                }
            };
            var convertPromise = new Promise(v325);
            const v332 = function (imagePaths) {
                const v326 = pdfImage.combinedImage;
                if (v326) {
                    const v327 = pdfImage.combineImages(imagePaths);
                    const v329 = function (imagePath) {
                        const v328 = resolve(imagePath);
                        v328;
                    };
                    const v330 = v327.then(v329);
                    v330;
                } else {
                    const v331 = resolve(imagePaths);
                    v331;
                }
            };
            const v333 = convertPromise.then(v332);
            const v335 = function (error) {
                const v334 = reject(error);
                v334;
            };
            const v336 = v333.catch(v335);
            v336;
        };
        const v338 = v310.then(v337);
        v338;
    };
    const v340 = new Promise(v339);
    return v340;
};
const v385 = function (pageNumber) {
    var pdfFilePath = this.pdfFilePath;
    var outputImagePath = this.getOutputImagePathForPage(pageNumber);
    var convertCommand = this.constructConvertCommandForPage(pageNumber);
    const v384 = function (resolve, reject) {
        const convertPageToImage = function () {
            const v357 = function (resolve, reject) {
                const v342 = convertCommand.cmd;
                const v343 = convertCommand.args;
                const v344 = [
                    'stdout',
                    'stderr'
                ];
                const v345 = { capture: v344 };
                const v346 = spawn(v342, v343, v345);
                const v348 = function () {
                    const v347 = resolve(outputImagePath);
                    v347;
                };
                const v349 = v346.then(v348);
                const v355 = function (error) {
                    const v350 = error.message;
                    const v351 = error.stdout;
                    const v352 = error.stderr;
                    const v353 = {
                        message: 'Failed to convert page to image',
                        error: v350,
                        stdout: v351,
                        stderr: v352
                    };
                    const v354 = reject(v353);
                    v354;
                };
                const v356 = v349.catch(v355);
                v356;
            };
            const v358 = new Promise(v357);
            return v358;
        };
        const v382 = function (err, imageFileStat) {
            const v359 = err.code;
            const v360 = v359 === 'ENOENT';
            var imageNotExists = err && v360;
            const v361 = !imageNotExists;
            const v362 = v361 && err;
            if (v362) {
                const v363 = {
                    message: 'Failed to stat image file',
                    error: err
                };
                const v364 = reject(v363);
                return v364;
            }
            if (imageNotExists) {
                const v365 = convertPageToImage();
                const v367 = function (result) {
                    const v366 = resolve(result);
                    v366;
                };
                const v368 = v365.then(v367);
                const v369 = v368.catch(reject);
                v369;
                return;
            }
            const v380 = function (err, pdfFileStat) {
                if (err) {
                    const v370 = {
                        message: 'Failed to stat PDF file',
                        error: err
                    };
                    const v371 = reject(v370);
                    return v371;
                }
                const v372 = imageFileStat.mtime;
                const v373 = pdfFileStat.mtime;
                const v374 = v372 < v373;
                if (v374) {
                    const v375 = convertPageToImage();
                    const v377 = function (result) {
                        const v376 = resolve(result);
                        v376;
                    };
                    const v378 = v375.then(v377);
                    const v379 = v378.catch(reject);
                    v379;
                }
            };
            const v381 = fs.stat(pdfFilePath, v380);
            v381;
        };
        const v383 = fs.stat(outputImagePath, v382);
        v383;
    };
    var promise = new Promise(v384);
    return promise;
};
const v386 = {};
v386.constructGetInfoCommand = v210;
v386.parseGetInfoCommandOutput = v217;
v386.getInfo = v232;
v386.numberOfPages = v237;
v386.getOutputImagePathForPage = v246;
v386.getOutputImagePathForFile = v253;
v386.setConvertOptions = v255;
v386.setPdfFileBaseName = v258;
v386.setConvertExtension = v259;
v386.constructConvertCommandForPage = v268;
v386.constructCombineCommandForFile = v275;
v386.constructConvertOptions = v289;
v386.combineImages = v309;
v386.convertFile = v341;
v386.convertPage = v385;
PDFImage.prototype = v386;
exports.PDFImage = PDFImage;