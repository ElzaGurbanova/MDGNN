const v302 = function () {
    'use strict';
    exports.version = '3.0.0';
    var isEqual = require('lodash.isequal');
    var filterd = require('lodash.filter');
    var clonedeep = require('lodash.clonedeep');
    var matches = require('lodash.matches');
    const RuleEngine = function (rules, options) {
        const v153 = this.init();
        v153;
        const v154 = typeof rules;
        const v155 = v154 != 'undefined';
        if (v155) {
            const v156 = this.register(rules);
            v156;
        }
        if (options) {
            const v157 = options.ignoreFactChanges;
            this.ignoreFactChanges = v157;
        }
        return this;
    };
    const v158 = RuleEngine.prototype;
    const v159 = function (rules) {
        this.rules = [];
        this.activeRules = [];
    };
    v158.init = v159;
    const v160 = RuleEngine.prototype;
    const v171 = function (rules) {
        const v161 = Array.isArray(rules);
        if (v161) {
            const v162 = this.rules;
            const v163 = v162.concat(rules);
            this.rules = v163;
        } else {
            const v164 = rules !== null;
            const v165 = typeof rules;
            const v166 = v165 == 'object';
            const v167 = v164 && v166;
            if (v167) {
                const v168 = this.rules;
                const v169 = v168.push(rules);
                v169;
            }
        }
        const v170 = this.sync();
        v170;
    };
    v160.register = v171;
    const v172 = RuleEngine.prototype;
    const v190 = function () {
        const v173 = this.rules;
        const v179 = function (a) {
            const v174 = a.on;
            const v175 = typeof v174;
            const v176 = v175 === 'undefined';
            if (v176) {
                a.on = true;
            }
            const v177 = a.on;
            const v178 = v177 === true;
            if (v178) {
                return a;
            }
        };
        const v180 = v173.filter(v179);
        this.activeRules = v180;
        const v181 = this.activeRules;
        const v188 = function (a, b) {
            const v182 = a.priority;
            const v183 = b.priority;
            const v184 = v182 && v183;
            if (v184) {
                const v185 = b.priority;
                const v186 = a.priority;
                const v187 = v185 - v186;
                return v187;
            } else {
                return 0;
            }
        };
        const v189 = v181.sort(v188);
        v189;
    };
    v172.sync = v190;
    const v191 = RuleEngine.prototype;
    const v237 = function (fact, callback) {
        var complete = false;
        fact.result = true;
        var session = clonedeep(fact);
        var lastSession = clonedeep(fact);
        var _rules = this.activeRules;
        var matchPath = [];
        var ignoreFactChanges = this.ignoreFactChanges;
        const v235 = function FnRuleLoop(x) {
            const v193 = function () {
                const v192 = _rules[x];
                return v192;
            };
            const v209 = function (outcome) {
                if (outcome) {
                    const v194 = _rules[x];
                    var _consequence = v194.consequence;
                    const v195 = _rules[x];
                    const v196 = v195.id;
                    const v197 = _rules[x];
                    const v198 = v197.name;
                    const v199 = v196 || v198;
                    const v200 = 'index_' + x;
                    _consequence.ruleRef = v199 || v200;
                    const v204 = function () {
                        const v201 = _consequence.ruleRef;
                        const v202 = matchPath.push(v201);
                        v202;
                        const v203 = _consequence.call(session, API, session);
                        v203;
                    };
                    const v205 = process.nextTick(v204);
                    v205;
                } else {
                    const v207 = function () {
                        const v206 = API.next();
                        v206;
                    };
                    const v208 = process.nextTick(v207);
                    v208;
                }
            };
            const v211 = function () {
                const v210 = FnRuleLoop(0);
                return v210;
            };
            const v213 = function () {
                complete = true;
                const v212 = FnRuleLoop(0);
                return v212;
            };
            const v225 = function () {
                const v214 = !ignoreFactChanges;
                const v215 = isEqual(lastSession, session);
                const v216 = !v215;
                const v217 = v214 && v216;
                if (v217) {
                    lastSession = clonedeep(session);
                    const v219 = function () {
                        const v218 = API.restart();
                        v218;
                    };
                    const v220 = process.nextTick(v219);
                    v220;
                } else {
                    const v223 = function () {
                        const v221 = x + 1;
                        const v222 = FnRuleLoop(v221);
                        return v222;
                    };
                    const v224 = process.nextTick(v223);
                    v224;
                }
            };
            var API = {};
            API['rule'] = v193;
            API['when'] = v209;
            API['restart'] = v211;
            API['stop'] = v213;
            API['next'] = v225;
            const v226 = _rules.length;
            const v227 = x < v226;
            const v228 = complete === false;
            const v229 = v227 && v228;
            if (v229) {
                const v230 = _rules[x];
                var _rule = v230.condition;
                const v231 = _rule.call(session, API, session);
                v231;
            } else {
                const v233 = function () {
                    session.matchPath = matchPath;
                    const v232 = callback(session);
                    return v232;
                };
                const v234 = process.nextTick(v233);
                v234;
            }
        };
        const v236 = v235(0);
        v236;
    };
    v191.execute = v237;
    const v238 = RuleEngine.prototype;
    const v244 = function (filter) {
        const v239 = typeof filter;
        const v240 = v239 === 'undefined';
        if (v240) {
            const v241 = this.rules;
            return v241;
        } else {
            var find = matches(filter);
            const v242 = this.rules;
            const v243 = filterd(v242, find);
            return v243;
        }
    };
    v238.findRules = v244;
    const v245 = RuleEngine.prototype;
    const v253 = function (state, filter) {
        let state;
        const v246 = state === 'on';
        const v247 = state === 'ON';
        const v248 = v246 || v247;
        if (v248) {
            state = true;
        } else {
            state = false;
        }
        var rules = this.findRules(filter);
        var i = 0;
        var j = rules.length;
        let v249 = i < j;
        while (v249) {
            const v251 = rules[i];
            v251.on = state;
            const v250 = i++;
            v249 = i < j;
        }
        const v252 = this.sync();
        v252;
    };
    v245.turn = v253;
    const v254 = RuleEngine.prototype;
    const v259 = function (priority, filter) {
        priority = parseInt(priority, 10);
        var rules = this.findRules(filter);
        var i = 0;
        var j = rules.length;
        let v255 = i < j;
        while (v255) {
            const v257 = rules[i];
            v257.priority = priority;
            const v256 = i++;
            v255 = i < j;
        }
        const v258 = this.sync();
        v258;
    };
    v254.prioritize = v259;
    const v260 = RuleEngine.prototype;
    const v273 = function () {
        var rules = this.rules;
        const v261 = rules instanceof Array;
        if (v261) {
            const v266 = function (rule) {
                const v262 = rule.condition;
                const v263 = v262.toString();
                rule.condition = v263;
                const v264 = rule.consequence;
                const v265 = v264.toString();
                rule.consequence = v265;
                return rule;
            };
            rules = rules.map(v266);
        } else {
            const v267 = typeof rules;
            const v268 = v267 != 'undefined';
            if (v268) {
                const v269 = rules.condition;
                const v270 = v269.toString();
                rules.condition = v270;
                const v271 = rules.consequence;
                const v272 = v271.toString();
                rules.consequence = v272;
            }
        }
        return rules;
    };
    v260.toJSON = v273;
    const v274 = RuleEngine.prototype;
    const v301 = function (rules) {
        const v275 = this.init();
        v275;
        const v276 = typeof rules;
        const v277 = v276 == 'string';
        if (v277) {
            rules = JSON.parse(rules);
        }
        const v278 = rules instanceof Array;
        if (v278) {
            const v287 = function (rule) {
                const v279 = rule.condition;
                const v280 = '(' + v279;
                const v281 = v280 + ')';
                const v282 = eval(v281);
                rule.condition = v282;
                const v283 = rule.consequence;
                const v284 = '(' + v283;
                const v285 = v284 + ')';
                const v286 = eval(v285);
                rule.consequence = v286;
                return rule;
            };
            rules = rules.map(v287);
        } else {
            const v288 = rules !== null;
            const v289 = typeof rules;
            const v290 = v289 == 'object';
            const v291 = v288 && v290;
            if (v291) {
                const v292 = rules.condition;
                const v293 = '(' + v292;
                const v294 = v293 + ')';
                const v295 = eval(v294);
                rules.condition = v295;
                const v296 = rules.consequence;
                const v297 = '(' + v296;
                const v298 = v297 + ')';
                const v299 = eval(v298);
                rules.consequence = v299;
            }
        }
        const v300 = this.register(rules);
        v300;
    };
    v274.fromJSON = v301;
    module.exports = RuleEngine;
};
const v303 = module.exports;
const v304 = v302(v303);
v304;