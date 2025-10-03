'use strict';
const v89 = require('child_process');
var exec = v89.exec;
const parseStats = function (stderr) {
    var lines = [];
    var items = [];
    var stats = {};
    const v90 = {
        index: 1,
        name: 'totalSize',
        val: 0
    };
    const v91 = {
        index: 3,
        name: 'received',
        val: 0
    };
    const v92 = {
        index: 5,
        name: 'xferd',
        val: 0
    };
    const v93 = {
        index: 6,
        name: 'averageDownloadSpeed',
        val: 0
    };
    const v94 = {
        index: 7,
        name: 'averageUploadSpeed',
        val: 0
    };
    const v95 = {
        index: 8,
        name: 'totalTime',
        val: '--:--:--'
    };
    const v96 = {
        index: 9,
        name: 'timeSpent',
        val: '--:--:--'
    };
    const v97 = {
        index: 10,
        name: 'timeLeft',
        val: '--:--:--'
    };
    const v98 = {
        index: 11,
        name: 'currentSpeed',
        val: 0
    };
    var propMap = [
        v90,
        v91,
        v92,
        v93,
        v94,
        v95,
        v96,
        v97,
        v98
    ];
    if (stderr) {
        try {
            lines = stderr.split('\r');
            const v99 = lines[2];
            const v100 = v99.replace('\n', '');
            const v101 = v100.split(' ');
            const v102 = function (item) {
                return item;
            };
            items = v101.filter(v102);
        } catch (e) {
        }
    }
    const getValue = function (prop) {
        const v103 = items.length;
        const v104 = prop.index;
        const v105 = v103 > v104;
        if (v105) {
            const v106 = prop.index;
            var val = items[v106];
            const v107 = isNaN(val);
            if (v107) {
                const v108 = val.indexOf(':');
                const v109 = -1;
                const v110 = v108 !== v109;
                if (v110) {
                    const v111 = val === '--:--:--';
                    if (v111) {
                        return 0;
                    }
                    var parts = val.split(':');
                    const v112 = parts.length;
                    const v113 = v112 === 3;
                    if (v113) {
                        const v114 = parts[0];
                        const v115 = v114 * 24;
                        const v116 = parts[1];
                        const v117 = v116 * 60;
                        const v118 = v115 + v117;
                        const v119 = parts[2];
                        const v120 = v119 * 3600;
                        const v121 = v118 + v120;
                        return v121;
                    }
                }
                return val;
            }
            const v122 = prop.index;
            const v123 = items[v122];
            const v124 = Number(v123);
            return v124;
        }
        const v125 = prop.val;
        return v125;
    };
    const v128 = function (prop) {
        const v127 = getValue(prop);
        stats[v126] = v127;
    };
    const v129 = propMap.forEach(v128);
    v129;
    return stats;
};
const v139 = function (command, cb) {
    const v130 = 'curl ' + command;
    const v134 = function (error, stdout, stderr) {
        const v131 = parseStats(stderr);
        const v132 = {
            payload: stdout,
            stats: v131
        };
        const v133 = cb(null, v132);
        v133;
    };
    const v135 = exec(v130, v134);
    const v137 = function (err) {
        const v136 = cb(err, null);
        v136;
    };
    const v138 = v135.on('error', v137);
    v138;
};
exports.run = v139;
const v176 = function (connOptions) {
    var ctx = this;
    const getEmptyOption = function (option) {
        const v140 = option.length;
        const v141 = v140 === 1;
        if (v141) {
            const v142 = ' -' + option;
            return v142;
        }
        const v143 = ' --' + option;
        return v143;
    };
    const getStringOption = function (option, value) {
        const v144 = getEmptyOption(option);
        const v145 = v144 + ' "';
        const v146 = v145 + value;
        const v147 = v146 + '"';
        return v147;
    };
    const processOptions = function (options) {
        var tmp = '';
        if (options) {
            const v148 = Object.keys(options);
            const v154 = function (option) {
                var values = options[option];
                const v149 = !values;
                if (v149) {
                    tmp += getEmptyOption(option);
                } else {
                    const v150 = values.toLowerCase;
                    if (v150) {
                        tmp += getStringOption(option, values);
                    } else {
                        const v151 = Array.isArray(values);
                        if (v151) {
                            const v152 = function (value) {
                                tmp += getStringOption(option, value);
                            };
                            const v153 = values.forEach(v152);
                            v153;
                        }
                    }
                }
            };
            const v155 = v148.forEach(v154);
            v155;
        }
        return tmp;
    };
    const getOptions = function (options) {
        const v156 = processOptions(connOptions);
        const v157 = processOptions(options);
        const v158 = v156 + v157;
        return v158;
    };
    const getCommand = function (url, options) {
        const v159 = getOptions(options);
        const v160 = url + v159;
        return v160;
    };
    const v163 = function (url, options, cb) {
        const v161 = getCommand(url, options);
        var command = '--HEAD ' + v161;
        const v162 = ctx.run(command, cb);
        v162;
    };
    const v166 = function (url, options, cb) {
        const v164 = getCommand(url, options);
        var command = '--GET ' + v164;
        const v165 = ctx.run(command, cb);
        v165;
    };
    const v168 = function (url, options, cb) {
        var command = getCommand(url, options);
        const v167 = ctx.run(command, cb);
        v167;
    };
    const v171 = function (url, options, cb) {
        const v169 = getCommand(url, options);
        var command = '--request PUT ' + v169;
        const v170 = ctx.run(command, cb);
        v170;
    };
    const v174 = function (url, options, cb) {
        const v172 = getCommand(url, options);
        var command = '--include --request DELETE' + v172;
        const v173 = ctx.run(command, cb, true);
        v173;
    };
    const v175 = {};
    v175.head = v163;
    v175.get = v166;
    v175.post = v168;
    v175.put = v171;
    v175.del = v174;
    return v175;
};
exports.connect = v176;