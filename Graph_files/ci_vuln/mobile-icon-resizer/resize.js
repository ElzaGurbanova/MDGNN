const v106 = require('child_process');
var exec = v106.exec;
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var sizeOf = require('image-size');
const v107 = [
    'ios',
    'android'
];
var defaults = {};
defaults.PLATFORMS_TO_BUILD = v107;
defaults.ORIGINAL_ICON_FILE_NAME = 'appicon_1024.png';
defaults.IOS_FILE_NAME_PREFIX = 'Icon';
defaults.IOS_OUTPUT_FOLDER = '.';
defaults.ANDROID_OUTPUT_FOLDER = '.';
defaults.ANDROID_BASE_SIZE = 48;
const getSize = function (str) {
    const v108 = str.split('x');
    const v109 = v108[0];
    const v110 = v109.trim();
    return v110;
};
const getSizeFromRatio = function (options) {
    const v111 = options.ratio;
    var ratio = eval(v111);
    const v112 = options.size;
    const v113 = v112 * ratio;
    const v114 = Math.floor(v113);
    return v114;
};
const executeResize = function (options, callback) {
    const v115 = options.size;
    const v116 = v115 + 'x';
    const v117 = options.size;
    var dimensions = v116 + v117;
    const v118 = options.inputFile;
    const v119 = 'convert "' + v118;
    const v120 = v119 + '" -thumbnail ';
    const v121 = v120 + dimensions;
    const v122 = v121 + ' "';
    const v123 = options.outputFile;
    const v124 = v122 + v123;
    var command = v124 + '"';
    const v131 = function (err, stdout, stderr) {
        if (stderr) {
            const v125 = 'stderr: ' + stderr;
            const v126 = console.log(v125);
            v126;
        }
        const v127 = err !== null;
        if (v127) {
            const v128 = 'exec error: ' + err;
            const v129 = console.log(v128);
            v129;
        }
        const v130 = callback(err);
        v130;
    };
    child = exec(command, v131);
};
const convertiOS = function (options, callback) {
    const v132 = options.config;
    const v133 = v132.iOS;
    var images = v133.images;
    const handleImage = function (image, done) {
        const v134 = image.size;
        var size = getSize(v134);
        const v135 = image.scale;
        var scale = getSize(v135);
        var finalSize = size * scale;
        var baseFolder = options.iosOutputFolder;
        const v136 = mkdirp.sync(baseFolder);
        v136;
        const v137 = options.iosFilenamePrefix;
        const v138 = image.filename;
        const v139 = v137 + v138;
        var fileName = path.join(baseFolder, v139);
        const v140 = options.originalIconFilename;
        const v141 = {
            inputFile: v140,
            size: finalSize,
            outputFile: fileName
        };
        const v143 = function (err) {
            const v142 = done(err);
            v142;
        };
        const v144 = executeResize(v141, v143);
        v144;
    };
    const v146 = function (err) {
        const v145 = callback(err);
        v145;
    };
    const v147 = async.each(images, handleImage, v146);
    v147;
};
const convertAndroid = function (options, callback) {
    const v148 = options.config;
    const v149 = v148.android;
    var images = v149.images;
    const handleImage = function (image, done) {
        var size = 100;
        const v150 = image.baseRatio;
        if (v150) {
            const v151 = options.androidBaseSize;
            const v152 = image.baseRatio;
            const v153 = {
                size: v151,
                ratio: v152
            };
            size = getSizeFromRatio(v153);
        } else {
            const v154 = image.ratio;
            if (v154) {
                const v155 = options.originalSize;
                const v156 = image.ratio;
                const v157 = {
                    size: v155,
                    ratio: v156
                };
                size = getSizeFromRatio(v157);
            } else {
                const v158 = image.size;
                if (v158) {
                    const v159 = image.size;
                    size = getSize(v159);
                } else {
                    const v160 = new Error('No size nor ratio defined for Android icon');
                    const v161 = done(v160);
                    return v161;
                }
            }
        }
        const v162 = options.androidOutputFolder;
        const v163 = image.folder;
        var baseFolder = path.join(v162, v163);
        const v164 = mkdirp.sync(baseFolder);
        v164;
        const v165 = options.androidOutputFilename;
        var fileName = path.join(baseFolder, v165);
        const v166 = options.originalIconFilename;
        const v167 = {
            inputFile: v166,
            size: size,
            outputFile: fileName
        };
        const v169 = function (err) {
            const v168 = done(err);
            v168;
        };
        const v170 = executeResize(v167, v169);
        v170;
    };
    const v172 = function (err) {
        const v171 = callback(err);
        v171;
    };
    const v173 = async.each(images, handleImage, v172);
    v173;
};
var platformConverters = {};
platformConverters['android'] = convertAndroid;
platformConverters['ios'] = convertiOS;
var resize = function (options, callback) {
    const v174 = {};
    options = options || v174;
    const v175 = options.platformsToBuild;
    const v176 = defaults.PLATFORMS_TO_BUILD;
    options.platformsToBuild = v175 || v176;
    const v177 = options.originalIconFilename;
    const v178 = defaults.ORIGINAL_ICON_FILE_NAME;
    options.originalIconFilename = v177 || v178;
    const v179 = options.iosFilenamePrefix;
    const v180 = defaults.IOS_FILE_NAME_PREFIX;
    options.iosFilenamePrefix = v179 || v180;
    const v181 = options.iosOutputFolder;
    const v182 = defaults.IOS_OUTPUT_FOLDER;
    options.iosOutputFolder = v181 || v182;
    const v183 = options.androidOutputFolder;
    const v184 = defaults.ANDROID_OUTPUT_FOLDER;
    options.androidOutputFolder = v183 || v184;
    const v185 = options.androidOutputFilename;
    const v186 = options.originalIconFilename;
    const v187 = path.basename(v186);
    options.androidOutputFilename = v185 || v187;
    const v188 = options.androidBaseSize;
    const v189 = defaults.ANDROID_BASE_SIZE;
    options.androidBaseSize = v188 || v189;
    const v190 = options.originalIconFilename;
    var dimensions = sizeOf(v190);
    const v191 = dimensions.width;
    const v192 = dimensions.height;
    const v193 = Math.max(v191, v192);
    options.originalSize = v193;
    const v194 = options.config;
    const v195 = options.config;
    const v196 = path.resolve(v195);
    const v197 = require(v196);
    const v198 = require('../config');
    let v199;
    if (v194) {
        v199 = v197;
    } else {
        v199 = v198;
    }
    options.config = v199;
    const v200 = options.platformsToBuild;
    const v209 = function (item, done) {
        const v201 = platformConverters[item];
        const v202 = typeof v201;
        const v203 = v202 !== 'function';
        if (v203) {
            const v204 = 'Platform type "' + item;
            const v205 = v204 + '" is not supported.';
            const v206 = new Error(v205);
            const v207 = done(v206);
            return v207;
        }
        const v208 = platformConverters[item](options, done);
        v208;
    };
    const v210 = async.each(v200, v209, callback);
    v210;
};
resize.defaults = defaults;
module.exports = resize;
exports = module.exports;