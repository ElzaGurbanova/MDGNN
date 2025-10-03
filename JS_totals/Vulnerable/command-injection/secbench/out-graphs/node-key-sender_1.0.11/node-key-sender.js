const v138 = require('child_process');
var exec = v138.exec;
var path = require('path');
const v273 = function () {
    var module = {};
    var batch = [];
    var options = {};
    options['startDelayMillisec'] = null;
    options['caseCorrection'] = null;
    options['globalDelayPressMillisec'] = null;
    options['globalDelayBetweenMillisec'] = null;
    options['extra'] = null;
    module.BATCH_EVENT_KEY_PRESS = 1;
    module.BATCH_EVENT_KEY_UP = 2;
    module.BATCH_EVENT_KEY_DOWN = 3;
    var keyboardLayout = {};
    keyboardLayout['+'] = 'add';
    keyboardLayout['-'] = 'subtract';
    keyboardLayout[' '] = 'space';
    keyboardLayout['&'] = 'shift-ampersand';
    keyboardLayout['*'] = 'shift-asterisk';
    keyboardLayout['@'] = 'shift-at';
    keyboardLayout['`'] = 'shift-back_quote space';
    keyboardLayout['~'] = '@514 space';
    keyboardLayout['^'] = 'shift-circumflex space';
    keyboardLayout['\\'] = 'back_slash';
    keyboardLayout['/'] = 'slash';
    keyboardLayout['{'] = 'shift-braceleft';
    keyboardLayout['}'] = 'shift-braceright';
    keyboardLayout['['] = 'open_bracket';
    keyboardLayout[']'] = 'close_bracket';
    keyboardLayout[':'] = 'shift-colon';
    keyboardLayout[';'] = 'semicolon';
    keyboardLayout[','] = 'comma';
    keyboardLayout['$'] = 'shift-dollar';
    keyboardLayout['\u20AC'] = 'alt_gr-euro_sign';
    keyboardLayout['='] = 'equals';
    keyboardLayout['!'] = 'shift-exclamation_mark';
    keyboardLayout['('] = 'shift-left_parenthesis';
    keyboardLayout[')'] = 'shift-right_parenthesis';
    keyboardLayout['#'] = 'shift-number_sign';
    keyboardLayout['.'] = 'period';
    keyboardLayout['\''] = 'quote';
    keyboardLayout['"'] = 'shift-quotedbl';
    keyboardLayout['_'] = 'shift-underscore';
    keyboardLayout['|'] = 'shift-@92';
    keyboardLayout['?'] = 'shift-@47';
    const v141 = function (keyCode) {
        const v139 = [keyCode];
        const v140 = module.execute(v139);
        return v140;
    };
    module.sendKey = v141;
    const v143 = function (arrKeyCodes) {
        const v142 = module.execute(arrKeyCodes);
        return v142;
    };
    module.sendKeys = v143;
    const v146 = function (letter) {
        const v144 = module.getKeyCode(letter);
        const v145 = module.sendKey(v144);
        return v145;
    };
    module.sendLetter = v146;
    const v154 = function (arrLetters) {
        var arrKeyCodes = [];
        var i = 0;
        const v147 = arrLetters.length;
        let v148 = i < v147;
        while (v148) {
            const v150 = arrLetters[i];
            const v151 = module.getKeyCode(v150);
            const v152 = arrKeyCodes.push(v151);
            v152;
            const v149 = i++;
            v148 = i < v147;
        }
        const v153 = module.sendKey(arrKeyCodes);
        return v153;
    };
    module.sendLetters = v154;
    const v159 = function (text) {
        var keyCodes = [];
        var i = 0;
        var len = text.length;
        let v155 = i < len;
        while (v155) {
            var currentKey = text[i];
            var keyCode = module.getKeyCode(currentKey);
            const v157 = keyCodes.push(keyCode);
            v157;
            const v156 = i++;
            v155 = i < len;
        }
        const v158 = module.execute(keyCodes);
        return v158;
    };
    module.sendText = v159;
    const v163 = function (letter) {
        var keyCode = letter;
        const v160 = keyboardLayout[letter];
        const v161 = typeof v160;
        const v162 = v161 !== 'undefined';
        if (v162) {
            keyCode = keyboardLayout[letter];
        }
        return keyCode;
    };
    module.getKeyCode = v163;
    const v167 = function (arrKeyCodes) {
        const v164 = arrKeyCodes.join('-');
        const v165 = [v164];
        const v166 = module.execute(v165);
        return v166;
    };
    module.sendCombination = v167;
    const v181 = function (arrParams) {
        const v179 = function (resolve, reject) {
            var jarPath = path.join(__dirname, 'jar', 'key-sender.jar');
            const v168 = 'java -jar "' + jarPath;
            const v169 = v168 + '" ';
            const v170 = arrParams.join(' ');
            const v171 = v169 + v170;
            const v172 = module.getCommandLineOptions();
            var command = v171 + v172;
            const v173 = {};
            const v177 = function (error, stdout, stderr) {
                const v174 = error == null;
                if (v174) {
                    const v175 = resolve(stdout, stderr);
                    v175;
                } else {
                    const v176 = reject(error, stdout, stderr);
                    v176;
                }
            };
            const v178 = exec(command, v173, v177);
            return v178;
        };
        const v180 = new Promise(v179);
        return v180;
    };
    module.execute = v181;
    const v223 = function () {
        var arguments = '';
        const v182 = options.startDelayMillisec;
        const v183 = typeof v182;
        const v184 = v183 !== 'undefined';
        const v185 = options.startDelayMillisec;
        const v186 = v185 != null;
        const v187 = v184 && v186;
        if (v187) {
            const v188 = arguments + ' -sd ';
            const v189 = options.startDelayMillisec;
            arguments = v188 + v189;
        }
        const v190 = options.caseCorrection;
        const v191 = typeof v190;
        const v192 = v191 !== 'undefined';
        const v193 = options.caseCorrection;
        const v194 = v193 != null;
        const v195 = v192 && v194;
        if (v195) {
            const v196 = arguments + ' -c ';
            const v197 = options.caseCorrection;
            let v198;
            if (v197) {
                v198 = '1';
            } else {
                v198 = '0';
            }
            arguments = v196 + v198;
        }
        const v199 = options.globalDelayPressMillisec;
        const v200 = typeof v199;
        const v201 = v200 !== 'undefined';
        const v202 = options.globalDelayPressMillisec;
        const v203 = v202 != null;
        const v204 = v201 && v203;
        if (v204) {
            const v205 = arguments + ' -pd ';
            const v206 = options.globalDelayPressMillisec;
            arguments = v205 + v206;
        }
        const v207 = options.globalDelayBetweenMillisec;
        const v208 = typeof v207;
        const v209 = v208 !== 'undefined';
        const v210 = options.globalDelayBetweenMillisec;
        const v211 = v210 != null;
        const v212 = v209 && v211;
        if (v212) {
            const v213 = arguments + ' -d ';
            const v214 = options.globalDelayBetweenMillisec;
            arguments = v213 + v214;
        }
        const v215 = options.extra;
        const v216 = typeof v215;
        const v217 = v216 !== 'undefined';
        const v218 = options.extra;
        const v219 = v218 != null;
        const v220 = v217 && v219;
        if (v220) {
            const v221 = arguments + ' ';
            const v222 = options.extra;
            arguments = v221 + v222;
        }
        return arguments;
    };
    module.getCommandLineOptions = v223;
    const v224 = function () {
        keyboardLayout = {};
    };
    module.cleanKeyboardLayout = v224;
    const v225 = function (newKeyMap) {
        keyboardLayout = newKeyMap;
    };
    module.setKeyboardLayout = v225;
    const v226 = function (objKeyMap) {
        keyboardLayout = Object.assign(keyboardLayout, objKeyMap);
    };
    module.aggregateKeyboardLayout = v226;
    const v227 = function () {
        return keyboardLayout;
    };
    module.getKeyboardLayout = v227;
    const v228 = function () {
        batch = [];
        return module;
    };
    module.startBatch = v228;
    const v234 = function (keyCode, waitMillisec, batchEvent) {
        const v229 = typeof waitMillisec;
        const v230 = v229 == 'undefined';
        if (v230) {
            waitMillisec = 0;
        }
        const v231 = typeof batchEvent;
        const v232 = v231 == 'undefined';
        if (v232) {
            batchEvent = module.BATCH_EVENT_KEY_PRESS;
        }
        var param = {};
        param['combination'] = null;
        param['keyCode'] = keyCode;
        param['wait'] = waitMillisec;
        param['event'] = batchEvent;
        const v233 = batch.push(param);
        v233;
        return this;
    };
    module.batchTypeKey = v234;
    const v240 = function (arrKeys, waitMillisec, batchEvent) {
        const v235 = typeof waitMillisec;
        const v236 = v235 == 'undefined';
        if (v236) {
            waitMillisec = 0;
        }
        const v237 = typeof batchEvent;
        const v238 = v237 == 'undefined';
        if (v238) {
            batchEvent = module.BATCH_EVENT_KEY_PRESS;
        }
        var param = {};
        param['combination'] = arrKeys;
        param['keyCode'] = null;
        param['wait'] = waitMillisec;
        param['event'] = batchEvent;
        const v239 = batch.push(param);
        v239;
        return this;
    };
    module.batchTypeCombination = v240;
    const v247 = function (arrKeyCodes) {
        var i = 0;
        const v241 = arrKeyCodes.length;
        let v242 = i < v241;
        while (v242) {
            const v244 = arrKeyCodes[i];
            const v245 = module.BATCH_EVENT_KEY_PRESS;
            var param = {};
            param['combination'] = null;
            param['keyCode'] = v244;
            param['wait'] = 0;
            param['event'] = v245;
            const v246 = batch.push(param);
            v246;
            const v243 = i++;
            v242 = i < v241;
        }
        return this;
    };
    module.batchTypeKeys = v247;
    const v252 = function (text) {
        var arrKeyCodes = [];
        var i = 0;
        var len = text.length;
        let v248 = i < len;
        while (v248) {
            var currentKey = text[i];
            var keyCode = module.getKeyCode(currentKey);
            const v250 = arrKeyCodes.push(keyCode);
            v250;
            const v249 = i++;
            v248 = i < len;
        }
        const v251 = module.batchTypeKeys(arrKeyCodes);
        v251;
        return this;
    };
    module.batchTypeText = v252;
    const v270 = function () {
        var arrArguments = [];
        var i = 0;
        const v253 = batch.length;
        let v254 = i < v253;
        while (v254) {
            var param = batch[i];
            const v256 = param.combination;
            var isCombination = v256 != null;
            var argument = '';
            if (isCombination) {
                const v257 = param.combination;
                argument = v257.join('-');
            } else {
                argument = param.keyCode;
            }
            const v258 = param.wait;
            const v259 = v258 > 0;
            if (v259) {
                const v260 = argument + '.w';
                const v261 = param.wait;
                argument = v260 + v261;
            }
            const v262 = param.event;
            const v263 = module.BATCH_EVENT_KEY_UP;
            const v264 = v262 == v263;
            if (v264) {
                argument = argument + '.up';
            }
            const v265 = param.event;
            const v266 = module.BATCH_EVENT_KEY_DOWN;
            const v267 = v265 == v266;
            if (v267) {
                argument = argument + '.down';
            }
            const v268 = arrArguments.push(argument);
            v268;
            const v255 = i++;
            v254 = i < v253;
        }
        const v269 = module.execute(arrArguments);
        return v269;
    };
    module.sendBatch = v270;
    const v271 = function (optionName, optionValue) {
        options[optionName] = optionValue;
        return module;
    };
    module.setOption = v271;
    const v272 = function () {
        return options;
    };
    module.getOptions = v272;
    return module;
};
const v274 = v273();
module.exports = v274;