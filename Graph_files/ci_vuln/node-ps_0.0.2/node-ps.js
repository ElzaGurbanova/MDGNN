var childProcess = require('child_process');
const _getTitles = function (titleLine) {
    var titles = [];
    const v69 = titleLine.split(/\s+/);
    const v74 = function (title) {
        const v70 = title.trim();
        const v71 = v70 === '';
        if (v71) {
            return;
        }
        const v72 = title.trim();
        const v73 = titles.push(v72);
        v73;
    };
    const v75 = v69.forEach(v74);
    v75;
    return titles;
};
const _parse = function (input) {
    var lines = input.split('\n');
    const v76 = lines.shift();
    var titles = _getTitles(v76);
    const v79 = function (line) {
        const v77 = line.trim();
        const v78 = v77 !== '';
        return v78;
    };
    const v80 = lines.filter(v79);
    const v95 = function (line) {
        const v81 = line.trim();
        var columns = v81.split(/\s+/);
        var obj = {};
        var i = 0;
        const v82 = titles.length;
        let v83 = i < v82;
        while (v83) {
            const v85 = titles.length;
            const v86 = v85 - 1;
            const v87 = i === v86;
            const v88 = columns.length;
            const v89 = v88 > 1;
            const v90 = v87 && v89;
            if (v90) {
                const v92 = columns.join(' ');
                obj[v91] = v92;
            } else {
                const v94 = columns.shift();
                obj[v93] = v94;
            }
            const v84 = i++;
            v83 = i < v82;
        }
        return obj;
    };
    var objs = v80.map(v95);
    return objs;
};
const _filter = function (query, processes) {
    const v111 = function (proc) {
        var res = true;
        const v96 = query.pid;
        if (v96) {
            var pids = Object.create(null);
            const v97 = query.pid;
            const v98 = Array.isArray(v97);
            if (v98) {
                const v99 = query.pid;
                const v100 = function (pid) {
                    pids[pid] = true;
                };
                const v101 = v99.forEach(v100);
                v101;
            } else {
                const v102 = query.pid;
                pids[v102] = true;
            }
            const v103 = proc.PID;
            const v104 = v103 in pids;
            res = res && v104;
        }
        const v105 = query.command;
        if (v105) {
            const v106 = proc.CMD;
            const v107 = query.command;
            const v108 = v106.search(v107);
            const v109 = -1;
            const v110 = v108 !== v109;
            res = res && v110;
        }
        return res;
    };
    const v112 = processes.filter(v111);
    return v112;
};
const _ps = function (args, cb) {
    const v113 = process.platform;
    const v114 = v113 === 'win32';
    if (v114) {
        const v115 = cb('Windows support not implemented yet.');
        return v115;
    } else {
        var cmd = 'ps';
        if (args) {
            const v116 = args.join(' ');
            cmd += ' ' + v116;
        }
        const v124 = function (err, stdout, stderr) {
            const v117 = err || stderr;
            if (v117) {
                const v118 = stderr.toString();
                const v119 = err || v118;
                const v120 = cb(v119);
                return v120;
            }
            const v121 = stdout.toString();
            const v122 = _parse(v121);
            const v123 = cb(null, v122);
            return v123;
        };
        const v125 = childProcess.exec(cmd, v124);
        v125;
    }
};
const lookup = function (query, cb) {
    const v126 = query.psargs;
    const v130 = function (err, results) {
        if (err) {
            const v127 = cb(err);
            return v127;
        }
        const v128 = _filter(query, results);
        const v129 = cb(null, v128);
        return v129;
    };
    const v131 = _ps(v126, v130);
    v131;
};
const v132 = process.env;
const v133 = v132.NODE_ENV;
const v134 = v133 === 'test';
if (v134) {
    const v135 = {};
    v135._getTitles = _getTitles;
    v135._parse = _parse;
    v135._filter = _filter;
    v135._ps = _ps;
    v135.lookup = lookup;
    module.exports = v135;
} else {
    const v136 = {};
    v136.lookup = lookup;
    module.exports = v136;
}