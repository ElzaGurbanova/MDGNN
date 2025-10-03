let json;
const v171 = typeof JSON;
const v172 = v171 !== undefined;
const v173 = require('jsonify');
if (v172) {
    json = JSON;
} else {
    json = v173;
}
var map = require('array-map');
var filter = require('array-filter');
var reduce = require('array-reduce');
const v195 = function (xs) {
    const v192 = function (s) {
        const v174 = typeof s;
        const v175 = v174 === 'object';
        const v176 = s && v175;
        if (v176) {
            const v177 = s.op;
            const v178 = v177.replace(/(.)/g, '\\$1');
            return v178;
        } else {
            const v179 = /["\s]/.test(s);
            const v180 = /'/.test(s);
            const v181 = !v180;
            const v182 = v179 && v181;
            if (v182) {
                const v183 = s.replace(/(['\\])/g, '\\$1');
                const v184 = '\'' + v183;
                const v185 = v184 + '\'';
                return v185;
            } else {
                const v186 = /["'\s]/.test(s);
                if (v186) {
                    const v187 = s.replace(/(["\\$`!])/g, '\\$1');
                    const v188 = '"' + v187;
                    const v189 = v188 + '"';
                    return v189;
                } else {
                    const v190 = String(s);
                    const v191 = v190.replace(/([\\$`()!#&*|])/g, '\\$1');
                    return v191;
                }
            }
        }
    };
    const v193 = map(xs, v192);
    const v194 = v193.join(' ');
    return v194;
};
exports.quote = v195;
const v196 = [
    '\\|\\|',
    '\\&\\&',
    ';;',
    '\\|\\&',
    '[&;()|<>]'
];
const v197 = v196.join('|');
const v198 = '(?:' + v197;
var CONTROL = v198 + ')';
var META = '|&;()<> \\t';
const v199 = '(\\\\[\'"' + META;
const v200 = v199 + ']|[^\\s\'"';
const v201 = v200 + META;
var BAREWORD = v201 + '])+';
var SINGLE_QUOTE = '"((\\\\"|[^"])*?)"';
var DOUBLE_QUOTE = '\'((\\\\\'|[^\'])*?)\'';
var TOKEN = '';
var i = 0;
let v202 = i < 4;
while (v202) {
    const v204 = Math.pow(16, 8);
    const v205 = Math.random();
    const v206 = v204 * v205;
    TOKEN += v206.toString(16);
    const v203 = i++;
    v202 = i < 4;
}
const v234 = function (s, env, opts) {
    var mapped = parse(s, env, opts);
    const v207 = typeof env;
    const v208 = v207 !== 'function';
    if (v208) {
        return mapped;
    }
    const v231 = function (acc, s) {
        const v209 = typeof s;
        const v210 = v209 === 'object';
        if (v210) {
            const v211 = acc.concat(s);
            return v211;
        }
        const v212 = '(' + TOKEN;
        const v213 = v212 + '.*?';
        const v214 = v213 + TOKEN;
        const v215 = v214 + ')';
        const v216 = RegExp(v215, 'g');
        var xs = s.split(v216);
        const v217 = xs.length;
        const v218 = v217 === 1;
        if (v218) {
            const v219 = xs[0];
            const v220 = acc.concat(v219);
            return v220;
        }
        const v221 = filter(xs, Boolean);
        const v228 = function (x) {
            const v222 = '^' + TOKEN;
            const v223 = RegExp(v222);
            const v224 = v223.test(x);
            if (v224) {
                const v225 = x.split(TOKEN);
                const v226 = v225[1];
                const v227 = json.parse(v226);
                return v227;
            } else {
                return x;
            }
        };
        const v229 = map(v221, v228);
        const v230 = acc.concat(v229);
        return v230;
    };
    const v232 = [];
    const v233 = reduce(mapped, v231, v232);
    return v233;
};
exports.parse = v234;
const parse = function (s, env, opts) {
    const v235 = '(' + CONTROL;
    const v236 = v235 + ')';
    const v237 = '(' + BAREWORD;
    const v238 = v237 + '|';
    const v239 = v238 + SINGLE_QUOTE;
    const v240 = v239 + '|';
    const v241 = v240 + DOUBLE_QUOTE;
    const v242 = v241 + ')*';
    const v243 = [
        v236,
        v242
    ];
    const v244 = v243.join('|');
    var chunker = new RegExp(v244, 'g');
    const v245 = s.match(chunker);
    var match = filter(v245, Boolean);
    var commented = false;
    const v246 = !match;
    if (v246) {
        const v247 = [];
        return v247;
    }
    const v248 = !env;
    if (v248) {
        env = {};
    }
    const v249 = !opts;
    if (v249) {
        opts = {};
    }
    const v322 = function (s, j) {
        if (commented) {
            return;
        }
        const v250 = '^' + CONTROL;
        const v251 = v250 + '$';
        const v252 = RegExp(v251);
        const v253 = v252.test(s);
        if (v253) {
            const v254 = {};
            v254.op = s;
            return v254;
        }
        var SQ = '\'';
        var DQ = '"';
        var DS = '$';
        const v255 = opts.escape;
        var BS = v255 || '\\';
        var quote = false;
        var esc = false;
        var out = '';
        var isGlob = false;
        var i = 0;
        var len = s.length;
        let v256 = i < len;
        while (v256) {
            var c = s.charAt(i);
            const v258 = !quote;
            const v259 = c === '*';
            const v260 = c === '?';
            const v261 = v259 || v260;
            const v262 = v258 && v261;
            isGlob = isGlob || v262;
            if (esc) {
                out += c;
                esc = false;
            } else {
                if (quote) {
                    const v263 = c === quote;
                    if (v263) {
                        quote = false;
                    } else {
                        const v264 = quote == SQ;
                        if (v264) {
                            out += c;
                        } else {
                            const v265 = c === BS;
                            if (v265) {
                                i += 1;
                                c = s.charAt(i);
                                const v266 = c === DQ;
                                const v267 = c === BS;
                                const v268 = v266 || v267;
                                const v269 = c === DS;
                                const v270 = v268 || v269;
                                if (v270) {
                                    out += c;
                                } else {
                                    out += BS + c;
                                }
                            } else {
                                const v271 = c === DS;
                                if (v271) {
                                    out += parseEnvVar();
                                } else {
                                    out += c;
                                }
                            }
                        }
                    }
                } else {
                    const v272 = c === DQ;
                    const v273 = c === SQ;
                    const v274 = v272 || v273;
                    if (v274) {
                        quote = c;
                    } else {
                        const v275 = '^' + CONTROL;
                        const v276 = v275 + '$';
                        const v277 = RegExp(v276);
                        const v278 = v277.test(c);
                        if (v278) {
                            const v279 = {};
                            v279.op = s;
                            return v279;
                        } else {
                            const v280 = RegExp('^#$');
                            const v281 = v280.test(c);
                            if (v281) {
                                commented = true;
                                const v282 = out.length;
                                if (v282) {
                                    const v283 = i + 1;
                                    const v284 = s.slice(v283);
                                    const v285 = j + 1;
                                    const v286 = match.slice(v285);
                                    const v287 = v286.join(' ');
                                    const v288 = v284 + v287;
                                    const v289 = { comment: v288 };
                                    const v290 = [
                                        out,
                                        v289
                                    ];
                                    return v290;
                                }
                                const v291 = i + 1;
                                const v292 = s.slice(v291);
                                const v293 = j + 1;
                                const v294 = match.slice(v293);
                                const v295 = v294.join(' ');
                                const v296 = v292 + v295;
                                const v297 = { comment: v296 };
                                const v298 = [v297];
                                return v298;
                            } else {
                                const v299 = c === BS;
                                if (v299) {
                                    esc = true;
                                } else {
                                    const v300 = c === DS;
                                    if (v300) {
                                        out += parseEnvVar();
                                    } else {
                                        out += c;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            const v257 = i++;
            v256 = i < len;
        }
        if (isGlob) {
            const v301 = {};
            v301.op = 'glob';
            v301.pattern = out;
            return v301;
        }
        return out;
        const parseEnvVar = function () {
            i += 1;
            var varend;
            var varname;
            const v302 = s.charAt(i);
            const v303 = v302 === '{';
            if (v303) {
                i += 1;
                const v304 = s.charAt(i);
                const v305 = v304 === '}';
                if (v305) {
                    const v306 = i - 2;
                    const v307 = s.substr(v306, 3);
                    const v308 = 'Bad substitution: ' + v307;
                    const v309 = new Error(v308);
                    throw v309;
                }
                varend = s.indexOf('}', i);
                const v310 = varend < 0;
                if (v310) {
                    const v311 = s.substr(i);
                    const v312 = 'Bad substitution: ' + v311;
                    const v313 = new Error(v312);
                    throw v313;
                }
                const v314 = varend - i;
                varname = s.substr(i, v314);
                i = varend;
            } else {
                const v315 = s.charAt(i);
                const v316 = /[*@#?$!_\-]/.test(v315);
                if (v316) {
                    varname = s.charAt(i);
                    i += 1;
                } else {
                    const v317 = s.substr(i);
                    varend = v317.match(/[^\w\d_]/);
                    const v318 = !varend;
                    if (v318) {
                        varname = s.substr(i);
                        i = s.length;
                    } else {
                        const v319 = varend.index;
                        varname = s.substr(i, v319);
                        const v320 = varend.index;
                        i += v320 - 1;
                    }
                }
            }
            const v321 = getVar(null, '', varname);
            return v321;
        };
    };
    const v323 = map(match, v322);
    const v326 = function (prev, arg) {
        const v324 = arg === undefined;
        if (v324) {
            return prev;
        }
        const v325 = prev.concat(arg);
        return v325;
    };
    const v327 = [];
    const v328 = v323.reduce(v326, v327);
    return v328;
    const getVar = function (_, pre, key) {
        let r;
        const v329 = typeof env;
        const v330 = v329 === 'function';
        const v331 = env(key);
        const v332 = env[key];
        if (v330) {
            r = v331;
        } else {
            r = v332;
        }
        const v333 = r === undefined;
        if (v333) {
            r = '';
        }
        const v334 = typeof r;
        const v335 = v334 === 'object';
        if (v335) {
            const v336 = pre + TOKEN;
            const v337 = json.stringify(r);
            const v338 = v336 + v337;
            const v339 = v338 + TOKEN;
            return v339;
        } else {
            const v340 = pre + r;
            return v340;
        }
    };
};