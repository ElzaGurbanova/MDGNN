'use strict';
const cp = require('child_process');
const UNIT_MB = 1024 * 1024;
const v67 = function (cmd, callback) {
    const v64 = 2 * UNIT_MB;
    const v65 = {
        maxBuffer: v64,
        windowsHide: true
    };
    const v66 = cp.exec(cmd, v65, callback);
    v66;
};
const v69 = function (cmd, args, options) {
    const v68 = cp.spawn(cmd, args, options);
    return v68;
};
const v76 = function (text, num) {
    let idx = 0;
    const v70 = num--;
    let v71 = v70 > 0;
    while (v71) {
        const nIdx = text.indexOf('\n', idx);
        const v72 = nIdx >= 0;
        if (v72) {
            idx = nIdx + 1;
        }
        v71 = v70 > 0;
    }
    const v73 = idx > 0;
    const v74 = text.substring(idx);
    let v75;
    if (v73) {
        v75 = v74;
    } else {
        v75 = text;
    }
    return v75;
};
const v84 = function (line, max) {
    const v77 = line.trim();
    const cols = v77.split(/\s+/);
    const v78 = cols.length;
    const v79 = v78 > max;
    if (v79) {
        const v81 = max - 1;
        const v82 = cols.slice(v81);
        const v83 = v82.join(' ');
        cols[v80] = v83;
    }
    return cols;
};
const v96 = function (text, idxes, max) {
    const lines = text.split(/(\r\n|\n|\r)/);
    const columns = [];
    const v85 = !max;
    if (v85) {
        const v86 = Math.max;
        const v87 = v86.apply(null, idxes);
        max = v87 + 1;
    }
    const v94 = line => {
        const cols = utils.split(line, max);
        const column = [];
        const v91 = idx => {
            const v88 = cols[idx];
            const v89 = v88 || '';
            const v90 = column.push(v89);
            v90;
        };
        const v92 = idxes.forEach(v91);
        v92;
        const v93 = columns.push(column);
        v93;
    };
    const v95 = lines.forEach(v94);
    v95;
    return columns;
};
const v126 = function (data) {
    const v97 = data.split(/(\r\n|\n|\r)/);
    const v101 = line => {
        const v98 = line.trim();
        const v99 = v98.length;
        const v100 = v99 > 0;
        return v100;
    };
    const lines = v97.filter(v101);
    const v102 = lines.shift();
    const v103 = v102.trim();
    const matches = v103.match(/(\w+\s*)/g);
    const v104 = !matches;
    if (v104) {
        const v105 = [];
        return v105;
    }
    const ranges = [];
    const v115 = (col, i) => {
        const range = [];
        const v106 = i === 0;
        if (v106) {
            range[0] = 0;
            const v107 = col.length;
            range[1] = v107;
        } else {
            const v108 = i - 1;
            const v109 = ranges[v108];
            const v110 = v109[1];
            range[0] = v110;
            const v111 = range[0];
            const v112 = col.length;
            range[1] = v111 + v112;
        }
        const v113 = ranges.push(range);
        v113;
        const v114 = col.trim();
        return v114;
    };
    const headers = matches.map(v115);
    const v116 = ranges.length;
    const v117 = v116 - 1;
    const v118 = ranges[v117];
    v118[1] = Infinity;
    const v124 = line => {
        const row = {};
        const v122 = (r, i) => {
            const key = headers[i];
            const v119 = r[0];
            const v120 = r[1];
            const v121 = line.substring(v119, v120);
            const value = v121.trim();
            row[key] = value;
        };
        const v123 = ranges.forEach(v122);
        v123;
        return row;
    };
    const v125 = lines.map(v124);
    return v125;
};
const utils = {};
utils.exec = v67;
utils.spawn = v69;
utils.stripLine = v76;
utils.split = v84;
utils.extractColumns = v96;
utils.parseTable = v126;
module.exports = utils;