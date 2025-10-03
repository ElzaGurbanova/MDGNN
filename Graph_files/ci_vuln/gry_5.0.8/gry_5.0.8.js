'use strict';
const v108 = function () {
    const defineProperties = function (target, props) {
        var i = 0;
        const v97 = props.length;
        let v98 = i < v97;
        while (v98) {
            var descriptor = props[i];
            const v100 = descriptor.enumerable;
            descriptor.enumerable = v100 || false;
            descriptor.configurable = true;
            const v101 = 'value' in descriptor;
            if (v101) {
                descriptor.writable = true;
            }
            const v102 = descriptor.key;
            const v103 = Object.defineProperty(target, v102, descriptor);
            v103;
            const v99 = i++;
            v98 = i < v97;
        }
    };
    const v107 = function (Constructor, protoProps, staticProps) {
        if (protoProps) {
            const v104 = Constructor.prototype;
            const v105 = defineProperties(v104, protoProps);
            v105;
        }
        if (staticProps) {
            const v106 = defineProperties(Constructor, staticProps);
            v106;
        }
        return Constructor;
    };
    return v107;
};
var _createClass = v108();
const _classCallCheck = function (instance, Constructor) {
    const v109 = instance instanceof Constructor;
    const v110 = !v109;
    if (v110) {
        const v111 = new TypeError('Cannot call a class as a function');
        throw v111;
    }
};
var fs = require('fs');
var abs = require('abs');
var ExecLimiter = require('exec-limiter');
var ul = require('ul');
var el = new ExecLimiter();
const v192 = function () {
    const Gry = function (options) {
        const v112 = _classCallCheck(this, Gry);
        v112;
        const v113 = typeof options;
        const v114 = v113 === 'string';
        if (v114) {
            options.path = options;
            options = {};
            options = {};
        }
        const v115 = { limit: 30 };
        options = ul.merge(options, v115);
        const v116 = options.path;
        const v117 = abs(v116);
        options.path = v117;
        this.options = options;
        const v118 = options.path;
        this.cwd = v118;
    };
    const v138 = function exec(command, args, callback) {
        var eargs = [];
        const v119 = typeof args;
        const v120 = v119 === 'function';
        if (v120) {
            callback = args;
            args = null;
        }
        const v121 = Array.isArray(args);
        if (v121) {
            const v122 = [command];
            const v123 = v122.concat(args);
            const v124 = eargs.push('git', v123);
            v124;
        } else {
            const v125 = command.trim();
            const v126 = 'git ' + v125;
            const v127 = eargs.push(v126);
            v127;
        }
        const v128 = this.cwd;
        const v129 = { cwd: v128 };
        const v130 = eargs.push(v129);
        v130;
        const v134 = function (err, stdout) {
            if (err) {
                const v131 = callback(err);
                return v131;
            }
            const v132 = stdout.trimRight();
            const v133 = callback(null, v132);
            v133;
        };
        const v135 = eargs.push(v134);
        v135;
        const v136 = el.add;
        const v137 = v136.apply(el, eargs);
        v137;
        return this;
    };
    const v139 = {
        key: 'exec',
        value: v138
    };
    const v141 = function init(callback) {
        const v140 = this.exec('init', callback);
        return v140;
    };
    const v142 = {
        key: 'init',
        value: v141
    };
    const v148 = function create(callback) {
        var _this = this;
        const v143 = this.cwd;
        const v146 = function (err) {
            if (err) {
                const v144 = callback(err);
                return v144;
            }
            const v145 = _this.init(callback);
            v145;
        };
        const v147 = fs.mkdir(v143, v146);
        v147;
        return this;
    };
    const v149 = {
        key: 'create',
        value: v148
    };
    const v156 = function commit(message, options, callback) {
        message = message.replace(/\"/g, '\\');
        const v150 = typeof options;
        const v151 = v150 === 'function';
        if (v151) {
            callback = options;
            options = '';
        }
        const v152 = 'commit -m "' + message;
        const v153 = v152 + '" ';
        const v154 = v153 + options;
        const v155 = this.exec(v154, callback);
        return v155;
    };
    const v157 = {
        key: 'commit',
        value: v156
    };
    const v162 = function pull(options, callback) {
        const v158 = typeof options;
        const v159 = v158 === 'function';
        if (v159) {
            callback = options;
            options = '';
        }
        const v160 = 'pull ' + options;
        const v161 = this.exec(v160, callback);
        return v161;
    };
    const v163 = {
        key: 'pull',
        value: v162
    };
    const v168 = function add(options, callback) {
        const v164 = typeof options;
        const v165 = v164 === 'function';
        if (v165) {
            callback = options;
            options = '.';
        }
        const v166 = 'add ' + options;
        const v167 = this.exec(v166, callback);
        return v167;
    };
    const v169 = {
        key: 'add',
        value: v168
    };
    const v174 = function branch(options, callback) {
        const v170 = typeof options;
        const v171 = v170 === 'function';
        if (v171) {
            callback = options;
            options = '';
        }
        const v172 = 'branch ' + options;
        const v173 = this.exec(v172, callback);
        return v173;
    };
    const v175 = {
        key: 'branch',
        value: v174
    };
    const v180 = function checkout(options, callback) {
        const v176 = typeof options;
        const v177 = v176 === 'function';
        if (v177) {
            callback = options;
            options = '';
        }
        const v178 = 'checkout ' + options;
        const v179 = this.exec(v178, callback);
        return v179;
    };
    const v181 = {
        key: 'checkout',
        value: v180
    };
    const v188 = function clone(gitUrl, options, callback) {
        const v182 = typeof options;
        const v183 = v182 === 'function';
        if (v183) {
            callback = options;
            options = '';
        }
        const v184 = 'clone ' + gitUrl;
        const v185 = v184 + ' ';
        const v186 = v185 + options;
        const v187 = this.exec(v186, callback);
        return v187;
    };
    const v189 = {
        key: 'clone',
        value: v188
    };
    const v190 = [
        v139,
        v142,
        v149,
        v157,
        v163,
        v169,
        v175,
        v181,
        v189
    ];
    const v191 = _createClass(Gry, v190);
    v191;
    return Gry;
};
var Gry = v192();
Gry.limiter = el;
module.exports = Gry;