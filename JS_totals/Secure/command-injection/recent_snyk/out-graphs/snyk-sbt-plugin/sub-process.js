import * as childProcess from 'child_process';
import * as treeKill from 'tree-kill';
import * as debugModule from 'debug';
const debugLogging = debugModule('snyk-sbt-plugin');
const v59 = process.env;
const v60 = v59.PROC_TIMEOUT;
const TIMEOUT = v60 || '0';
const PROC_TIMEOUT = parseInt(TIMEOUT, 10);
export const execute = (command, args, options) => {
    const spawnOptions = {};
    spawnOptions.shell = true;
    const v61 = options.cwd;
    const v62 = options && v61;
    if (v62) {
        const v63 = options.cwd;
        spawnOptions.cwd = v63;
    }
    const v112 = (resolve, reject) => {
        const out = {};
        out.stdout = '';
        out.stderr = '';
        const proc = childProcess.spawn(command, args, spawnOptions);
        const v64 = PROC_TIMEOUT !== 0;
        if (v64) {
            const v65 = proc.pid;
            const v66 = kill(v65, out);
            const v67 = setTimeout(v66, PROC_TIMEOUT);
            v67;
        }
        const v68 = proc.stdout;
        const v79 = data => {
            const strData = data.toString();
            const v69 = out.stdout;
            out.stdout = v69 + strData;
            const v70 = strData.split('\n');
            const v72 = str => {
                const v71 = debugLogging(str);
                v71;
            };
            const v73 = v70.forEach(v72);
            v73;
            const v74 = strData.includes('(q)uit');
            if (v74) {
                const v75 = proc.stdin;
                const v76 = v75.write('q\n');
                v76;
                const v77 = 'sbt is requiring input. Provided (q)uit signal. ' + 'There is no current workaround for this, see: https://stackoverflow.com/questions/21484166';
                const v78 = debugLogging(v77);
                v78;
            }
        };
        const v80 = v68.on('data', v79);
        v80;
        const v81 = proc.stderr;
        const v88 = data => {
            const v82 = out.stderr;
            out.stderr = v82 + data;
            const v83 = data.toString();
            const v84 = v83.split('\n');
            const v86 = str => {
                const v85 = debugLogging(str);
                v85;
            };
            const v87 = v84.forEach(v86);
            v87;
        };
        const v89 = v81.on('data', v88);
        v89;
        const v110 = code => {
            const v90 = code !== 0;
            if (v90) {
                const v91 = command + ' ';
                const v92 = args.join(' ');
                const fullCommand = v91 + v92;
                let v93;
                if (code) {
                    v93 = `>>> exit code: ${ code } `;
                } else {
                    v93 = '';
                }
                const v94 = `>>> command: ${ fullCommand } ` + v93;
                const v95 = out.stdout;
                const v96 = out.stdout;
                let v97;
                if (v95) {
                    v97 = `>>> stdout: ${ v96 } `;
                } else {
                    v97 = '';
                }
                const v98 = v94 + v97;
                const v99 = out.stderr;
                const v100 = out.stderr;
                let v101;
                if (v99) {
                    v101 = `>>> stderr: ${ v100 }`;
                } else {
                    v101 = 'null';
                }
                const errorMessage = v98 + v101;
                const v102 = new Error(errorMessage);
                const v103 = reject(v102);
                return v103;
            }
            const v104 = out.stderr;
            if (v104) {
                const v105 = out.stderr;
                const v106 = 'subprocess exit code = 0, but stderr was not empty: ' + v105;
                const v107 = debugLogging(v106);
                v107;
            }
            const v108 = out.stdout;
            const v109 = resolve(v108);
            v109;
        };
        const v111 = proc.on('close', v110);
        v111;
    };
    const v113 = new Promise(v112);
    return v113;
};
const kill = function (id, out) {
    const v116 = () => {
        const v114 = out.stderr;
        out.stderr = v114 + 'Process timed out. To set longer timeout run with `PROC_TIMEOUT=value_in_ms`\n';
        const v115 = treeKill(id);
        return v115;
    };
    return v116;
};