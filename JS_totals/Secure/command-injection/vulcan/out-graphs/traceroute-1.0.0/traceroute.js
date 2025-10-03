'use strict';
const Child = require('child_process');
const Dns = require('dns');
const Net = require('net');
const Os = require('os');
const internals = {};
const v79 = Os.platform();
const v80 = /^win/.test(v79);
internals.isWin = v80;
const v81 = {};
internals.Traceroute = v81;
module.exports = internals.Traceroute;
const v82 = internals.Traceroute;
const v113 = function (host, callback) {
    const v83 = host.toUpperCase();
    const v111 = err => {
        const v84 = Net.isIP(host);
        const v85 = v84 === 0;
        const v86 = err && v85;
        if (v86) {
            const v87 = new Error('Invalid host');
            const v88 = callback(v87);
            return v88;
        }
        let command;
        const v89 = internals.isWin;
        if (v89) {
            command = 'tracert';
        } else {
            command = 'traceroute';
        }
        let args;
        const v90 = internals.isWin;
        const v91 = [
            '-d',
            host
        ];
        const v92 = [
            '-q',
            1,
            '-n',
            host
        ];
        if (v90) {
            args = v91;
        } else {
            args = v92;
        }
        const traceroute = Child.spawn(command, args);
        const hops = [];
        let counter = 0;
        const v93 = traceroute.stdout;
        const v106 = data => {
            const v94 = ++counter;
            v94;
            const v95 = internals.isWin;
            const v96 = !v95;
            const v97 = counter < 2;
            const v98 = v96 && v97;
            const v99 = internals.isWin;
            const v100 = counter < 5;
            const v101 = v99 && v100;
            const v102 = v98 || v101;
            if (v102) {
                return null;
            }
            const v103 = data.toString();
            const result = v103.replace(/\n$/, '');
            const v104 = !result;
            if (v104) {
                return null;
            }
            const hop = internals.parseHop(result);
            const v105 = hops.push(hop);
            v105;
        };
        const v107 = v93.on('data', v106);
        v107;
        const v109 = code => {
            if (callback) {
                const v108 = callback(null, hops);
                return v108;
            }
        };
        const v110 = traceroute.on('close', v109);
        v110;
        return traceroute;
    };
    const v112 = Dns.lookup(v83, v111);
    v112;
};
v82.trace = v113;
const v129 = function (hop) {
    let line = hop.replace(/\*/g, '0');
    const v114 = internals.isWin;
    if (v114) {
        line = line.replace(/\</g, '');
    }
    const s = line.split(' ');
    const v115 = s.length;
    let i = v115 - 1;
    const v116 = -1;
    let v117 = i > v116;
    while (v117) {
        const v119 = s[i];
        const v120 = v119 === '';
        const v121 = s[i];
        const v122 = v121 === 'ms';
        const v123 = v120 || v122;
        if (v123) {
            const v124 = s.splice(i, 1);
            v124;
        }
        const v118 = --i;
        v117 = i > v116;
    }
    const v125 = internals.isWin;
    const v126 = internals.parseHopWin(s);
    const v127 = internals.parseHopNix(s);
    let v128;
    if (v125) {
        v128 = v126;
    } else {
        v128 = v127;
    }
    return v128;
};
internals.parseHop = v129;
const v139 = function (line) {
    const v130 = line[4];
    const v131 = v130 === 'Request';
    if (v131) {
        return false;
    }
    const hop = {};
    const v132 = line[4];
    const v133 = line[1];
    const v134 = +v133;
    const v135 = line[2];
    const v136 = +v135;
    const v137 = line[3];
    const v138 = +v137;
    hop[v132] = [
        v134,
        v136,
        v138
    ];
    return hop;
};
internals.parseHopWin = v139;
const v156 = function (line) {
    const v140 = line[1];
    const v141 = v140 === '0';
    if (v141) {
        return false;
    }
    const hop = {};
    let lastip = line[1];
    const v142 = line[1];
    const v143 = line[2];
    const v144 = +v143;
    hop[v142] = [v144];
    let i = 3;
    const v145 = line.length;
    let v146 = i < v145;
    while (v146) {
        const v148 = line[i];
        const v149 = Net.isIP(v148);
        if (v149) {
            lastip = line[i];
            const v150 = hop[lastip];
            const v151 = !v150;
            if (v151) {
                hop[lastip] = [];
            }
        } else {
            const v152 = hop[lastip];
            const v153 = line[i];
            const v154 = +v153;
            const v155 = v152.push(v154);
            v155;
        }
        const v147 = ++i;
        v146 = i < v145;
    }
    return hop;
};
internals.parseHopNix = v156;