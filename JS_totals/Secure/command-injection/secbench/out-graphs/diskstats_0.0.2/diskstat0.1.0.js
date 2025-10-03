var stat = function (child_process, path) {
    this.child_process = child_process;
    this.path = path;
};
const v119 = stat.prototype;
const v126 = function (path) {
    const v120 = path === '';
    if (v120) {
        return '';
    }
    const v121 = this.path;
    const v122 = v121.isAbsolute(path);
    if (v122) {
        return path;
    }
    const v123 = this.path;
    const v124 = process.cwd();
    const v125 = v123.join(v124, path);
    return v125;
};
v119._ensureAbsPath = v126;
const v127 = stat.prototype;
const v148 = function (response) {
    const v128 = response.split('\n');
    const lines = v128.slice(1);
    const ret = {};
    const v146 = line => {
        const v129 = line.replace(/  /g, ' ');
        const v130 = v129.trim();
        const v131 = v130.split(' ');
        const v134 = (sum, a) => {
            const v132 = a !== '';
            if (v132) {
                const v133 = sum.push(a);
                v133;
            }
            return sum;
        };
        const v135 = [];
        const parts = v131.reduce(v134, v135);
        const v136 = parts.length;
        const v137 = v136 >= 4;
        if (v137) {
            const v138 = parts[0];
            const v139 = parts[1];
            const v140 = parseInt(v139);
            const v141 = parts[2];
            const v142 = parseInt(v141);
            const v143 = parts[3];
            const v144 = parseInt(v143);
            const v145 = {};
            v145.total = v140;
            v145.used = v142;
            v145.free = v144;
            ret[v138] = v145;
        }
    };
    const v147 = lines.forEach(v146);
    v147;
    return ret;
};
v127._parseResponse = v148;
const v149 = stat.prototype;
const v170 = function (path) {
    const v168 = (resolve, reject) => {
        const v150 = this.child_process;
        const v151 = this._ensureAbsPath(path);
        const v152 = [v151];
        const v153 = process.cwd();
        const v154 = { cwd: v153 };
        const proc = v150.spawn('df', v152, v154);
        let stdout = '';
        const v155 = proc.stdout;
        const v156 = _data => {
            stdout += _data.toString('utf8');
        };
        const v157 = v155.on('data', v156);
        v157;
        let stderr = '';
        const v158 = proc.stderr;
        const v159 = _data => {
            stderr += _data.toString('utf8');
        };
        const v160 = v158.on('data', v159);
        v160;
        const v166 = code => {
            const v161 = code !== 0;
            if (v161) {
                const v162 = new Error(stderr);
                const v163 = reject(v162);
                return v163;
            }
            const v164 = this._parseResponse(stdout);
            const v165 = resolve(v164);
            return v165;
        };
        const v167 = proc.on('close', v166);
        v167;
    };
    const v169 = new Promise(v168);
    return v169;
};
v149._fetchSpace = v170;
const v171 = stat.prototype;
const v192 = function (path) {
    const v190 = (resolve, reject) => {
        const v172 = this.child_process;
        const v173 = this._ensureAbsPath(path);
        const v174 = [
            '-i',
            v173
        ];
        const v175 = process.cwd();
        const v176 = { cwd: v175 };
        const proc = v172.spawn('df', v174, v176);
        let stdout = '';
        const v177 = proc.stdout;
        const v178 = _data => {
            stdout += _data.toString('utf8');
        };
        const v179 = v177.on('data', v178);
        v179;
        let stderr = '';
        const v180 = proc.stderr;
        const v181 = _data => {
            stderr += _data.toString('utf8');
        };
        const v182 = v180.on('data', v181);
        v182;
        const v188 = code => {
            const v183 = code !== 0;
            if (v183) {
                const v184 = new Error(stderr);
                const v185 = reject(v184);
                return v185;
            }
            const v186 = this._parseResponse(stdout);
            const v187 = resolve(v186);
            return v187;
        };
        const v189 = proc.on('close', v188);
        v189;
    };
    const v191 = new Promise(v190);
    return v191;
};
v171._fetchInodes = v192;
const v193 = stat.prototype;
const v195 = function (cb) {
    const v194 = this.check('', cb);
    return v194;
};
v193.all = v195;
const v196 = stat.prototype;
const v232 = function (path, cb) {
    const v230 = (resolve, reject) => {
        var store = {};
        const v197 = this._fetchSpace(path);
        const v199 = space => {
            store = space;
            const v198 = this._fetchInodes(path);
            return v198;
        };
        const v200 = v197.then(v199);
        const v221 = inodes => {
            var count = 0;
            var singleDrive = null;
            const v201 = Object.keys(inodes);
            const v208 = drive => {
                const v202 = store[drive];
                const v203 = typeof v202;
                const v204 = v203 !== 'undefined';
                if (v204) {
                    const v205 = store[drive];
                    const v206 = inodes[drive];
                    v205.inodes = v206;
                    const v207 = count++;
                    v207;
                    singleDrive = drive;
                }
            };
            const v209 = v201.forEach(v208);
            v209;
            const v210 = typeof cb;
            const v211 = v210 === 'function';
            const v212 = cb && v211;
            if (v212) {
                const v213 = count !== 1;
                const v214 = store[singleDrive];
                let v215;
                if (v213) {
                    v215 = store;
                } else {
                    v215 = v214;
                }
                const v216 = cb(null, v215);
                v216;
            }
            const v217 = count !== 1;
            const v218 = store[singleDrive];
            let v219;
            if (v217) {
                v219 = store;
            } else {
                v219 = v218;
            }
            const v220 = resolve(v219);
            return v220;
        };
        const v222 = v200.then(v221);
        const v228 = err => {
            const v223 = typeof cb;
            const v224 = v223 === 'function';
            const v225 = cb && v224;
            if (v225) {
                const v226 = cb(err);
                v226;
            }
            const v227 = reject(err);
            return v227;
        };
        const v229 = v222.catch(v228);
        v229;
    };
    const v231 = new Promise(v230);
    return v231;
};
v196.check = v232;
const v236 = function (child_process, path) {
    const v233 = !child_process;
    if (v233) {
        child_process = require('child_process');
    }
    const v234 = !path;
    if (v234) {
        path = require('path');
    }
    const v235 = new stat(child_process, path);
    return v235;
};
module.exports = v236;