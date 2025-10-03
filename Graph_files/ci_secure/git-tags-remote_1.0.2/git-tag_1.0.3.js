'use strict';
const v61 = !0;
const v62 = { value: v61 };
const v63 = Object.defineProperty(exports, '__esModule', v62);
const v64 = void 0;
exports.get = v64;
v63, exports.latest = exports.get;
const e = require('tslib');
const t = require('semver');
const r = require('child_process');
const v107 = s => {
    const v65 = void 0;
    const v66 = void 0;
    const v67 = void 0;
    const v105 = function* () {
        const v90 = e => {
            const r = new Map();
            const v68 = e.split('\n');
            const v75 = e => {
                const t = e.split(/\t/);
                const v69 = t[1];
                const v70 = v69.split('/');
                const v71 = v70[2];
                const v72 = v71.replace(/\^\{\}$/, '');
                const v73 = t[0];
                const v74 = r.set(v72, v73);
                v74;
            };
            const v76 = v68.forEach(v75);
            const v77 = r.entries();
            const v78 = [...v77];
            const v81 = e => {
                const v79 = e[0];
                const v80 = t.valid(v79);
                return v80;
            };
            const v82 = v78.filter(v81);
            const v86 = (e, r) => {
                const v83 = e[0];
                const v84 = r[0];
                const v85 = t.compare(v83, v84);
                return v85;
            };
            const v87 = v82.sort(v86);
            const v88 = v87.reverse();
            const v89 = new Map(v88);
            return v76, v89;
        };
        const v102 = e => {
            const v100 = (t, s) => {
                const v91 = 'git ls-remote --tags ' + e;
                const v98 = (e, r, o) => {
                    const v92 = new Error(o);
                    const v93 = s(v92);
                    const v94 = o && v93;
                    const v95 = r.toString();
                    const v96 = v95.trim();
                    const v97 = t(v96);
                    v94, v97;
                };
                const v99 = r.exec(v91, v98);
                v99;
            };
            const v101 = new Promise(v100);
            return v101;
        };
        const v103 = v102(s);
        const v104 = v90(yield v103);
        return v104;
    };
    const v106 = e.__awaiter(v65, v66, v67, v105);
    return v106;
};
const v117 = t => {
    const v108 = void 0;
    const v109 = void 0;
    const v110 = void 0;
    const v115 = function* () {
        const v111 = exports.get(t);
        const v112 = (yield v111).entries();
        const v113 = v112.next();
        const v114 = v113.value;
        return v114;
    };
    const v116 = e.__awaiter(v108, v109, v110, v115);
    return v116;
};
const v118 = exports.get;
const v119 = exports.latest;
const v120 = {};
v120.get = v118;
v120.latest = v119;
exports.get = v107, exports.latest = v117, module.exports = v120;