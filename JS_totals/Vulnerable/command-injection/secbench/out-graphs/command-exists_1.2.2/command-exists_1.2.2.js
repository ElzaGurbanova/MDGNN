'use strict';
const v69 = require('child_process');
var exec = v69.exec;
const v70 = require('child_process');
var execSync = v70.execSync;
var fs = require('fs');
var access = fs.access;
var accessSync = fs.accessSync;
const v71 = fs.constants;
var constants = v71 || fs;
const v72 = process.platform;
var isUsingWindows = v72 == 'win32';
var fileNotExists = function (commandName, callback) {
    const v73 = constants.F_OK;
    const v76 = function (err) {
        const v74 = !err;
        const v75 = callback(v74);
        v75;
    };
    const v77 = access(commandName, v73, v76);
    v77;
};
var fileNotExistsSync = function (commandName) {
    try {
        const v78 = constants.F_OK;
        const v79 = accessSync(commandName, v78);
        v79;
        return false;
    } catch (e) {
        return true;
    }
};
var localExecutable = function (commandName, callback) {
    const v80 = constants.F_OK;
    const v81 = constants.X_OK;
    const v82 = v80 | v81;
    const v85 = function (err) {
        const v83 = !err;
        const v84 = callback(null, v83);
        v84;
    };
    const v86 = access(commandName, v82, v85);
    v86;
};
var localExecutableSync = function (commandName) {
    try {
        const v87 = constants.F_OK;
        const v88 = constants.X_OK;
        const v89 = v87 | v88;
        const v90 = accessSync(commandName, v89);
        v90;
        return true;
    } catch (e) {
        return false;
    }
};
var commandExistsUnix = function (commandName, callback) {
    const v102 = function (isFile) {
        const v91 = !isFile;
        if (v91) {
            const v92 = 'command -v ' + commandName;
            const v93 = v92 + ' 2>/dev/null';
            const v94 = v93 + ' && { echo >&1 \'';
            const v95 = v94 + commandName;
            const v96 = v95 + ' found\'; exit 0; }';
            const v100 = function (error, stdout, stderr) {
                const v97 = !stdout;
                const v98 = !v97;
                const v99 = callback(null, v98);
                v99;
            };
            var child = exec(v96, v100);
            return;
        }
        const v101 = localExecutable(commandName, callback);
        v101;
    };
    const v103 = fileNotExists(commandName, v102);
    v103;
};
var commandExistsWindows = function (commandName, callback) {
    const v104 = 'where ' + commandName;
    const v108 = function (error) {
        const v105 = error !== null;
        if (v105) {
            const v106 = callback(null, false);
            v106;
        } else {
            const v107 = callback(null, true);
            v107;
        }
    };
    var child = exec(v104, v108);
};
var commandExistsUnixSync = function (commandName) {
    const v109 = fileNotExistsSync(commandName);
    if (v109) {
        try {
            const v110 = 'command -v ' + commandName;
            const v111 = v110 + ' 2>/dev/null';
            const v112 = v111 + ' && { echo >&1 \'';
            const v113 = v112 + commandName;
            const v114 = v113 + ' found\'; exit 0; }';
            var stdout = execSync(v114);
            const v115 = !stdout;
            const v116 = !v115;
            return v116;
        } catch (error) {
            return false;
        }
    }
    const v117 = localExecutableSync(commandName);
    return v117;
};
var commandExistsWindowsSync = function (commandName, callback) {
    try {
        const v118 = 'where ' + commandName;
        var stdout = execSync(v118);
        const v119 = !stdout;
        const v120 = !v119;
        return v120;
    } catch (error) {
        return false;
    }
};
const commandExists = function (commandName, callback) {
    const v121 = !callback;
    const v122 = typeof Promise;
    const v123 = v122 !== 'undefined';
    const v124 = v121 && v123;
    if (v124) {
        const v129 = function (resolve, reject) {
            const v127 = function (error, output) {
                if (output) {
                    const v125 = resolve(commandName);
                    v125;
                } else {
                    const v126 = reject(error);
                    v126;
                }
            };
            const v128 = commandExists(commandName, v127);
            v128;
        };
        const v130 = new Promise(v129);
        return v130;
    }
    if (isUsingWindows) {
        const v131 = commandExistsWindows(commandName, callback);
        v131;
    } else {
        const v132 = commandExistsUnix(commandName, callback);
        v132;
    }
};
module.exports = commandExists;
const v133 = module.exports;
const v136 = function (commandName) {
    if (isUsingWindows) {
        const v134 = commandExistsWindowsSync(commandName);
        return v134;
    } else {
        const v135 = commandExistsUnixSync(commandName);
        return v135;
    }
};
v133.sync = v136;