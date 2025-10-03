const v63 = require('child_process');
var exec = v63.exec;
const v64 = require('child_process');
var spawn = v64.spawn;
var util = require('../utils/util');
const v65 = module.exports;
v65.getPsInfo = getPsInfo;
const getPsInfo = function (param, callback) {
    const v66 = process.platform;
    const v67 = v66 === 'windows';
    if (v67) {
        return;
    }
    var pid = param.pid;
    const v68 = 'ps auxw | grep ' + pid;
    var cmd = v68 + ' | grep -v \'grep\'';
    const v79 = function (err, output) {
        const v69 = !err;
        const v70 = !v69;
        if (v70) {
            const v71 = err.code;
            const v72 = v71 === 1;
            if (v72) {
                const v73 = console.log('the content is null!');
                v73;
            } else {
                const v74 = err.stack;
                const v75 = 'getPsInfo failed! ' + v74;
                const v76 = console.error(v75);
                v76;
            }
            const v77 = callback(err, null);
            v77;
            return;
        }
        const v78 = format(param, output, callback);
        v78;
    };
    const v80 = exec(cmd, v79);
    v80;
};
;
const format = function (param, data, cb) {
    const v81 = new Date();
    var time = util.formatTime(v81);
    const v82 = data.toString();
    const v83 = v82.replace(/^\s+|\s+$/g, '');
    var outArray = v83.split(/\s+/);
    var outValueArray = [];
    var i = 0;
    const v84 = outArray.length;
    let v85 = i < v84;
    while (v85) {
        const v87 = outArray[i];
        const v88 = isNaN(v87);
        const v89 = !v88;
        if (v89) {
            const v90 = outArray[i];
            const v91 = outValueArray.push(v90);
            v91;
        }
        const v86 = i++;
        v85 = i < v84;
    }
    var ps = {};
    ps.time = time;
    const v92 = param.serverId;
    ps.serverId = v92;
    const v93 = ps.serverId;
    const v94 = v93.split('-');
    const v95 = v94[0];
    ps.serverType = v95;
    const v96 = param.pid;
    ps.pid = v96;
    var pid = ps.pid;
    const v97 = outValueArray[1];
    ps.cpuAvg = v97;
    const v98 = outValueArray[2];
    ps.memAvg = v98;
    const v99 = outValueArray[3];
    ps.vsz = v99;
    const v100 = outValueArray[4];
    ps.rss = v100;
    outValueArray = [];
    const v101 = process.platform;
    const v102 = v101 === 'darwin';
    if (v102) {
        ps.usr = 0;
        ps.sys = 0;
        ps.gue = 0;
        const v103 = cb(null, ps);
        v103;
        return;
    }
    const v104 = 'pidstat -p ' + pid;
    const v123 = function (err, output) {
        const v105 = !err;
        const v106 = !v105;
        if (v106) {
            const v107 = err.stack;
            const v108 = console.error('the command pidstat failed! ', v107);
            v108;
            return;
        }
        const v109 = output.toString();
        const v110 = v109.replace(/^\s+|\s+$/g, '');
        var outArray = v110.split(/\s+/);
        var i = 0;
        const v111 = outArray.length;
        let v112 = i < v111;
        while (v112) {
            const v114 = outArray[i];
            const v115 = isNaN(v114);
            const v116 = !v115;
            if (v116) {
                const v117 = outArray[i];
                const v118 = outValueArray.push(v117);
                v118;
            }
            const v113 = i++;
            v112 = i < v111;
        }
        const v119 = outValueArray[1];
        ps.usr = v119;
        const v120 = outValueArray[2];
        ps.sys = v120;
        const v121 = outValueArray[3];
        ps.gue = v121;
        const v122 = cb(null, ps);
        v122;
    };
    const v124 = exec(v104, v123);
    v124;
};
;