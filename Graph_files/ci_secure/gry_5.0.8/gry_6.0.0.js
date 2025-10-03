'use strict';
const v126 = function () {
    const defineProperties = function (target, props) {
        var i = 0;
        const v115 = props.length;
        let v116 = i < v115;
        while (v116) {
            var descriptor = props[i];
            const v118 = descriptor.enumerable;
            descriptor.enumerable = v118 || false;
            descriptor.configurable = true;
            const v119 = 'value' in descriptor;
            if (v119) {
                descriptor.writable = true;
            }
            const v120 = descriptor.key;
            const v121 = Object.defineProperty(target, v120, descriptor);
            v121;
            const v117 = i++;
            v116 = i < v115;
        }
    };
    const v125 = function (Constructor, protoProps, staticProps) {
        if (protoProps) {
            const v122 = Constructor.prototype;
            const v123 = defineProperties(v122, protoProps);
            v123;
        }
        if (staticProps) {
            const v124 = defineProperties(Constructor, staticProps);
            v124;
        }
        return Constructor;
    };
    return v125;
};
var _createClass = v126();
const _toConsumableArray = function (arr) {
    const v127 = Array.isArray(arr);
    if (v127) {
        var i = 0;
        const v128 = arr.length;
        var arr2 = Array(v128);
        const v129 = arr.length;
        let v130 = i < v129;
        while (v130) {
            const v132 = arr[i];
            arr2[i] = v132;
            const v131 = i++;
            v130 = i < v129;
        }
        return arr2;
    } else {
        const v133 = Array.from(arr);
        return v133;
    }
};
const _classCallCheck = function (instance, Constructor) {
    const v134 = instance instanceof Constructor;
    const v135 = !v134;
    if (v135) {
        const v136 = new TypeError('Cannot call a class as a function');
        throw v136;
    }
};
var fs = require('fs');
var abs = require('abs');
var ExecLimiter = require('exec-limiter');
var ul = require('ul');
var el = new ExecLimiter();
const v228 = function () {
    const Gry = function (options) {
        const v137 = _classCallCheck(this, Gry);
        v137;
        const v138 = typeof options;
        const v139 = v138 === 'string';
        if (v139) {
            options.path = options;
            options = {};
            options = {};
        }
        const v140 = { limit: 30 };
        options = ul.merge(options, v140);
        const v141 = options.path;
        const v142 = abs(v141);
        options.path = v142;
        this.options = options;
        const v143 = options.path;
        this.cwd = v143;
    };
    const v157 = function exec(command, args, callback) {
        var eargs = [];
        const v144 = typeof args;
        const v145 = v144 === 'function';
        if (v145) {
            callback = args;
            args = null;
        }
        const v146 = this.cwd;
        const v147 = { cwd: v146 };
        const v148 = eargs.push(v147);
        v148;
        const v152 = function (err, stdout) {
            if (err) {
                const v149 = callback(err);
                return v149;
            }
            const v150 = stdout.trimRight();
            const v151 = callback(null, v150);
            v151;
        };
        const v153 = eargs.push(v152);
        v153;
        const v154 = eargs[0];
        const v155 = eargs[1];
        const v156 = el.add('git', command, v154, v155);
        v156;
        return this;
    };
    const v158 = {
        key: 'exec',
        value: v157
    };
    const v161 = function init(callback) {
        const v159 = ['init'];
        const v160 = this.exec(v159, callback);
        return v160;
    };
    const v162 = {
        key: 'init',
        value: v161
    };
    const v168 = function create(callback) {
        var _this = this;
        const v163 = this.cwd;
        const v166 = function (err) {
            if (err) {
                const v164 = callback(err);
                return v164;
            }
            const v165 = _this.init(callback);
            v165;
        };
        const v167 = fs.mkdir(v163, v166);
        v167;
        return this;
    };
    const v169 = {
        key: 'create',
        value: v168
    };
    const v179 = function commit(message, options, callback) {
        message = message.replace(/\"/g, '\\');
        const v170 = typeof options;
        const v171 = v170 === 'function';
        if (v171) {
            callback = options;
            options = '';
        }
        const v172 = [
            'commit',
            '-m',
            message
        ];
        const v173 = options.split(' ');
        const v174 = function (a) {
            return a;
        };
        const v175 = v173.filter(v174);
        const v176 = _toConsumableArray(v175);
        const v177 = v172.concat(v176);
        const v178 = this.exec(v177, callback);
        return v178;
    };
    const v180 = {
        key: 'commit',
        value: v179
    };
    const v188 = function pull(options, callback) {
        const v181 = typeof options;
        const v182 = v181 === 'function';
        if (v182) {
            callback = options;
            options = '';
        }
        const v183 = ['pull'];
        const v184 = options.split(' ');
        const v185 = _toConsumableArray(v184);
        const v186 = v183.concat(v185);
        const v187 = this.exec(v186, callback);
        return v187;
    };
    const v189 = {
        key: 'pull',
        value: v188
    };
    const v197 = function add(options, callback) {
        const v190 = typeof options;
        const v191 = v190 === 'function';
        if (v191) {
            callback = options;
            options = '.';
        }
        const v192 = ['add'];
        const v193 = options.split(' ');
        const v194 = _toConsumableArray(v193);
        const v195 = v192.concat(v194);
        const v196 = this.exec(v195, callback);
        return v196;
    };
    const v198 = {
        key: 'add',
        value: v197
    };
    const v206 = function branch(options, callback) {
        const v199 = typeof options;
        const v200 = v199 === 'function';
        if (v200) {
            callback = options;
            options = '';
        }
        const v201 = ['branch'];
        const v202 = options.split(' ');
        const v203 = _toConsumableArray(v202);
        const v204 = v201.concat(v203);
        const v205 = this.exec(v204, callback);
        return v205;
    };
    const v207 = {
        key: 'branch',
        value: v206
    };
    const v215 = function checkout(options, callback) {
        const v208 = typeof options;
        const v209 = v208 === 'function';
        if (v209) {
            callback = options;
            options = '';
        }
        const v210 = ['checkout'];
        const v211 = options.split(' ');
        const v212 = _toConsumableArray(v211);
        const v213 = v210.concat(v212);
        const v214 = this.exec(v213, callback);
        return v214;
    };
    const v216 = {
        key: 'checkout',
        value: v215
    };
    const v224 = function clone(gitUrl, options, callback) {
        const v217 = typeof options;
        const v218 = v217 === 'function';
        if (v218) {
            callback = options;
            options = '';
        }
        const v219 = [
            'clone',
            gitUrl
        ];
        const v220 = options.split(' ');
        const v221 = _toConsumableArray(v220);
        const v222 = v219.concat(v221);
        const v223 = this.exec(v222, callback);
        return v223;
    };
    const v225 = {
        key: 'clone',
        value: v224
    };
    const v226 = [
        v158,
        v162,
        v169,
        v180,
        v189,
        v198,
        v207,
        v216,
        v225
    ];
    const v227 = _createClass(Gry, v226);
    v227;
    return Gry;
};
var Gry = v228();
Gry.limiter = el;
module.exports = Gry;