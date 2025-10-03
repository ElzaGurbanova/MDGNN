'use strict';
const v96 = { value: true };
const v97 = Object.defineProperty(exports, '__esModule', v96);
v97;
exports['default'] = getMac;
var _constats = require('./constats');
var cp = require('child_process');
var os = require('os');
const isIpAddress = function (ipAddress) {
    const v98 = !ipAddress;
    const v99 = typeof ipAddress;
    const v100 = v99 !== 'string';
    const v101 = v98 || v100;
    if (v101) {
        const v102 = new Error('Expected a string');
        throw v102;
    }
    const v103 = _constats.IP_V4_ADDRESS_REGEX;
    const v104 = ipAddress.trim();
    const v105 = v103.test(v104);
    return v105;
};
const getOwnMacAddress = function (ipAddress) {
    var ifaces = os.networkInterfaces();
    var selfIps = [];
    const v106 = Object.keys(ifaces);
    const v113 = function (ifname) {
        const v107 = ifaces[ifname];
        const v111 = function (iface) {
            const v108 = iface.family;
            const v109 = v108 !== 'IPv4';
            if (v109) {
                return;
            }
            const v110 = selfIps.push(iface);
            v110;
        };
        const v112 = v107.forEach(v111);
        v112;
    };
    const v114 = v106.forEach(v113);
    v114;
    const v116 = function (_ref) {
        var address = _ref.address;
        const v115 = address === ipAddress;
        return v115;
    };
    const v117 = selfIps.filter(v116);
    const v119 = function (selfIp) {
        const v118 = selfIp.mac;
        return v118;
    };
    var ownMacAddress = v117.map(v119);
    const v120 = ownMacAddress.length;
    const v121 = ownMacAddress && v120;
    const v122 = ownMacAddress[0];
    let v123;
    if (v121) {
        v123 = v122;
    } else {
        v123 = false;
    }
    return v123;
};
const getMacInLinux = function (ipAddress, callback) {
    const v124 = 'ping -c 1 ' + ipAddress;
    const v146 = function (error, stdout, stderr) {
        const v125 = error || stderr;
        if (v125) {
            let v126;
            if (error) {
                v126 = 'exec error';
            } else {
                v126 = 'stderr';
            }
            const v127 = ''.concat(v126, ': ');
            const v128 = error || stderr;
            const v129 = v127.concat(v128);
            const v130 = callback('IP address unreachable', v129);
            v130;
            return;
        }
        const v144 = function (error, stdout, stderr) {
            const v131 = error || stderr;
            if (v131) {
                let v132;
                if (error) {
                    v132 = 'exec error';
                } else {
                    v132 = 'stderr';
                }
                const v133 = ''.concat(v132, ': ');
                const v134 = error || stderr;
                const v135 = v133.concat(v134);
                const v136 = callback('IP address unreachable', v135);
                v136;
                return;
            }
            const v137 = stdout.indexOf(ipAddress);
            const v138 = ipAddress.length;
            const v139 = v138 + 5;
            const v140 = v137 + v139;
            const v141 = stdout.substring(v140);
            const v142 = _constats.MAC_ADDRESS_LENGTH;
            stdout = v141.substring(v142, 0);
            const v143 = callback(false, stdout);
            v143;
            return;
        };
        const v145 = cp.exec('arp -a', v144);
        v145;
    };
    const v147 = cp.exec(v124, v146);
    v147;
};
const getMacInWin32 = function (ipAddress, callback) {
    const v148 = 'ping  '.concat(ipAddress, ' -n 1');
    const v171 = function (error, stdout, stderr) {
        const v149 = error || stderr;
        if (v149) {
            let v150;
            if (error) {
                v150 = 'exec error';
            } else {
                v150 = 'stderr';
            }
            const v151 = ''.concat(v150, ': ');
            const v152 = error || stderr;
            const v153 = v151.concat(v152);
            const v154 = callback('IP address unreachable', v153);
            v154;
            return;
        }
        const v169 = function (error, stdout, stderr) {
            const v155 = error || stderr;
            if (v155) {
                let v156;
                if (error) {
                    v156 = 'exec error';
                } else {
                    v156 = 'stderr';
                }
                const v157 = ''.concat(v156, ': ');
                const v158 = error || stderr;
                const v159 = v157.concat(v158);
                const v160 = callback('IP address unreachable', v159);
                v160;
                return;
            }
            const v161 = ipAddress.length;
            var offset = 22 - v161;
            const v162 = stdout.indexOf(ipAddress);
            const v163 = ipAddress.length;
            const v164 = v163 + offset;
            const v165 = v162 + v164;
            const v166 = stdout.substring(v165);
            const v167 = _constats.MAC_ADDRESS_LENGTH;
            stdout = v166.substring(v167, 0);
            const v168 = callback(false, stdout);
            v168;
            return;
        };
        const v170 = cp.exec('arp -a', v169);
        v170;
    };
    const v172 = cp.exec(v148, v171);
    v172;
};
const getRemoteMac = function (ipAddress, callback) {
    const v173 = os.platform();
    switch (v173) {
    case 'linux':
        const v175 = function (err, mac) {
            const v174 = callback(err, mac);
            return v174;
        };
        const v176 = getMacInLinux(ipAddress, v175);
        v176;
        break;
    case 'win32':
        const v178 = function (err, mac) {
            const v177 = callback(err, mac);
            return v177;
        };
        const v179 = getMacInWin32(ipAddress, v178);
        v179;
        break;
    case 'darwin':
        const v181 = function (err, mac) {
            const v180 = callback(err, mac);
            return v180;
        };
        const v182 = getMacInLinux(ipAddress, v181);
        v182;
        break;
    default:
        const v183 = os.platform();
        const v184 = 'Unsupported platform: ' + v183;
        const v185 = callback(v184, null);
        v185;
        break;
    }
};
const getMac = function (ipAddress, callback) {
    const v186 = isIpAddress(ipAddress);
    const v187 = !v186;
    if (v187) {
        const v188 = new Error('The value you entered is not a valid IP address');
        throw v188;
    }
    var ownMacAddress = getOwnMacAddress(ipAddress);
    if (ownMacAddress) {
        const v189 = callback(false, ownMacAddress);
        v189;
    } else {
        const v190 = getRemoteMac(ipAddress, callback);
        v190;
    }
};