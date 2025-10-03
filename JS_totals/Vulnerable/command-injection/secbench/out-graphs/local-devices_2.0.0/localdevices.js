var ip = require('ip');
var os = require('os');
var net = require('net');
var cp = require('mz/child_process');
var parseLinux = require('./parser/linux');
var parseWin32 = require('./parser/win32');
var parseRow = require('./parser');
var servers = getServers();
var lock = {};
const v85 = 1024 * 1024;
const TEN_MEGA_BYTE = v85 * 10;
const ONE_MINUTE = 60 * 1000;
const options = {};
options.maxBuffer = TEN_MEGA_BYTE;
options.timeout = ONE_MINUTE;
const findLocalDevices = function (address) {
    var key = String(address);
    const v86 = lock[key];
    const v87 = pingServer(address);
    const v88 = v87.then(arpOne);
    const v89 = pingServers();
    const v90 = v89.then(arpAll);
    let v91;
    if (address) {
        v91 = v88;
    } else {
        v91 = v90;
    }
    const v92 = unlock(key);
    const v93 = v91.then(v92);
    lock[key] = v86 || v93;
    const v94 = lock[key];
    return v94;
};
module.exports = findLocalDevices;
const getServers = function () {
    var interfaces = os.networkInterfaces();
    var result = [];
    let key;
    for (key in interfaces) {
        var addresses = interfaces[key];
        var i = addresses.length;
        let v95 = i--;
        while (v95) {
            var address = addresses[i];
            const v96 = address.family;
            const v97 = v96 === 'IPv4';
            const v98 = address.internal;
            const v99 = !v98;
            const v100 = v97 && v99;
            if (v100) {
                const v101 = address.address;
                const v102 = address.netmask;
                var subnet = ip.subnet(v101, v102);
                const v103 = subnet.firstAddress;
                var current = ip.toLong(v103);
                const v104 = subnet.lastAddress;
                const v105 = ip.toLong(v104);
                var last = v105 - 1;
                const v106 = current++;
                let v107 = v106 < last;
                while (v107) {
                    const v108 = ip.fromLong(current);
                    const v109 = result.push(v108);
                    v109;
                    v107 = v106 < last;
                }
            }
            v95 = i--;
        }
    }
    return result;
};
const pingServers = function () {
    const v110 = servers.map(pingServer);
    const v111 = Promise.all(v110);
    return v111;
};
const pingServer = function (address) {
    const v117 = function (resolve) {
        var socket = new net.Socket();
        const v112 = socket.setTimeout(1000, close);
        v112;
        const v113 = socket.connect(80, address, close);
        v113;
        const v114 = socket.once('error', close);
        v114;
        const close = function () {
            const v115 = socket.destroy();
            v115;
            const v116 = resolve(address);
            v116;
        };
    };
    const v118 = new Promise(v117);
    return v118;
};
const arpAll = function () {
    const v119 = cp.exec('arp -a', options);
    const v120 = v119.then(parseAll);
    return v120;
};
const parseAll = function (data) {
    const v121 = !data;
    const v122 = data[0];
    const v123 = !v122;
    const v124 = v121 || v123;
    if (v124) {
        const v125 = [];
        return v125;
    }
    const v126 = process.platform;
    const v127 = v126.includes('linux');
    if (v127) {
        const v128 = data[0];
        var rows = v128.split('\n');
        const v130 = function (row) {
            const v129 = parseLinux(row, servers);
            return v129;
        };
        const v131 = rows.map(v130);
        const v132 = v131.filter(Boolean);
        return v132;
    } else {
        const v133 = process.platform;
        const v134 = v133.includes('win32');
        if (v134) {
            const v135 = data[0];
            const v136 = v135.split('\n');
            var winRows = v136.splice(1);
            const v138 = function (row) {
                const v137 = parseWin32(row, servers);
                return v137;
            };
            const v139 = winRows.map(v138);
            const v140 = v139.filter(Boolean);
            return v140;
        }
    }
    const v141 = data[0];
    const v142 = v141.trim();
    const v143 = v142.split('\n');
    const v145 = function (row) {
        const v144 = parseRow(row, servers);
        return v144;
    };
    const v146 = v143.map(v145);
    const v147 = v146.filter(Boolean);
    return v147;
};
const arpOne = function (address) {
    const v148 = 'arp -n ' + address;
    const v149 = cp.exec(v148, options);
    const v150 = v149.then(parseOne);
    return v150;
};
const parseOne = function (data) {
    const v151 = !data;
    const v152 = data[0];
    const v153 = !v152;
    const v154 = v151 || v153;
    if (v154) {
        return;
    }
    const v155 = process.platform;
    const v156 = v155.includes('linux');
    if (v156) {
        const v157 = data[0];
        const v158 = v157.indexOf('no entry');
        const v159 = v158 >= 0;
        if (v159) {
            return;
        }
        const v160 = data[0];
        const v161 = v160.split('\n');
        const v162 = v161.slice(1);
        var rows = v162[0];
        const v163 = parseLinux(rows, servers, true);
        return v163;
    } else {
        const v164 = process.platform;
        const v165 = v164.includes('win32');
        if (v165) {
            return;
        }
    }
    const v166 = data[0];
    const v167 = parseRow(v166, servers);
    return v167;
};
const unlock = function (key) {
    const v168 = function (data) {
        lock[key] = null;
        return data;
    };
    return v168;
};