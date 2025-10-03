'use strict';
const v114 = require('stream');
var Transform = v114.Transform;
var log = require('fancy-log');
const v115 = require('child_process');
var execFile = v115.execFile;
var path = require('path');
const toArgv = function (str) {
    const v116 = !str;
    const v117 = typeof str;
    const v118 = v117 !== 'string';
    const v119 = v116 || v118;
    if (v119) {
        const v120 = [];
        return v120;
    }
    var r = [];
    var m;
    var re = /"([^"]*)"|'([^']*)'|(\S+)/g;
    while (m = re.exec(str)) {
        const v121 = m[1];
        const v122 = m[2];
        const v123 = v121 || v122;
        const v124 = m[3];
        const v125 = v123 || v124;
        const v126 = r.push(v125);
        v126;
    }
    return r;
};
const v226 = function (message, opt) {
    const v127 = !opt;
    if (v127) {
        opt = {};
    }
    const v128 = !message;
    if (v128) {
        const v129 = opt.args;
        const v130 = opt.args;
        const v131 = v130.indexOf('--amend');
        const v132 = -1;
        const v133 = v131 === v132;
        const v134 = v129 && v133;
        const v135 = opt.disableMessageRequirement;
        const v136 = v135 !== true;
        const v137 = v134 && v136;
        if (v137) {
            const v138 = new Error('gulp-git: Commit message is required git.commit("commit message") or --amend arg must be given');
            throw v138;
        }
    }
    const v139 = opt.cwd;
    const v140 = !v139;
    if (v140) {
        const v141 = process.cwd();
        opt.cwd = v141;
    }
    const v142 = opt.maxBuffer;
    const v143 = !v142;
    if (v143) {
        opt.maxBuffer = 200 * 1024;
    }
    const v144 = opt.args;
    const v145 = !v144;
    if (v145) {
        opt.args = ' ';
    }
    var files = [];
    var paths = [];
    var write = function (file, enc, cb) {
        const v146 = files.push(file);
        v146;
        const v147 = opt.cwd;
        const v148 = file.path;
        const v149 = path.relative(v147, v148);
        const v150 = v149.replace('\\', '/');
        const v151 = paths.push(v150);
        v151;
        const v152 = cb();
        v152;
    };
    var flush = function (cb) {
        var writeStdin = false;
        var gitArgs = ['commit'];
        const v153 = typeof message;
        const v154 = v153 === 'function';
        if (v154) {
            message = message();
        }
        const v155 = opt.args;
        var userArgs = toArgv(v155);
        const v156 = userArgs.indexOf('--amend');
        const v157 = -1;
        var isAmend = v156 !== v157;
        const v158 = !isAmend;
        const v159 = message && v158;
        if (v159) {
            const v160 = Array.isArray(message);
            if (v160) {
                const v161 = opt.multiline;
                if (v161) {
                    writeStdin = true;
                    message = message.join('\n');
                } else {
                    var i = 0;
                    const v162 = message.length;
                    let v163 = i < v162;
                    while (v163) {
                        const v165 = message[i];
                        const v166 = String(v165);
                        const v167 = gitArgs.push('-m', v166);
                        v167;
                        const v164 = i++;
                        v163 = i < v162;
                    }
                }
                const v168 = opt.disableAppendPaths;
                const v169 = !v168;
                const v170 = paths.length;
                const v171 = v169 && v170;
                if (v171) {
                    gitArgs = gitArgs.concat(paths);
                }
            } else {
                const v172 = String(message);
                const v173 = v172.indexOf('\n');
                const v174 = -1;
                const v175 = v173 !== v174;
                if (v175) {
                    writeStdin = true;
                } else {
                    const v176 = String(message);
                    const v177 = gitArgs.push('-m', v176);
                    v177;
                }
                const v178 = opt.disableAppendPaths;
                const v179 = !v178;
                const v180 = paths.length;
                const v181 = v179 && v180;
                if (v181) {
                    gitArgs = gitArgs.concat(paths);
                }
            }
        } else {
            const v182 = opt.disableMessageRequirement;
            const v183 = v182 === true;
            if (v183) {
            } else {
                const v184 = gitArgs.push('-a');
                v184;
                const v185 = userArgs.indexOf('--no-edit');
                const v186 = -1;
                const v187 = v185 === v186;
                if (v187) {
                    const v188 = ['--no-edit'];
                    userArgs = userArgs.concat(v188);
                }
            }
        }
        const v189 = userArgs.length;
        if (v189) {
            gitArgs = gitArgs.concat(userArgs);
        }
        const v190 = opt.disableAppendPaths;
        const v191 = !v190;
        if (v191) {
            const v192 = gitArgs.push('.');
            v192;
        }
        var self = this;
        const v193 = opt.cwd;
        const v194 = opt.maxBuffer;
        const v195 = {
            cwd: v193,
            maxBuffer: v194,
            shell: false
        };
        const v209 = function (err, stdout, stderr) {
            const v196 = stdout || '';
            var outStr = String(v196);
            const v197 = outStr.indexOf('no changes added to commit');
            const v198 = v197 === 0;
            const v199 = err && v198;
            if (v199) {
                const v200 = cb(err);
                return v200;
            }
            const v201 = opt.quiet;
            const v202 = !v201;
            if (v202) {
                const v203 = log(stdout, stderr);
                v203;
            }
            const v204 = self.push;
            const v205 = v204.bind(self);
            const v206 = files.forEach(v205);
            v206;
            const v207 = self.emit('end');
            v207;
            const v208 = cb();
            return v208;
        };
        var child = execFile('git', gitArgs, v195, v209);
        if (writeStdin) {
            const v210 = child.stdin;
            const v211 = String(message);
            const v212 = v210.write(v211);
            v212;
            const v213 = child.stdin;
            const v214 = v213.end();
            v214;
        }
        const v215 = opt.emitData;
        if (v215) {
            const v216 = child.stdout;
            const v218 = function (data) {
                const v217 = self.emit('data', data);
                v217;
            };
            const v219 = v216.on('data', v218);
            v219;
            const v220 = child.stderr;
            const v222 = function (data) {
                const v221 = self.emit('data', data);
                v221;
            };
            const v223 = v220.on('data', v222);
            v223;
        }
    };
    const v224 = {
        objectMode: true,
        transform: write,
        flush
    };
    const v225 = new Transform(v224);
    return v225;
};
module.exports = v226;