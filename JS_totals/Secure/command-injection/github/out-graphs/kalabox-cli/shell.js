'use strict';
const v120 = require('child_process');
var spawn = v120.spawn;
var path = require('path');
var _ = require('lodash');
var _shell = require('shelljs');
var esc = require('shell-escape');
var VError = require('verror');
var core = require('../core.js');
var Promise = require('../promise.js');
const getEnvironment = function (opts) {
    const v121 = opts.app;
    const v122 = opts && v121;
    if (v122) {
        const v123 = process.env;
        var processEnv = _.cloneDeep(v123);
        const v124 = opts.app;
        const v125 = v124.env;
        var appEnv = v125.getEnv();
        const v126 = _.merge(processEnv, appEnv);
        return v126;
    } else {
        const v127 = process.env;
        return v127;
    }
};
const trollStdout = function (opts, msg) {
    var app = _.get(opts, 'app');
    const v128 = app && msg;
    if (v128) {
        const v129 = app.trollForStatus(msg);
        v129;
    }
};
const splitArgs = function (str) {
    const v130 = !str;
    if (v130) {
        const v131 = [];
        return v131;
    }
    var out = [];
    var re = /"([^"]*)"|'([^']*)'|(\S+)/g;
    var m;
    while (m = re.exec(str)) {
        const v132 = m[1];
        const v133 = m[2];
        const v134 = v132 || v133;
        const v135 = m[3];
        const v136 = v134 || v135;
        const v137 = out.push(v136);
        v137;
    }
    return out;
};
const v185 = function (cmd, opts) {
    var defaults = {};
    defaults.silent = true;
    let options;
    const v138 = _.extend(defaults, opts);
    if (opts) {
        options = v138;
    } else {
        options = defaults;
    }
    const v139 = getEnvironment(options);
    options.env = v139;
    const v140 = core.log;
    var execLog = v140.make('UTIL EXEC');
    const v141 = [
        cmd,
        opts
    ];
    const v142 = execLog.debug(v141);
    v142;
    const v183 = function (resolve, reject) {
        let argv;
        const v143 = Array.isArray(cmd);
        const v144 = cmd.slice();
        const v145 = String(cmd);
        const v146 = splitArgs(v145);
        if (v143) {
            argv = v144;
        } else {
            argv = v146;
        }
        const v147 = argv.length;
        const v148 = v147 === 0;
        if (v148) {
            const v149 = new VError('Empty command');
            const v150 = reject(v149);
            return v150;
        }
        var entrypoint = argv.shift();
        const v151 = options.env;
        const v152 = options.cwd;
        const v153 = {
            env: v151,
            cwd: v152,
            stdio: 'pipe',
            shell: false
        };
        var child = spawn(entrypoint, argv, v153);
        var stdout = '';
        var stderr = '';
        const v154 = child.stdout;
        const v161 = function (buf) {
            var s = String(buf);
            const v155 = options.silent;
            const v156 = !v155;
            if (v156) {
                const v157 = process.stdout;
                const v158 = v157.write(s);
                v158;
            }
            stdout += s;
            const v159 = _.trim(s);
            const v160 = trollStdout(options, v159);
            v160;
        };
        const v162 = v154.on('data', v161);
        v162;
        const v163 = child.stderr;
        const v168 = function (buf) {
            var s = String(buf);
            const v164 = options.silent;
            const v165 = !v164;
            if (v165) {
                const v166 = process.stderr;
                const v167 = v166.write(s);
                v167;
            }
            stderr += s;
        };
        const v169 = v163.on('data', v168);
        v169;
        const v172 = function (err) {
            const v170 = new VError(err, 'spawn failed');
            const v171 = reject(v170);
            v171;
        };
        const v173 = child.on('error', v172);
        v173;
        const v181 = function (code) {
            const v174 = code !== 0;
            if (v174) {
                const v175 = 'code: ' + code;
                const v176 = v175 + 'err:';
                const v177 = v176 + stderr;
                const v178 = new VError(v177);
                const v179 = reject(v178);
                v179;
            } else {
                const v180 = resolve(stdout);
                v180;
            }
        };
        const v182 = child.on('close', v181);
        v182;
    };
    const v184 = new Promise(v183);
    return v184;
};
exports.exec = v185;
const v231 = function (cmd, opts) {
    const v229 = function (resolve, reject) {
        const v186 = [
            'pipe',
            'pipe',
            'pipe'
        ];
        var defaults = {};
        defaults.stdio = v186;
        let options;
        const v187 = _.extend(defaults, opts);
        if (opts) {
            options = v187;
        } else {
            options = defaults;
        }
        const v188 = getEnvironment(opts);
        options.env = v188;
        var entrypoint = cmd.shift();
        var run = spawn(entrypoint, cmd, options);
        const v189 = core.log;
        const v190 = path.basename(entrypoint);
        const v191 = v190.toUpperCase();
        var spawnLog = v189.make(v191);
        const v192 = [
            entrypoint,
            cmd,
            options
        ];
        const v193 = spawnLog.debug(v192);
        v193;
        var stdOut = '';
        var stdErr = '';
        const v194 = options.stdio;
        const v195 = v194 === 'pipe';
        const v196 = options.stdio;
        const v197 = v196[1];
        const v198 = v197 === 'pipe';
        const v199 = v195 || v198;
        if (v199) {
            const v200 = run.stdout;
            const v208 = function (buffer) {
                const v201 = String(buffer);
                const v202 = _.trim(v201);
                const v203 = spawnLog.info(v202);
                v203;
                const v204 = String(buffer);
                stdOut = stdOut + v204;
                const v205 = String(buffer);
                const v206 = _.trim(v205);
                const v207 = trollStdout(options, v206);
                v207;
            };
            const v209 = v200.on('data', v208);
            v209;
        }
        const v214 = function (buffer) {
            const v210 = String(buffer);
            const v211 = _.trim(v210);
            const v212 = spawnLog.info(v211);
            v212;
            const v213 = String(buffer);
            stdErr = stdErr + v213;
        };
        const v215 = run.on('error', v214);
        v215;
        const v227 = function (code) {
            const v216 = 'Run exited with code: ' + code;
            const v217 = spawnLog.info(v216);
            v217;
            const v218 = code !== 0;
            if (v218) {
                const v219 = 'code' + code;
                const v220 = v219 + 'err:';
                const v221 = v220 + stdErr;
                const v222 = v221 + 'more:';
                const v223 = v222 + stdOut;
                const v224 = new VError(v223);
                const v225 = reject(v224);
                v225;
            } else {
                const v226 = resolve(stdOut);
                v226;
            }
        };
        const v228 = run.on('close', v227);
        v228;
    };
    const v230 = new Promise(v229);
    return v230;
};
exports.spawn = v231;
const v237 = function (s, platform) {
    const v232 = process.platform;
    var p = platform || v232;
    const v233 = _.isArray(s);
    if (v233) {
        s = s.join(' ');
    }
    const v234 = p === 'win32';
    if (v234) {
        const v235 = s.replace(/ /g, '^ ');
        return v235;
    } else {
        const v236 = s.replace(/ /g, ' ');
        return v236;
    }
};
exports.escSpaces = v237;
exports.esc = esc;
const v238 = _shell.which;
exports.which = v238;