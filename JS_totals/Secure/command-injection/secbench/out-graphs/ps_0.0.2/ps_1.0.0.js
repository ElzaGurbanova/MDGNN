const v85 = require('child_process');
const spawn = v85.spawn;
const whitespace = /\s+/;
const v86 = [
    'group',
    'ppid',
    'user',
    'args',
    'comm',
    'rgroup',
    'nice',
    'pid',
    'pgid',
    'etime',
    'ruser',
    'time',
    'tty',
    'vsz'
];
const validFields = new Set(v86);
const lookup = async ({pid, ppid, user, group, command, all, fields = [
        'pid',
        'ppid',
        'comm'
    ]}) => {
    const v88 = field => {
        const v87 = validFields.has(field);
        return v87;
    };
    const v89 = fields.every(v88);
    const v90 = !v89;
    if (v90) {
        const v91 = new Error('ps - invalid field provided');
        throw v91;
    }
    const v92 = fields.indexOf('ppid');
    const v93 = v92 < 0;
    const v94 = ppid && v93;
    if (v94) {
        const v95 = fields.push('ppid');
        v95;
    }
    const v96 = [];
    const fieldOptions = fields.reduce(reduceFieldsToOptions, v96);
    const v97 = pid === 0;
    const v98 = pid || v97;
    if (v98) {
        const v99 = processPids(pid);
        const v100 = [
            '-p',
            v99,
            ...fieldOptions
        ];
        const output = await ps(v100);
        const v101 = parseGrid(output);
        return v101;
    }
    const v102 = ppid === 0;
    const v103 = ppid || v102;
    if (v103) {
        const pids = processPids(ppid);
        const v104 = String(pids);
        const v105 = v104.split(',');
        const ppidSet = new Set(v105);
        const v106 = [
            '-p',
            pids,
            ...fieldOptions
        ];
        const output = await ps(v106);
        const processes = parseGrid(output);
        const v109 = proc => {
            const v107 = proc.ppid;
            const v108 = ppidSet.has(v107);
            return v108;
        };
        const v110 = processes.filter(v109);
        return v110;
    }
    if (all) {
        const v111 = [
            '-e',
            ...fieldOptions
        ];
        const output = await ps(v111);
        const v112 = parseGrid(output);
        return v112;
    }
    if (user) {
        const v113 = [
            '-u',
            user,
            ...fieldOptions
        ];
        const output = await ps(v113);
        const v114 = parseGrid(output);
        return v114;
    }
    if (group) {
        const v115 = [
            '-g',
            group,
            ...fieldOptions
        ];
        const output = await ps(v115);
        const v116 = parseGrid(output);
        return v116;
    }
    if (command) {
        const v117 = [
            '-C',
            command,
            ...fieldOptions
        ];
        const output = await ps(v117);
        const v118 = parseGrid(output);
        return v118;
    }
    const v119 = new Error('ps - must provide a search query; one of "pid", "ppid", "all", "user", "group", "command"');
    throw v119;
};
module.exports = lookup;
lookup.lookup = lookup;
const Process = function Process(fields) {
    const v120 = Object.assign(this, fields);
    v120;
    const v121 = Object.freeze(this);
    v121;
};
Process['is_class'] = true;
const reduceFieldsToOptions = (options, field) => {
    const v122 = options.push('-o', field);
    v122;
    return options;
};
const ps = (args, callback) => {
    const v138 = (resolve, reject) => {
        const child = spawn('ps', args);
        let stdout = '';
        let stderr = '';
        const v124 = error => {
            const v123 = reject(error);
            v123;
        };
        const v125 = child.on('error', v124);
        v125;
        const v126 = child.stdout;
        const v127 = data => {
            return stdout += data;
        };
        const v128 = v126.on('data', v127);
        v128;
        const v129 = child.stderr;
        const v130 = data => {
            return stderr += data;
        };
        const v131 = v129.on('data', v130);
        v131;
        const v136 = code => {
            stderr = stderr.trim();
            if (stderr) {
                const v132 = new Error(stderr);
                const v133 = reject(v132);
                return v133;
            }
            const v134 = stdout.trim();
            const v135 = resolve(v134);
            v135;
        };
        const v137 = child.on('close', v136);
        v137;
    };
    const v139 = new Promise(v138);
    return v139;
};
const isValidPid = pid => {
    const int = parseInt(pid, 10);
    const v140 = isNaN(int);
    const v141 = !v140;
    const v142 = String(int);
    const v143 = String(pid);
    const v144 = v142 === v143;
    const v145 = v141 && v144;
    return v145;
};
const processPids = pid => {
    const v146 = Array.isArray(pid);
    if (v146) {
        const v147 = pid.every(isValidPid);
        const v148 = !v147;
        if (v148) {
            const v149 = new Error('ps - pid must be a valid integer value');
            throw v149;
        }
        const v150 = pid.join(',');
        return v150;
    }
    const v151 = isValidPid(pid);
    const v152 = !v151;
    if (v152) {
        const v153 = new Error('ps - pid must be a valid integer value');
        throw v153;
    }
    return pid;
};
const parseGrid = output => {
    const v154 = !output;
    if (v154) {
        const v155 = [];
        return v155;
    }
    const lines = output.split('\n');
    const v156 = lines.shift();
    const v157 = v156.trim();
    const v158 = v157.split(whitespace);
    const v160 = col => {
        const v159 = col.toLowerCase();
        return v159;
    };
    const header = v158.map(v160);
    const v167 = line => {
        const proc = {};
        const v161 = line.trim();
        const v162 = v161.split(whitespace);
        const v164 = (item, index) => {
            if (item) {
                const v163 = header[index];
                proc[v163] = item;
            }
        };
        const v165 = v162.forEach(v164);
        v165;
        const v166 = new Process(proc);
        return v166;
    };
    const v168 = lines.map(v167);
    return v168;
};