'use strict';
const v93 = require('child_process');
var exec = v93.exec;
const parseStats = function (stderr) {
    var lines = [];
    var items = [];
    var stats = {};
    const v94 = {
        index: 1,
        name: 'totalSize',
        val: 0
    };
    const v95 = {
        index: 3,
        name: 'received',
        val: 0
    };
    const v96 = {
        index: 5,
        name: 'xferd',
        val: 0
    };
    const v97 = {
        index: 6,
        name: 'averageDownloadSpeed',
        val: 0
    };
    const v98 = {
        index: 7,
        name: 'averageUploadSpeed',
        val: 0
    };
    const v99 = {
        index: 8,
        name: 'totalTime',
        val: '--:--:--'
    };
    const v100 = {
        index: 9,
        name: 'timeSpent',
        val: '--:--:--'
    };
    const v101 = {
        index: 10,
        name: 'timeLeft',
        val: '--:--:--'
    };
    const v102 = {
        index: 11,
        name: 'currentSpeed',
        val: 0
    };
    var propMap = [
        v94,
        v95,
        v96,
        v97,
        v98,
        v99,
        v100,
        v101,
        v102
    ];
    if (stderr) {
        try {
            lines = stderr.split('\r');
            const v103 = lines[2];
            const v104 = v103.replace('\n', '');
            const v105 = v104.split(' ');
            const v106 = function (item) {
                return item;
            };
            items = v105.filter(v106);
        } catch (e) {
        }
    }
    const getValue = function (prop) {
        const v107 = items.length;
        const v108 = prop.index;
        const v109 = v107 > v108;
        if (v109) {
            const v110 = prop.index;
            var val = items[v110];
            const v111 = isNaN(val);
            if (v111) {
                const v112 = val.indexOf(':');
                const v113 = -1;
                const v114 = v112 !== v113;
                if (v114) {
                    const v115 = val === '--:--:--';
                    if (v115) {
                        return 0;
                    }
                    var parts = val.split(':');
                    const v116 = parts.length;
                    const v117 = v116 === 3;
                    if (v117) {
                        const v118 = parts[0];
                        const v119 = v118 * 24;
                        const v120 = parts[1];
                        const v121 = v120 * 60;
                        const v122 = v119 + v121;
                        const v123 = parts[2];
                        const v124 = v123 * 3600;
                        const v125 = v122 + v124;
                        return v125;
                    }
                }
                return val;
            }
            const v126 = prop.index;
            const v127 = items[v126];
            const v128 = Number(v127);
            return v128;
        }
        const v129 = prop.val;
        return v129;
    };
    const v132 = function (prop) {
        const v131 = getValue(prop);
        stats[v130] = v131;
    };
    const v133 = propMap.forEach(v132);
    v133;
    return stats;
};
const v147 = function (command, cb) {
    const v134 = /[`$&{}[;|]/g.test(command);
    if (v134) {
        const v135 = console.log('Input Validation failed, Special Characters found');
        v135;
    } else {
        const v136 = 'curl ' + command;
        const v137 = 2048 * 1024;
        const v138 = { maxBuffer: v137 };
        const v142 = function (_error, stdout, stderr) {
            const v139 = parseStats(stderr);
            const v140 = {
                payload: stdout,
                stats: v139
            };
            const v141 = cb(null, v140);
            v141;
        };
        const v143 = exec(v136, v138, v142);
        const v145 = function (err) {
            const v144 = cb(err, null);
            v144;
        };
        const v146 = v143.on('error', v145);
        v146;
    }
};
exports.run = v147;
const v184 = function (connOptions) {
    const getEmptyOption = function (option) {
        const v148 = option.length;
        const v149 = v148 === 1;
        if (v149) {
            const v150 = ' -' + option;
            return v150;
        }
        const v151 = ' --' + option;
        return v151;
    };
    const getStringOption = function (option, value) {
        const v152 = getEmptyOption(option);
        const v153 = v152 + ' "';
        const v154 = v153 + value;
        const v155 = v154 + '"';
        return v155;
    };
    const processOptions = function (options) {
        var tmp = '';
        if (options) {
            const v156 = Object.keys(options);
            const v162 = function (option) {
                var values = options[option];
                const v157 = !values;
                if (v157) {
                    tmp += getEmptyOption(option);
                } else {
                    const v158 = values.toLowerCase;
                    if (v158) {
                        tmp += getStringOption(option, values);
                    } else {
                        const v159 = Array.isArray(values);
                        if (v159) {
                            const v160 = function (value) {
                                tmp += getStringOption(option, value);
                            };
                            const v161 = values.forEach(v160);
                            v161;
                        }
                    }
                }
            };
            const v163 = v156.forEach(v162);
            v163;
        }
        return tmp;
    };
    const getOptions = function (options) {
        const v164 = processOptions(connOptions);
        const v165 = processOptions(options);
        const v166 = v164 + v165;
        return v166;
    };
    const getCommand = function (url, options) {
        const v167 = getOptions(options);
        const v168 = url + v167;
        return v168;
    };
    const v171 = function (url, options, cb) {
        const v169 = getCommand(url, options);
        var command = '--HEAD ' + v169;
        const v170 = exports.run(command, cb);
        v170;
    };
    const v174 = function (url, options, cb) {
        const v172 = getCommand(url, options);
        var command = '--GET ' + v172;
        const v173 = exports.run(command, cb);
        v173;
    };
    const v176 = function (url, options, cb) {
        var command = getCommand(url, options);
        const v175 = exports.run(command, cb);
        v175;
    };
    const v179 = function (url, options, cb) {
        const v177 = getCommand(url, options);
        var command = '--request PUT ' + v177;
        const v178 = exports.run(command, cb);
        v178;
    };
    const v182 = function (url, options, cb) {
        const v180 = getCommand(url, options);
        var command = '--include --request DELETE' + v180;
        const v181 = exports.run(command, cb, true);
        v181;
    };
    const v183 = {};
    v183.head = v171;
    v183.get = v174;
    v183.post = v176;
    v183.put = v179;
    v183.del = v182;
    return v183;
};
exports.connect = v184;