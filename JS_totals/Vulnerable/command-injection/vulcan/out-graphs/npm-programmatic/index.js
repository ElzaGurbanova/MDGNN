const Promise = require('bluebird');
const v126 = require('child_process');
const exec = v126.exec;
const v178 = function (packages, opts) {
    const v127 = packages.length;
    const v128 = v127 == 0;
    const v129 = !packages;
    const v130 = v128 || v129;
    const v131 = packages.length;
    const v132 = !v131;
    const v133 = v130 || v132;
    if (v133) {
        const v134 = Promise.reject('No packages found');
        return v134;
    }
    const v135 = typeof packages;
    const v136 = v135 == 'string';
    if (v136) {
        packages = [packages];
    }
    const v137 = !opts;
    if (v137) {
        opts = {};
    }
    const v138 = packages.join(' ');
    const v139 = 'npm install ' + v138;
    const v140 = v139 + ' ';
    const v141 = opts.global;
    let v142;
    if (v141) {
        v142 = ' -g';
    } else {
        v142 = '';
    }
    const v143 = v140 + v142;
    const v144 = opts.save;
    let v145;
    if (v144) {
        v145 = ' --save';
    } else {
        v145 = ' --no-save';
    }
    const v146 = v143 + v145;
    const v147 = opts.saveDev;
    let v148;
    if (v147) {
        v148 = ' --save-dev';
    } else {
        v148 = '';
    }
    const v149 = v146 + v148;
    const v150 = opts.legacyBundling;
    let v151;
    if (v150) {
        v151 = ' --legacy-bundling';
    } else {
        v151 = '';
    }
    const v152 = v149 + v151;
    const v153 = opts.noOptional;
    let v154;
    if (v153) {
        v154 = ' --no-optional';
    } else {
        v154 = '';
    }
    const v155 = v152 + v154;
    const v156 = opts.ignoreScripts;
    let v157;
    if (v156) {
        v157 = ' --ignore-scripts';
    } else {
        v157 = '';
    }
    var cmdString = v155 + v157;
    const v176 = function (resolve, reject) {
        const v158 = opts.cwd;
        const v159 = opts.cwd;
        let v160;
        if (v158) {
            v160 = v159;
        } else {
            v160 = '/';
        }
        const v161 = opts.maxBuffer;
        const v162 = opts.maxBuffer;
        const v163 = 200 * 1024;
        let v164;
        if (v161) {
            v164 = v162;
        } else {
            v164 = v163;
        }
        const v165 = {
            cwd: v160,
            maxBuffer: v164
        };
        const v168 = (error, stdout, stderr) => {
            if (error) {
                const v166 = reject(error);
                v166;
            } else {
                const v167 = resolve(true);
                v167;
            }
        };
        var cmd = exec(cmdString, v165, v168);
        const v169 = opts.output;
        if (v169) {
            var consoleOutput = function (msg) {
                const v170 = 'npm: ' + msg;
                const v171 = console.log(v170);
                v171;
            };
            const v172 = cmd.stdout;
            const v173 = v172.on('data', consoleOutput);
            v173;
            const v174 = cmd.stderr;
            const v175 = v174.on('data', consoleOutput);
            v175;
        }
    };
    const v177 = new Promise(v176);
    return v177;
};
const v218 = function (packages, opts) {
    const v179 = packages.length;
    const v180 = v179 == 0;
    const v181 = !packages;
    const v182 = v180 || v181;
    const v183 = packages.length;
    const v184 = !v183;
    const v185 = v182 || v184;
    if (v185) {
        const v186 = new Error('No packages found');
        const v187 = Promise.reject(v186);
        return v187;
    }
    const v188 = typeof packages;
    const v189 = v188 == 'string';
    if (v189) {
        packages = [packages];
    }
    const v190 = !opts;
    if (v190) {
        opts = {};
    }
    const v191 = packages.join(' ');
    const v192 = 'npm uninstall ' + v191;
    const v193 = v192 + ' ';
    const v194 = opts.global;
    let v195;
    if (v194) {
        v195 = ' -g';
    } else {
        v195 = '';
    }
    const v196 = v193 + v195;
    const v197 = opts.save;
    let v198;
    if (v197) {
        v198 = ' --save';
    } else {
        v198 = ' --no-save';
    }
    const v199 = v196 + v198;
    const v200 = opts.saveDev;
    let v201;
    if (v200) {
        v201 = ' --saveDev';
    } else {
        v201 = '';
    }
    var cmdString = v199 + v201;
    const v216 = function (resolve, reject) {
        const v202 = opts.cwd;
        const v203 = opts.cwd;
        let v204;
        if (v202) {
            v204 = v203;
        } else {
            v204 = '/';
        }
        const v205 = { cwd: v204 };
        const v208 = (error, stdout, stderr) => {
            if (error) {
                const v206 = reject(error);
                v206;
            } else {
                const v207 = resolve(true);
                v207;
            }
        };
        var cmd = exec(cmdString, v205, v208);
        const v209 = opts.output;
        if (v209) {
            var consoleOutput = function (msg) {
                const v210 = 'npm: ' + msg;
                const v211 = console.log(v210);
                v211;
            };
            const v212 = cmd.stdout;
            const v213 = v212.on('data', consoleOutput);
            v213;
            const v214 = cmd.stderr;
            const v215 = v214.on('data', consoleOutput);
            v215;
        }
    };
    const v217 = new Promise(v216);
    return v217;
};
const v249 = function (path) {
    var global = false;
    const v219 = !path;
    if (v219) {
        global = true;
    }
    let v220;
    if (global) {
        v220 = '-g ';
    } else {
        v220 = ' ';
    }
    var cmdString = 'npm ls --depth=0 ' + v220;
    const v247 = function (resolve, reject) {
        let v221;
        if (path) {
            v221 = path;
        } else {
            v221 = '/';
        }
        const v222 = { cwd: v221 };
        const v245 = (error, stdout, stderr) => {
            const v223 = stderr !== '';
            if (v223) {
                const v224 = stderr.indexOf('missing');
                const v225 = -1;
                const v226 = v224 == v225;
                const v227 = stderr.indexOf('required');
                const v228 = -1;
                const v229 = v227 == v228;
                const v230 = v226 && v229;
                if (v230) {
                    const v231 = reject(error);
                    return v231;
                }
            }
            var packages = [];
            packages = stdout.split('\n');
            const v236 = function (item) {
                const v232 = item.match(/^├──.+/g);
                const v233 = v232 != null;
                if (v233) {
                    return true;
                }
                const v234 = item.match(/^└──.+/g);
                const v235 = v234 != null;
                if (v235) {
                    return true;
                }
                return undefined;
            };
            packages = packages.filter(v236);
            const v243 = function (item) {
                const v237 = item.match(/^├──.+/g);
                const v238 = v237 != null;
                if (v238) {
                    const v239 = item.replace(/^├──\s/g, '');
                    return v239;
                }
                const v240 = item.match(/^└──.+/g);
                const v241 = v240 != null;
                if (v241) {
                    const v242 = item.replace(/^└──\s/g, '');
                    return v242;
                }
            };
            packages = packages.map(v243);
            const v244 = resolve(packages);
            v244;
        };
        const v246 = exec(cmdString, v222, v245);
        v246;
    };
    const v248 = new Promise(v247);
    return v248;
};
const v250 = {};
v250.install = v178;
v250.uninstall = v218;
v250.list = v249;
module.exports = v250;