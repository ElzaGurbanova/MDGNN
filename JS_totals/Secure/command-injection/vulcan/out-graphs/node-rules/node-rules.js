const v218 = function () {
    'use strict';
    exports.version = '3.0.0';
    var isEqual = require('lodash.isequal');
    var filterd = require('lodash.filter');
    var clonedeep = require('lodash.clonedeep');
    var matches = require('lodash.matches');
    const RuleEngine = function (rules, options) {
        const v111 = this.init();
        v111;
        const v112 = typeof rules;
        const v113 = v112 != 'undefined';
        if (v113) {
            const v114 = this.register(rules);
            v114;
        }
        if (options) {
            const v115 = options.ignoreFactChanges;
            this.ignoreFactChanges = v115;
        }
        return this;
    };
    const v116 = RuleEngine.prototype;
    const v117 = function (rules) {
        this.rules = [];
        this.activeRules = [];
    };
    v116.init = v117;
    const v118 = RuleEngine.prototype;
    const v129 = function (rules) {
        const v119 = Array.isArray(rules);
        if (v119) {
            const v120 = this.rules;
            const v121 = v120.concat(rules);
            this.rules = v121;
        } else {
            const v122 = rules !== null;
            const v123 = typeof rules;
            const v124 = v123 == 'object';
            const v125 = v122 && v124;
            if (v125) {
                const v126 = this.rules;
                const v127 = v126.push(rules);
                v127;
            }
        }
        const v128 = this.sync();
        v128;
    };
    v118.register = v129;
    const v130 = RuleEngine.prototype;
    const v148 = function () {
        const v131 = this.rules;
        const v137 = function (a) {
            const v132 = a.on;
            const v133 = typeof v132;
            const v134 = v133 === 'undefined';
            if (v134) {
                a.on = true;
            }
            const v135 = a.on;
            const v136 = v135 === true;
            if (v136) {
                return a;
            }
        };
        const v138 = v131.filter(v137);
        this.activeRules = v138;
        const v139 = this.activeRules;
        const v146 = function (a, b) {
            const v140 = a.priority;
            const v141 = b.priority;
            const v142 = v140 && v141;
            if (v142) {
                const v143 = b.priority;
                const v144 = a.priority;
                const v145 = v143 - v144;
                return v145;
            } else {
                return 0;
            }
        };
        const v147 = v139.sort(v146);
        v147;
    };
    v130.sync = v148;
    const v149 = RuleEngine.prototype;
    const v195 = function (fact, callback) {
        var complete = false;
        fact.result = true;
        var session = clonedeep(fact);
        var lastSession = clonedeep(fact);
        var _rules = this.activeRules;
        var matchPath = [];
        var ignoreFactChanges = this.ignoreFactChanges;
        const v193 = function FnRuleLoop(x) {
            const v151 = function () {
                const v150 = _rules[x];
                return v150;
            };
            const v167 = function (outcome) {
                if (outcome) {
                    const v152 = _rules[x];
                    var _consequence = v152.consequence;
                    const v153 = _rules[x];
                    const v154 = v153.id;
                    const v155 = _rules[x];
                    const v156 = v155.name;
                    const v157 = v154 || v156;
                    const v158 = 'index_' + x;
                    _consequence.ruleRef = v157 || v158;
                    const v162 = function () {
                        const v159 = _consequence.ruleRef;
                        const v160 = matchPath.push(v159);
                        v160;
                        const v161 = _consequence.call(session, API, session);
                        v161;
                    };
                    const v163 = process.nextTick(v162);
                    v163;
                } else {
                    const v165 = function () {
                        const v164 = API.next();
                        v164;
                    };
                    const v166 = process.nextTick(v165);
                    v166;
                }
            };
            const v169 = function () {
                const v168 = FnRuleLoop(0);
                return v168;
            };
            const v171 = function () {
                complete = true;
                const v170 = FnRuleLoop(0);
                return v170;
            };
            const v183 = function () {
                const v172 = !ignoreFactChanges;
                const v173 = isEqual(lastSession, session);
                const v174 = !v173;
                const v175 = v172 && v174;
                if (v175) {
                    lastSession = clonedeep(session);
                    const v177 = function () {
                        const v176 = API.restart();
                        v176;
                    };
                    const v178 = process.nextTick(v177);
                    v178;
                } else {
                    const v181 = function () {
                        const v179 = x + 1;
                        const v180 = FnRuleLoop(v179);
                        return v180;
                    };
                    const v182 = process.nextTick(v181);
                    v182;
                }
            };
            var API = {};
            API['rule'] = v151;
            API['when'] = v167;
            API['restart'] = v169;
            API['stop'] = v171;
            API['next'] = v183;
            const v184 = _rules.length;
            const v185 = x < v184;
            const v186 = complete === false;
            const v187 = v185 && v186;
            if (v187) {
                const v188 = _rules[x];
                var _rule = v188.condition;
                const v189 = _rule.call(session, API, session);
                v189;
            } else {
                const v191 = function () {
                    session.matchPath = matchPath;
                    const v190 = callback(session);
                    return v190;
                };
                const v192 = process.nextTick(v191);
                v192;
            }
        };
        const v194 = v193(0);
        v194;
    };
    v149.execute = v195;
    const v196 = RuleEngine.prototype;
    const v202 = function (filter) {
        const v197 = typeof filter;
        const v198 = v197 === 'undefined';
        if (v198) {
            const v199 = this.rules;
            return v199;
        } else {
            var find = matches(filter);
            const v200 = this.rules;
            const v201 = filterd(v200, find);
            return v201;
        }
    };
    v196.findRules = v202;
    const v203 = RuleEngine.prototype;
    const v211 = function (state, filter) {
        let state;
        const v204 = state === 'on';
        const v205 = state === 'ON';
        const v206 = v204 || v205;
        if (v206) {
            state = true;
        } else {
            state = false;
        }
        var rules = this.findRules(filter);
        var i = 0;
        var j = rules.length;
        let v207 = i < j;
        while (v207) {
            const v209 = rules[i];
            v209.on = state;
            const v208 = i++;
            v207 = i < j;
        }
        const v210 = this.sync();
        v210;
    };
    v203.turn = v211;
    const v212 = RuleEngine.prototype;
    const v217 = function (priority, filter) {
        priority = parseInt(priority, 10);
        var rules = this.findRules(filter);
        var i = 0;
        var j = rules.length;
        let v213 = i < j;
        while (v213) {
            const v215 = rules[i];
            v215.priority = priority;
            const v214 = i++;
            v213 = i < j;
        }
        const v216 = this.sync();
        v216;
    };
    v212.prioritize = v217;
    module.exports = RuleEngine;
};
const v219 = module.exports;
const v220 = v218(v219);
v220;