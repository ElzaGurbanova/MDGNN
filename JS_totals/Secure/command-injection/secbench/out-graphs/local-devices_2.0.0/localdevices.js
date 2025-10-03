var ip = require('ip');
var os = require('os');
var net = require('net');
var cp = require('mz/child_process');
var parseLinux = require('./parser/linux');
var parseWin32 = require('./parser/win32');
var parseRow = require('./parser');
var servers = getServers();
var lock = {};
const v92 = 1024 * 1024;
const TEN_MEGA_BYTE = v92 * 10;
const ONE_MINUTE = 60 * 1000;
const options = {};
options.maxBuffer = TEN_MEGA_BYTE;
options.timeout = ONE_MINUTE;
const findLocalDevices = function (address) {
    var key = String(address);
    const v93 = lock[key];
    const v94 = pingServer(address);
    const v95 = v94.then(arpOne);
    const v96 = pingServers();
    const v97 = v96.then(arpAll);
    let v98;
    if (address) {
        v98 = v95;
    } else {
        v98 = v97;
    }
    const v99 = unlock(key);
    const v100 = v98.then(v99);
    lock[key] = v93 || v100;
    const v101 = lock[key];
    return v101;
};
module.exports = findLocalDevices;
const getServers = function () {
    var interfaces = os.networkInterfaces();
    var result = [];
    let key;
    for (key in interfaces) {
        var addresses = interfaces[key];
        var i = addresses.length;
        let v102 = i--;
        while (v102) {
            var address = addresses[i];
            const v103 = address.family;
            const v104 = v103 === 'IPv4';
            const v105 = address.internal;
            const v106 = !v105;
            const v107 = v104 && v106;
            if (v107) {
                const v108 = address.address;
                const v109 = address.netmask;
                var subnet = ip.subnet(v108, v109);
                const v110 = subnet.firstAddress;
                var current = ip.toLong(v110);
                const v111 = subnet.lastAddress;
                const v112 = ip.toLong(v111);
                var last = v112 - 1;
                const v113 = current++;
                let v114 = v113 < last;
                while (v114) {
                    const v115 = ip.fromLong(current);
                    const v116 = result.push(v115);
                    v116;
                    v114 = v113 < last;
                }
            }
            v102 = i--;
        }
    }
    return result;
};
const pingServers = function () {
    const v117 = servers.map(pingServer);
    const v118 = Promise.all(v117);
    return v118;
};
const pingServer = function (address) {
    const v124 = function (resolve) {
        var socket = new net.Socket();
        const v119 = socket.setTimeout(1000, close);
        v119;
        const v120 = socket.connect(80, address, close);
        v120;
        const v121 = socket.once('error', close);
        v121;
        const close = function () {
            const v122 = socket.destroy();
            v122;
            const v123 = resolve(address);
            v123;
        };
    };
    const v125 = new Promise(v124);
    return v125;
};
const arpAll = function () {
    const v126 = cp.exec('arp -a', options);
    const v127 = v126.then(parseAll);
    return v127;
};
const parseAll = function (data) {
    const v128 = !data;
    const v129 = data[0];
    const v130 = !v129;
    const v131 = v128 || v130;
    if (v131) {
        const v132 = [];
        return v132;
    }
    const v133 = process.platform;
    const v134 = v133.includes('linux');
    if (v134) {
        const v135 = data[0];
        var rows = v135.split('\n');
        const v137 = function (row) {
            const v136 = parseLinux(row, servers);
            return v136;
        };
        const v138 = rows.map(v137);
        const v139 = v138.filter(Boolean);
        return v139;
    } else {
        const v140 = process.platform;
        const v141 = v140.includes('win32');
        if (v141) {
            const v142 = data[0];
            const v143 = v142.split('\n');
            var winRows = v143.splice(1);
            const v145 = function (row) {
                const v144 = parseWin32(row, servers);
                return v144;
            };
            const v146 = winRows.map(v145);
            const v147 = v146.filter(Boolean);
            return v147;
        }
    }
    const v148 = data[0];
    const v149 = v148.trim();
    const v150 = v149.split('\n');
    const v152 = function (row) {
        const v151 = parseRow(row, servers);
        return v151;
    };
    const v153 = v150.map(v152);
    const v154 = v153.filter(Boolean);
    return v154;
};
const arpOne = function (address) {
    const v155 = ip.isV4Format(address);
    const v156 = !v155;
    const v157 = ip.isV6Format(address);
    const v158 = !v157;
    const v159 = v156 && v158;
    if (v159) {
        const v160 = new Error('Invalid IP address provided.');
        const v161 = Promise.reject(v160);
        return v161;
    }
    const v162 = 'arp -n ' + address;
    const v163 = cp.exec(v162, options);
    const v164 = v163.then(parseOne);
    return v164;
};
const parseOne = function (data) {
    const v165 = !data;
    const v166 = data[0];
    const v167 = !v166;
    const v168 = v165 || v167;
    if (v168) {
        return;
    }
    const v169 = process.platform;
    const v170 = v169.includes('linux');
    if (v170) {
        const v171 = data[0];
        const v172 = v171.indexOf('no entry');
        const v173 = v172 >= 0;
        if (v173) {
            return;
        }
        const v174 = data[0];
        const v175 = v174.split('\n');
        const v176 = v175.slice(1);
        var rows = v176[0];
        const v177 = parseLinux(rows, servers, true);
        return v177;
    } else {
        const v178 = process.platform;
        const v179 = v178.includes('win32');
        if (v179) {
            return;
        }
    }
    const v180 = data[0];
    const v181 = parseRow(v180, servers);
    return v181;
};
const unlock = function (key) {
    const v182 = function (data) {
        lock[key] = null;
        return data;
    };
    return v182;
};