var stat = function (child_process, path) {
    this.child_process = child_process;
    this.path = path;
};
const v93 = stat.prototype;
const v100 = function (path) {
    const v94 = path === '';
    if (v94) {
        return '';
    }
    const v95 = this.path;
    const v96 = v95.isAbsolute(path);
    if (v96) {
        return path;
    }
    const v97 = this.path;
    const v98 = process.cwd();
    const v99 = v97.join(v98, path);
    return v99;
};
v93._ensureAbsPath = v100;
const v101 = stat.prototype;
const v122 = function (response) {
    const v102 = response.split('\n');
    const lines = v102.slice(1);
    const ret = {};
    const v120 = line => {
        const v103 = line.replace(/  /g, ' ');
        const v104 = v103.trim();
        const v105 = v104.split(' ');
        const v108 = (sum, a) => {
            const v106 = a !== '';
            if (v106) {
                const v107 = sum.push(a);
                v107;
            }
            return sum;
        };
        const v109 = [];
        const parts = v105.reduce(v108, v109);
        const v110 = parts.length;
        const v111 = v110 >= 4;
        if (v111) {
            const v112 = parts[0];
            const v113 = parts[1];
            const v114 = parseInt(v113);
            const v115 = parts[2];
            const v116 = parseInt(v115);
            const v117 = parts[3];
            const v118 = parseInt(v117);
            const v119 = {};
            v119.total = v114;
            v119.used = v116;
            v119.free = v118;
            ret[v112] = v119;
        }
    };
    const v121 = lines.forEach(v120);
    v121;
    return ret;
};
v101._parseResponse = v122;
const v123 = stat.prototype;
const v134 = function (path) {
    const v132 = (resolve, reject) => {
        const v124 = this.child_process;
        const v125 = this._ensureAbsPath(path);
        const v126 = 'df ' + v125;
        const v130 = (err, stdout) => {
            if (err) {
                const v127 = reject(err);
                return v127;
            }
            const v128 = this._parseResponse(stdout);
            const v129 = resolve(v128);
            return v129;
        };
        const v131 = v124.exec(v126, v130);
        v131;
    };
    const v133 = new Promise(v132);
    return v133;
};
v123._fetchSpace = v134;
const v135 = stat.prototype;
const v146 = function (path) {
    const v144 = (resolve, reject) => {
        const v136 = this.child_process;
        const v137 = this._ensureAbsPath(path);
        const v138 = 'df -i ' + v137;
        const v142 = (err, stdout) => {
            if (err) {
                const v139 = reject(err);
                return v139;
            }
            const v140 = this._parseResponse(stdout);
            const v141 = resolve(v140);
            return v141;
        };
        const v143 = v136.exec(v138, v142);
        v143;
    };
    const v145 = new Promise(v144);
    return v145;
};
v135._fetchInodes = v146;
const v147 = stat.prototype;
const v149 = function (cb) {
    const v148 = this.check('', cb);
    return v148;
};
v147.all = v149;
const v150 = stat.prototype;
const v180 = function (path, cb) {
    const v178 = (resolve, reject) => {
        var store = {};
        const v151 = this._fetchSpace(path);
        const v153 = space => {
            store = space;
            const v152 = this._fetchInodes(path);
            return v152;
        };
        const v154 = v151.then(v153);
        const v175 = inodes => {
            var count = 0;
            var singleDrive = null;
            const v155 = Object.keys(inodes);
            const v162 = drive => {
                const v156 = store[drive];
                const v157 = typeof v156;
                const v158 = v157 !== 'undefined';
                if (v158) {
                    const v159 = store[drive];
                    const v160 = inodes[drive];
                    v159.inodes = v160;
                    const v161 = count++;
                    v161;
                    singleDrive = drive;
                }
            };
            const v163 = v155.forEach(v162);
            v163;
            const v164 = typeof cb;
            const v165 = v164 === 'function';
            const v166 = cb && v165;
            if (v166) {
                const v167 = count !== 1;
                const v168 = store[singleDrive];
                let v169;
                if (v167) {
                    v169 = store;
                } else {
                    v169 = v168;
                }
                const v170 = cb(null, v169);
                v170;
            }
            const v171 = count !== 1;
            const v172 = store[singleDrive];
            let v173;
            if (v171) {
                v173 = store;
            } else {
                v173 = v172;
            }
            const v174 = resolve(v173);
            return v174;
        };
        const v176 = v154.then(v175);
        const v177 = v176.catch(cb);
        v177;
    };
    const v179 = new Promise(v178);
    return v179;
};
v150.check = v180;
const v184 = function (child_process, path) {
    const v181 = !child_process;
    if (v181) {
        child_process = require('child_process');
    }
    const v182 = !path;
    if (v182) {
        path = require('path');
    }
    const v183 = new stat(child_process, path);
    return v183;
};
module.exports = v184;