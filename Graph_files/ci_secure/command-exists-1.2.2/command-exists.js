'use strict';
const v73 = require('child_process');
var exec = v73.exec;
const v74 = require('child_process');
var execSync = v74.execSync;
var fs = require('fs');
var access = fs.access;
var accessSync = fs.accessSync;
const v75 = fs.constants;
var constants = v75 || fs;
const v76 = process.platform;
var isUsingWindows = v76 == 'win32';
var fileNotExists = function (commandName, callback) {
    const v77 = constants.F_OK;
    const v80 = function (err) {
        const v78 = !err;
        const v79 = callback(v78);
        v79;
    };
    const v81 = access(commandName, v77, v80);
    v81;
};
var fileNotExistsSync = function (commandName) {
    try {
        const v82 = constants.F_OK;
        const v83 = accessSync(commandName, v82);
        v83;
        return false;
    } catch (e) {
        return true;
    }
};
var localExecutable = function (commandName, callback) {
    const v84 = constants.F_OK;
    const v85 = constants.X_OK;
    const v86 = v84 | v85;
    const v89 = function (err) {
        const v87 = !err;
        const v88 = callback(null, v87);
        v88;
    };
    const v90 = access(commandName, v86, v89);
    v90;
};
var localExecutableSync = function (commandName) {
    try {
        const v91 = constants.F_OK;
        const v92 = constants.X_OK;
        const v93 = v91 | v92;
        const v94 = accessSync(commandName, v93);
        v94;
        return true;
    } catch (e) {
        return false;
    }
};
var commandExistsUnix = function (commandName, cleanedCommandName, callback) {
    const v106 = function (isFile) {
        const v95 = !isFile;
        if (v95) {
            const v96 = 'command -v ' + cleanedCommandName;
            const v97 = v96 + ' 2>/dev/null';
            const v98 = v97 + ' && { echo >&1 ';
            const v99 = v98 + cleanedCommandName;
            const v100 = v99 + '; exit 0; }';
            const v104 = function (error, stdout, stderr) {
                const v101 = !stdout;
                const v102 = !v101;
                const v103 = callback(null, v102);
                v103;
            };
            var child = exec(v100, v104);
            return;
        }
        const v105 = localExecutable(commandName, callback);
        v105;
    };
    const v107 = fileNotExists(commandName, v106);
    v107;
};
var commandExistsWindows = function (commandName, cleanedCommandName, callback) {
    const v108 = 'where ' + cleanedCommandName;
    const v112 = function (error) {
        const v109 = error !== null;
        if (v109) {
            const v110 = callback(null, false);
            v110;
        } else {
            const v111 = callback(null, true);
            v111;
        }
    };
    var child = exec(v108, v112);
};
var commandExistsUnixSync = function (commandName, cleanedCommandName) {
    const v113 = fileNotExistsSync(commandName);
    if (v113) {
        try {
            const v114 = 'command -v ' + cleanedCommandName;
            const v115 = v114 + ' 2>/dev/null';
            const v116 = v115 + ' && { echo >&1 ';
            const v117 = v116 + cleanedCommandName;
            const v118 = v117 + '; exit 0; }';
            var stdout = execSync(v118);
            const v119 = !stdout;
            const v120 = !v119;
            return v120;
        } catch (error) {
            return false;
        }
    }
    const v121 = localExecutableSync(commandName);
    return v121;
};
var commandExistsWindowsSync = function (commandName, cleanedCommandName, callback) {
    try {
        const v122 = 'where ' + cleanedCommandName;
        var stdout = execSync(v122);
        const v123 = !stdout;
        const v124 = !v123;
        return v124;
    } catch (error) {
        return false;
    }
};
var cleanInput = function (s) {
    const v125 = /[^A-Za-z0-9_\/:=-]/.test(s);
    if (v125) {
        const v126 = s.replace(/'/g, '\'\\\'\'');
        const v127 = '\'' + v126;
        s = v127 + '\'';
        const v128 = s.replace(/^(?:'')+/g, '');
        s = v128.replace(/\\'''/g, '\\\'');
    }
    return s;
};
const commandExists = function (commandName, callback) {
    var cleanedCommandName = cleanInput(commandName);
    const v129 = !callback;
    const v130 = typeof Promise;
    const v131 = v130 !== 'undefined';
    const v132 = v129 && v131;
    if (v132) {
        const v137 = function (resolve, reject) {
            const v135 = function (error, output) {
                if (output) {
                    const v133 = resolve(commandName);
                    v133;
                } else {
                    const v134 = reject(error);
                    v134;
                }
            };
            const v136 = commandExists(commandName, v135);
            v136;
        };
        const v138 = new Promise(v137);
        return v138;
    }
    if (isUsingWindows) {
        const v139 = commandExistsWindows(commandName, cleanedCommandName, callback);
        v139;
    } else {
        const v140 = commandExistsUnix(commandName, cleanedCommandName, callback);
        v140;
    }
};
module.exports = commandExists;
const v141 = module.exports;
const v144 = function (commandName) {
    var cleanedCommandName = cleanInput(commandName);
    if (isUsingWindows) {
        const v142 = commandExistsWindowsSync(commandName, cleanedCommandName);
        return v142;
    } else {
        const v143 = commandExistsUnixSync(commandName, cleanedCommandName);
        return v143;
    }
};
v141.sync = v144;