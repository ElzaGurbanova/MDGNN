'use strict';
const Promise = require('bluebird');
const v154 = require('child_process');
const exec = v154.exec;
const v155 = require('util');
const printf = v155.format;
const stream = require('stream');
const Readable = stream.Readable;
const ImageMagickCommands = require('./commands');
const v156 = require('debug');
const debug = v156('imagickal');
let globalOpts = {};
const v157 = {};
v157.type = Number;
v157.value = '%w';
const v158 = {};
v158.type = Number;
v158.value = '%h';
const identifyFormatDefaults = {};
identifyFormatDefaults.format = '%m';
identifyFormatDefaults.width = v157;
identifyFormatDefaults.height = v158;
const parseOutput = function (output) {
    let matches;
    let data;
    let json;
    let images = 0;
    const regx = /(\{[^\}]+\})/g;
    let v159 = (matches = regx.exec(output)) !== null;
    while (v159) {
        const v160 = !data;
        if (v160) {
            data = matches[1];
        }
        const v161 = images++;
        v161;
        v159 = (matches = regx.exec(output)) !== null;
    }
    const v162 = !data;
    if (v162) {
        const v163 = new Error();
        throw v163;
    }
    try {
        json = JSON.parse(data);
        const v164 = typeof json;
        const v165 = v164 !== 'object';
        if (v165) {
            const v166 = new Error();
            throw v166;
        }
    } catch (e) {
        const v167 = new Error();
        throw v167;
    }
    json.images = images;
    return json;
};
const v191 = function (path, callback) {
    const v168 = path instanceof Readable;
    let v169;
    if (v168) {
        v169 = '-';
    } else {
        v169 = path;
    }
    const cmd = 'identify -format "{\\"width\\":%w,\\"height\\":%h}" ' + v169;
    const v189 = (resolve, reject) => {
        const v170 = debug('dimensions', cmd);
        v170;
        const v171 = ['pipe'];
        const v172 = { stdio: v171 };
        const v173 = globalOpts.execOptions;
        const v174 = {};
        const v175 = v173 || v174;
        const v176 = Object.assign(v172, v175);
        const v185 = (err, stdout) => {
            if (err) {
                const v177 = reject(err);
                return v177;
            }
            try {
                const v178 = stdout.toString();
                const v179 = parseOutput(v178);
                const v180 = resolve(v179);
                v180;
            } catch (e) {
                const v181 = stdout.toString();
                const v182 = 'Unable to parse dimensions from output: ' + v181;
                const v183 = new Error(v182);
                const v184 = reject(v183);
                return v184;
            }
        };
        const shell = exec(cmd, v176, v185);
        const v186 = path instanceof Readable;
        if (v186) {
            const v187 = shell.stdin;
            const v188 = path.pipe(v187);
            v188;
        }
    };
    const promise = new Promise(v189);
    const v190 = promise.asCallback(callback);
    return v190;
};
exports.dimensions = v191;
const v237 = function (path, options = {}, callback) {
    const v192 = typeof options;
    const v193 = v192 === 'function';
    if (v193) {
        callback = options;
        options = {};
    }
    const v194 = {};
    const v195 = options.format;
    const v196 = Object.assign(v194, identifyFormatDefaults, v195);
    const v197 = stringifyIdentifyFormat(v196);
    const v198 = options.verifyImage;
    let v199;
    if (v198) {
        v199 = '-verbose ';
    } else {
        v199 = '';
    }
    const v200 = path instanceof Readable;
    let v201;
    if (v200) {
        v201 = '-';
    } else {
        v201 = path;
    }
    const cmd = printf('identify -format "%s" %s%s', v197, v199, v201);
    const v202 = debug('identify', cmd);
    v202;
    const v235 = (resolve, reject) => {
        const v203 = ['pipe'];
        const v204 = { stdio: v203 };
        const v205 = globalOpts.execOptions;
        const v206 = {};
        const v207 = v205 || v206;
        const v208 = Object.assign(v204, v207);
        const v231 = (err, stdout) => {
            if (err) {
                const v209 = err.message;
                const v210 = v209.match(/decode delegate/);
                if (v210) {
                    const v211 = new Error('Invalid image file');
                    const v212 = reject(v211);
                    return v212;
                }
                const v213 = reject(err);
                return v213;
            }
            let data;
            try {
                const v214 = stdout.toString();
                data = parseOutput(v214);
                const v215 = data.format;
                const v216 = v215.toLowerCase();
                data.format = v216;
                const v217 = data.format;
                const v218 = v217 === 'jpeg';
                const v219 = data.format;
                let v220;
                if (v218) {
                    v220 = 'jpg';
                } else {
                    v220 = v219;
                }
                data.format = v220;
            } catch (e) {
                const v221 = stdout.toString();
                const v222 = 'Unable to parse identify data, output was:' + v221;
                const v223 = new Error(v222);
                const v224 = reject(v223);
                return v224;
            }
            const v225 = !data;
            if (v225) {
                const v226 = stdout.toString();
                const v227 = 'Unable to identify image, output was:' + v226;
                const v228 = new Error(v227);
                const v229 = reject(v228);
                return v229;
            }
            const v230 = resolve(data);
            v230;
        };
        const shell = exec(cmd, v208, v231);
        const v232 = path instanceof Readable;
        if (v232) {
            const v233 = shell.stdin;
            const v234 = path.pipe(v233);
            v234;
        }
    };
    const promise = new Promise(v235);
    const v236 = promise.asCallback(callback);
    return v236;
};
exports.identify = v237;
const stringifyIdentifyFormat = function (format) {
    const v238 = Object.keys(format);
    const v247 = (acc, key) => {
        const val = format[key];
        let strValue;
        const v239 = typeof val;
        const v240 = v239 === 'object';
        const v241 = val.type;
        const v242 = v241 === Number;
        const v243 = v240 && v242;
        const v244 = val.value;
        if (v243) {
            strValue = v244;
        } else {
            strValue = `\\"${ val }\\"`;
        }
        const v245 = `\\"${ key }\\":${ strValue }`;
        const v246 = acc.push(v245);
        v246;
        return acc;
    };
    const v248 = [];
    const strings = v238.reduce(v247, v248);
    const v249 = strings.join(',');
    const v250 = `{${ v249 }}`;
    return v250;
};
const v253 = function (opts) {
    const v251 = opts || globalOpts;
    const v252 = new ImageMagickCommands(v251);
    return v252;
};
exports.commands = v253;
const commands = exports.commands;
const invalidActions = [
    'get',
    'exec'
];
const applyActions = function (actions) {
    const cmds = commands();
    const v254 = Object.keys(actions);
    const v264 = action => {
        const v255 = invalidActions.indexOf(action);
        const v256 = -1;
        const v257 = v255 === v256;
        const v258 = cmds[action];
        const v259 = typeof v258;
        const v260 = v259 === 'function';
        const v261 = v257 && v260;
        if (v261) {
            const v262 = actions[action];
            const v263 = cmds[action](v262);
            v263;
        }
    };
    const v265 = v254.forEach(v264);
    v265;
    return cmds;
};
const calculateNewDimensions = function (actions) {
    const v266 = actions.resize;
    const v267 = actions.resize;
    const v268 = v267.width;
    const v269 = v266 && v268;
    const v270 = actions.resize;
    const v271 = v270.height;
    const v272 = v269 && v271;
    if (v272) {
        const v273 = actions.resize;
        const v274 = v273.width;
        const v275 = actions.resize;
        const v276 = v275.height;
        const v277 = {};
        v277.width = v274;
        v277.height = v276;
        return v277;
    }
    const v278 = actions.resize;
    const v279 = actions.resize;
    const v280 = v279.width;
    const v281 = v278 && v280;
    if (v281) {
        const v282 = actions.resize;
        const v283 = v282.width;
        const v284 = {};
        v284.width = v283;
        return v284;
    }
    const v285 = actions.resize;
    const v286 = actions.resize;
    const v287 = v286.height;
    const v288 = v285 && v287;
    if (v288) {
        const v289 = actions.height;
        const v290 = {};
        v290.height = v289;
        return v290;
    }
    return false;
};
const v305 = function (src, dst, actions, opts, callback) {
    const v291 = actions.sharpen;
    const v292 = actions.sharpen;
    const v293 = v292.mode;
    const v294 = v293 === 'variable';
    const v295 = v291 && v294;
    if (v295) {
        const newDim = calculateNewDimensions(actions);
        if (newDim) {
            const v296 = JSON.stringify(actions);
            const moddedActions = JSON.parse(v296);
            const v297 = moddedActions.sharpen;
            const v298 = newDim.width;
            v297.width = v298;
            const v299 = moddedActions.sharpen;
            const v300 = newDim.height;
            v299.height = v300;
            const v301 = applyActions(moddedActions);
            const v302 = v301.exec(src, dst, opts, callback);
            return v302;
        }
    }
    const v303 = applyActions(actions);
    const v304 = v303.exec(src, dst, opts, callback);
    return v304;
};
exports.transform = v305;
const v306 = function (opts) {
    globalOpts = opts;
};
exports.setDefaults = v306;