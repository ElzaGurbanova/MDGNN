var cp = require('child_process');
const v118 = function (pid, fn) {
    const v93 = typeof pid;
    const v94 = v93 === 'function';
    if (v94) {
        fn = pid;
        const v95 = process.pid;
        pid = parseInt(v95);
    }
    const v96 = 'lsof -p ' + pid;
    const v116 = function (err, d) {
        d = d.split('\n');
        var data = [];
        const v97 = d[0];
        const v98 = v97.toLowerCase();
        var headers = v98.split(/\s+/);
        const v102 = function (v, k) {
            const v99 = v === '';
            if (v99) {
                const v100 = headers[k];
                const v101 = delete v100;
                v101;
            }
        };
        const v103 = headers.forEach(v102);
        v103;
        const v104 = d[0];
        const v105 = delete v104;
        v105;
        const v106 = d.pop();
        v106;
        const v113 = function (v) {
            v = v.split(/\s+/);
            const v107 = v[4];
            const v108 = v107 === 'KQUEUE';
            if (v108) {
                return;
            }
            var k = {};
            const v110 = function (s, i) {
                const v109 = headers[i];
                k[v109] = s;
            };
            const v111 = v.forEach(v110);
            v111;
            const v112 = data.push(k);
            v112;
        };
        const v114 = d.forEach(v113);
        v114;
        const v115 = fn(data);
        v115;
    };
    const v117 = cp.exec(v96, v116);
    v117;
};
exports.raw = v118;
var raw = exports.raw;
const v145 = function (port, fn) {
    const v119 = 'lsof -i tcp:' + port;
    const v143 = function (err, d) {
        d = d.split('\n');
        var data = [];
        const v120 = d[0];
        const v121 = v120.toLowerCase();
        var headers = v121.split(/\s+/);
        const v125 = function (v, k) {
            const v122 = v === '';
            if (v122) {
                const v123 = headers[k];
                const v124 = delete v123;
                v124;
            }
        };
        const v126 = headers.forEach(v125);
        v126;
        const v127 = d[0];
        const v128 = delete v127;
        v128;
        const v129 = d.pop();
        v129;
        const v140 = function (v) {
            v = v.split(/\s+/);
            var k = {};
            const v130 = headers.length;
            var finalField = v[v130];
            if (finalField) {
                const v131 = finalField.length;
                const v132 = v131 - 1;
                const v133 = finalField.substring(1, v132);
                const v134 = v133.toLowerCase();
                k['state'] = v134;
                const v135 = v.pop();
                v135;
            }
            const v137 = function (s, i) {
                const v136 = headers[i];
                k[v136] = s;
            };
            const v138 = v.forEach(v137);
            v138;
            const v139 = data.push(k);
            v139;
        };
        const v141 = d.forEach(v140);
        v141;
        const v142 = fn(data);
        v142;
    };
    const v144 = cp.exec(v119, v143);
    v144;
};
exports.rawTcpPort = v145;
var rawTcpPort = exports.rawTcpPort;
const v166 = function (port, fn) {
    const v146 = 'lsof -i udp:' + port;
    const v164 = function (err, d) {
        d = d.split('\n');
        var data = [];
        const v147 = d[0];
        const v148 = v147.toLowerCase();
        var headers = v148.split(/\s+/);
        const v152 = function (v, k) {
            const v149 = v === '';
            if (v149) {
                const v150 = headers[k];
                const v151 = delete v150;
                v151;
            }
        };
        const v153 = headers.forEach(v152);
        v153;
        const v154 = d[0];
        const v155 = delete v154;
        v155;
        const v156 = d.pop();
        v156;
        const v161 = function (v) {
            v = v.split(/\s+/);
            var k = {};
            const v158 = function (s, i) {
                const v157 = headers[i];
                k[v157] = s;
            };
            const v159 = v.forEach(v158);
            v159;
            const v160 = data.push(k);
            v160;
        };
        const v162 = d.forEach(v161);
        v162;
        const v163 = fn(data);
        v163;
    };
    const v165 = cp.exec(v146, v164);
    v165;
};
exports.rawUdpPort = v166;
var rawUdpPort = exports.rawUdpPort;
const v184 = function (pid, fn) {
    const v167 = typeof pid;
    const v168 = v167 === 'function';
    if (v168) {
        fn = pid;
        const v169 = process.pid;
        pid = parseInt(v169);
    }
    const v182 = function (data) {
        var t = {};
        const v175 = function (v) {
            if (v) {
                const v170 = v.type;
                var ty = v170.toLowerCase();
                const v171 = t[ty];
                const v172 = !v171;
                if (v172) {
                    t[ty] = 0;
                }
                const v173 = t[ty];
                const v174 = v173++;
                v174;
            }
        };
        const v176 = data.forEach(v175);
        v176;
        let user;
        const v177 = data[0];
        const v178 = data[0];
        const v179 = v178.user;
        if (v177) {
            user = v179;
        } else {
            user = 'unknown';
        }
        const v180 = data.length;
        var d = {};
        d.pid = pid;
        d.user = user;
        d.open = v180;
        d.types = t;
        const v181 = fn(d);
        v181;
    };
    const v183 = raw(pid, v182);
    v183;
};
exports.counters = v184;
var counters = exports.counters;