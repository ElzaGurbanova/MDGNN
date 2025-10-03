'use strict';
const Child = require('child_process');
const Dns = require('dns');
const Net = require('net');
const Os = require('os');
const internals = {};
const v81 = Os.platform();
const v82 = /^win/.test(v81);
internals.isWin = v82;
const v83 = {};
internals.Traceroute = v83;
module.exports = internals.Traceroute;
const v84 = internals.Traceroute;
const v99 = function (host, callback) {
    const v85 = host.toUpperCase();
    const v97 = err => {
        const v86 = Net.isIP(host);
        const v87 = v86 === 0;
        const v88 = err && v87;
        if (v88) {
            const v89 = new Error('Invalid host');
            const v90 = callback(v89);
            return v90;
        }
        const v91 = internals.isWin;
        let v92;
        if (v91) {
            v92 = 'tracert -d ';
        } else {
            v92 = 'traceroute -q 1 -n ';
        }
        const command = v92 + host;
        const v95 = (err, stdout, stderr) => {
            if (err) {
                const v93 = callback(err);
                return v93;
            }
            const results = internals.parseOutput(stdout);
            const v94 = callback(null, results);
            return v94;
        };
        const v96 = Child.exec(command, v95);
        v96;
    };
    const v98 = Dns.lookup(v85, v97);
    v98;
};
v84.trace = v99;
const v115 = function (hop) {
    let line = hop.replace(/\*/g, '0');
    const v100 = internals.isWin;
    if (v100) {
        line = line.replace(/\</g, '');
    }
    const s = line.split(' ');
    const v101 = s.length;
    let i = v101 - 1;
    const v102 = -1;
    let v103 = i > v102;
    while (v103) {
        const v105 = s[i];
        const v106 = v105 === '';
        const v107 = s[i];
        const v108 = v107 === 'ms';
        const v109 = v106 || v108;
        if (v109) {
            const v110 = s.splice(i, 1);
            v110;
        }
        const v104 = --i;
        v103 = i > v102;
    }
    const v111 = internals.isWin;
    const v112 = internals.parseHopWin(s);
    const v113 = internals.parseHopNix(s);
    let v114;
    if (v111) {
        v114 = v112;
    } else {
        v114 = v113;
    }
    return v114;
};
internals.parseHop = v115;
const v125 = function (line) {
    const v116 = line[4];
    const v117 = v116 === 'Request';
    if (v117) {
        return false;
    }
    const hop = {};
    const v118 = line[4];
    const v119 = line[1];
    const v120 = +v119;
    const v121 = line[2];
    const v122 = +v121;
    const v123 = line[3];
    const v124 = +v123;
    hop[v118] = [
        v120,
        v122,
        v124
    ];
    return hop;
};
internals.parseHopWin = v125;
const v142 = function (line) {
    const v126 = line[1];
    const v127 = v126 === '0';
    if (v127) {
        return false;
    }
    const hop = {};
    let lastip = line[1];
    const v128 = line[1];
    const v129 = line[2];
    const v130 = +v129;
    hop[v128] = [v130];
    let i = 3;
    const v131 = line.length;
    let v132 = i < v131;
    while (v132) {
        const v134 = line[i];
        const v135 = Net.isIP(v134);
        if (v135) {
            lastip = line[i];
            const v136 = hop[lastip];
            const v137 = !v136;
            if (v137) {
                hop[lastip] = [];
            }
        } else {
            const v138 = hop[lastip];
            const v139 = line[i];
            const v140 = +v139;
            const v141 = v138.push(v140);
            v141;
        }
        const v133 = ++i;
        v132 = i < v131;
    }
    return hop;
};
internals.parseHopNix = v142;
const v160 = function (output) {
    const lines = output.split('\n');
    const hops = [];
    const v143 = lines.shift();
    v143;
    const v144 = lines.pop();
    v144;
    const v145 = internals.isWin;
    if (v145) {
        let i = 0;
        const v146 = lines.length;
        let v147 = i < v146;
        while (v147) {
            const v149 = lines[i];
            const v150 = /^\s+1/.test(v149);
            if (v150) {
                break;
            }
            const v148 = ++i;
            v147 = i < v146;
        }
        const v151 = lines.splice(0, i);
        v151;
        const v152 = lines.pop();
        v152;
        const v153 = lines.pop();
        v153;
    }
    let i = 0;
    const v154 = lines.length;
    let v155 = i < v154;
    while (v155) {
        const v157 = lines[i];
        const v158 = internals.parseHop(v157);
        const v159 = hops.push(v158);
        v159;
        const v156 = ++i;
        v155 = i < v154;
    }
    return hops;
};
internals.parseOutput = v160;