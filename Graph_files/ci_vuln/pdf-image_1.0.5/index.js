const v155 = require('es6-promise');
var Promise = v155.Promise;
var path = require('path');
var fs = require('fs');
var util = require('util');
const v156 = require('child_process');
var exec = v156.exec;
const PDFImage = function (pdfFilePath, options) {
    const v157 = !options;
    if (v157) {
        options = {};
    }
    this.pdfFilePath = pdfFilePath;
    const v158 = options.pdfFileBaseName;
    const v159 = this.setPdfFileBaseName(v158);
    v159;
    const v160 = options.convertOptions;
    const v161 = this.setConvertOptions(v160);
    v161;
    const v162 = options.convertExtension;
    const v163 = this.setConvertExtension(v162);
    v163;
    const v164 = options.graphicsMagick;
    this.useGM = v164 || false;
    const v165 = options.combinedImage;
    this.combinedImage = v165 || false;
    const v166 = options.outputDirectory;
    const v167 = path.dirname(pdfFilePath);
    this.outputDirectory = v166 || v167;
};
const v170 = function () {
    const v168 = this.pdfFilePath;
    const v169 = util.format('pdfinfo "%s"', v168);
    return v169;
};
const v177 = function (output) {
    var info = {};
    const v171 = output.split('\n');
    const v175 = function (line) {
        const v172 = line.match(/^(.*?):[ \t]*(.*)$/);
        if (v172) {
            const v173 = RegExp.$1;
            const v174 = RegExp.$2;
            info[v173] = v174;
        }
    };
    const v176 = v171.forEach(v175);
    v176;
    return info;
};
const v185 = function () {
    var self = this;
    var getInfoCommand = this.constructGetInfoCommand();
    const v184 = function (resolve, reject) {
        const v182 = function (err, stdout, stderr) {
            if (err) {
                const v178 = {
                    message: 'Failed to get PDF\'S information',
                    error: err,
                    stdout: stdout,
                    stderr: stderr
                };
                const v179 = reject(v178);
                return v179;
            }
            const v180 = self.parseGetInfoCommandOutput(stdout);
            const v181 = resolve(v180);
            return v181;
        };
        const v183 = exec(getInfoCommand, v182);
        v183;
    };
    var promise = new Promise(v184);
    return promise;
};
const v190 = function () {
    const v186 = this.getInfo();
    const v188 = function (info) {
        const v187 = info['Pages'];
        return v187;
    };
    const v189 = v186.then(v188);
    return v189;
};
const v199 = function (pageNumber) {
    const v191 = this.outputDirectory;
    const v192 = this.pdfFileBaseName;
    const v193 = v192 + '-';
    const v194 = v193 + pageNumber;
    const v195 = v194 + '.';
    const v196 = this.convertExtension;
    const v197 = v195 + v196;
    const v198 = path.join(v191, v197);
    return v198;
};
const v206 = function () {
    const v200 = this.outputDirectory;
    const v201 = this.pdfFileBaseName;
    const v202 = v201 + '.';
    const v203 = this.convertExtension;
    const v204 = v202 + v203;
    const v205 = path.join(v200, v204);
    return v205;
};
const v208 = function (convertOptions) {
    const v207 = {};
    this.convertOptions = convertOptions || v207;
};
const v211 = function (pdfFileBaseName) {
    const v209 = this.pdfFilePath;
    const v210 = path.basename(v209, '.pdf');
    this.pdfFileBaseName = pdfFileBaseName || v210;
};
const v212 = function (convertExtension) {
    this.convertExtension = convertExtension || 'png';
};
const v218 = function (pageNumber) {
    var pdfFilePath = this.pdfFilePath;
    var outputImagePath = this.getOutputImagePathForPage(pageNumber);
    var convertOptionsString = this.constructConvertOptions();
    const v213 = this.useGM;
    let v214;
    if (v213) {
        v214 = 'gm convert';
    } else {
        v214 = 'convert';
    }
    const v215 = convertOptionsString + ' ';
    let v216;
    if (convertOptionsString) {
        v216 = v215;
    } else {
        v216 = '';
    }
    const v217 = util.format('%s %s"%s[%d]" "%s"', v214, v216, pdfFilePath, pageNumber, outputImagePath);
    return v217;
};
const v224 = function (imagePaths) {
    const v219 = this.useGM;
    let v220;
    if (v219) {
        v220 = 'gm convert';
    } else {
        v220 = 'convert';
    }
    const v221 = imagePaths.join(' ');
    const v222 = this.getOutputImagePathForFile();
    const v223 = util.format('%s -append %s "%s"', v220, v221, v222);
    return v223;
};
const v238 = function () {
    const v225 = this.convertOptions;
    const v226 = Object.keys(v225);
    const v227 = v226.sort();
    const v235 = function (optionName) {
        const v228 = this.convertOptions;
        const v229 = v228[optionName];
        const v230 = v229 !== null;
        if (v230) {
            const v231 = optionName + ' ';
            const v232 = this.convertOptions;
            const v233 = v232[optionName];
            const v234 = v231 + v233;
            return v234;
        } else {
            return optionName;
        }
    };
    const v236 = v227.map(v235, this);
    const v237 = v236.join(' ');
    return v237;
};
const v250 = function (imagePaths) {
    var pdfImage = this;
    var combineCommand = pdfImage.constructCombineCommandForFile(imagePaths);
    const v248 = function (resolve, reject) {
        const v246 = function (err, stdout, stderr) {
            if (err) {
                const v239 = {
                    message: 'Failed to combine images',
                    error: err,
                    stdout: stdout,
                    stderr: stderr
                };
                const v240 = reject(v239);
                return v240;
            }
            const v241 = imagePaths.join(' ');
            const v242 = 'rm ' + v241;
            const v243 = exec(v242);
            v243;
            const v244 = pdfImage.getOutputImagePathForFile();
            const v245 = resolve(v244);
            return v245;
        };
        const v247 = exec(combineCommand, v246);
        v247;
    };
    const v249 = new Promise(v248);
    return v249;
};
const v282 = function () {
    var pdfImage = this;
    const v280 = function (resolve, reject) {
        const v251 = pdfImage.numberOfPages();
        const v278 = function (totalPages) {
            const v266 = function (resolve, reject) {
                var imagePaths = [];
                var i = 0;
                let v252 = i < totalPages;
                while (v252) {
                    const v254 = pdfImage.convertPage(i);
                    const v261 = function (imagePath) {
                        const v255 = imagePaths.push(imagePath);
                        v255;
                        const v256 = imagePaths.length;
                        const v257 = parseInt(totalPages);
                        const v258 = v256 === v257;
                        if (v258) {
                            const v259 = imagePaths.sort();
                            v259;
                            const v260 = resolve(imagePaths);
                            v260;
                        }
                    };
                    const v262 = v254.then(v261);
                    const v264 = function (error) {
                        const v263 = reject(error);
                        v263;
                    };
                    const v265 = v262.catch(v264);
                    v265;
                    const v253 = i++;
                    v252 = i < totalPages;
                }
            };
            var convertPromise = new Promise(v266);
            const v273 = function (imagePaths) {
                const v267 = pdfImage.combinedImage;
                if (v267) {
                    const v268 = pdfImage.combineImages(imagePaths);
                    const v270 = function (imagePath) {
                        const v269 = resolve(imagePath);
                        v269;
                    };
                    const v271 = v268.then(v270);
                    v271;
                } else {
                    const v272 = resolve(imagePaths);
                    v272;
                }
            };
            const v274 = convertPromise.then(v273);
            const v276 = function (error) {
                const v275 = reject(error);
                v275;
            };
            const v277 = v274.catch(v276);
            v277;
        };
        const v279 = v251.then(v278);
        v279;
    };
    const v281 = new Promise(v280);
    return v281;
};
const v307 = function (pageNumber) {
    var pdfFilePath = this.pdfFilePath;
    var outputImagePath = this.getOutputImagePathForPage(pageNumber);
    var convertCommand = this.constructConvertCommandForPage(pageNumber);
    const v306 = function (resolve, reject) {
        const convertPageToImage = function () {
            const v286 = function (err, stdout, stderr) {
                if (err) {
                    const v283 = {
                        message: 'Failed to convert page to image',
                        error: err,
                        stdout: stdout,
                        stderr: stderr
                    };
                    const v284 = reject(v283);
                    return v284;
                }
                const v285 = resolve(outputImagePath);
                return v285;
            };
            const v287 = exec(convertCommand, v286);
            v287;
        };
        const v304 = function (err, imageFileStat) {
            const v288 = err.code;
            const v289 = v288 === 'ENOENT';
            var imageNotExists = err && v289;
            const v290 = !imageNotExists;
            const v291 = v290 && err;
            if (v291) {
                const v292 = {
                    message: 'Failed to stat image file',
                    error: err
                };
                const v293 = reject(v292);
                return v293;
            }
            if (imageNotExists) {
                const v294 = convertPageToImage();
                v294;
                return;
            }
            const v302 = function (err, pdfFileStat) {
                if (err) {
                    const v295 = {
                        message: 'Failed to stat PDF file',
                        error: err
                    };
                    const v296 = reject(v295);
                    return v296;
                }
                const v297 = imageFileStat.mtime;
                const v298 = pdfFileStat.mtime;
                const v299 = v297 < v298;
                if (v299) {
                    const v300 = convertPageToImage();
                    v300;
                    return;
                }
                const v301 = resolve(outputImagePath);
                return v301;
            };
            const v303 = fs.stat(pdfFilePath, v302);
            v303;
        };
        const v305 = fs.stat(outputImagePath, v304);
        v305;
    };
    var promise = new Promise(v306);
    return promise;
};
const v308 = {};
v308.constructGetInfoCommand = v170;
v308.parseGetInfoCommandOutput = v177;
v308.getInfo = v185;
v308.numberOfPages = v190;
v308.getOutputImagePathForPage = v199;
v308.getOutputImagePathForFile = v206;
v308.setConvertOptions = v208;
v308.setPdfFileBaseName = v211;
v308.setConvertExtension = v212;
v308.constructConvertCommandForPage = v218;
v308.constructCombineCommandForFile = v224;
v308.constructConvertOptions = v238;
v308.combineImages = v250;
v308.convertFile = v282;
v308.convertPage = v307;
PDFImage.prototype = v308;
exports.PDFImage = PDFImage;