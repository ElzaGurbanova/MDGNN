const v44 = require('os');
const platform = v44.platform;
const child_process = require('child_process');
const crossSpawn = require('cross-spawn');
const shellEscape = require('shell-escape');
const path = require('path');
let kill = function (child, command) {
    const v45 = [
        '-o',
        'pid,ppid,tty',
        '-C',
        command
    ];
    let ps = child_process.spawn('ps', v45);
    let out = '';
    const v46 = ps.stdout;
    const v47 = buffer => {
        out += buffer.toString();
    };
    const v48 = v46.on('data', v47);
    v48;
    const v63 = () => {
        let lines = out.split('\n');
        const v49 = lines.shift();
        v49;
        const v50 = lines.pop();
        v50;
        const v52 = l => {
            const v51 = l.match(/1[\s]+\?$/);
            return v51;
        };
        const v53 = lines.filter(v52);
        const v57 = l => {
            const v54 = l.trim();
            const v55 = v54.split(' ');
            const v56 = v55[0];
            return v56;
        };
        let nums = v53.map(v57);
        const v58 = lines.length;
        const v59 = v58 > 0;
        if (v59) {
            const v60 = ['-9'];
            const v61 = v60.concat(nums);
            const v62 = child_process.spawn('kill', v61);
            v62;
        }
    };
    const v64 = ps.on('exit', v63);
    v64;
};
const rubySpawn = function (command, args, opts = {}, forceKill = false) {
    const v65 = [command];
    let cmd = v65.concat(args);
    const v66 = platform();
    const v67 = v66.match(/darwin|linux/);
    if (v67) {
        const v68 = process.env;
        const v69 = v68.SHELL;
        let shell = v69 || '/bin/bash';
        const base = path.basename(shell);
        const v70 = base === 'bash';
        if (v70) {
            shell = '/bin/bash';
        } else {
            const v71 = base === 'zsh';
            if (v71) {
                shell = '/bin/zsh';
            } else {
                const v72 = cmd.shift();
                const v73 = crossSpawn(v72, cmd, opts);
                return v73;
            }
        }
        let shellCmd = shellEscape(cmd);
        let finalCmd = shellCmd;
        const v74 = opts['cwd'];
        if (v74) {
            const v75 = opts['cwd'];
            const v76 = [
                'cd',
                v75
            ];
            const v77 = shellEscape(v76);
            finalCmd = `${ v77 } && ${ shellCmd }`;
        }
        let shellArgs = [
            '-l',
            '-c',
            finalCmd
        ];
        let child = child_process.spawn(shell, shellArgs, opts);
        if (forceKill) {
            const v82 = (code, signal) => {
                const v78 = [
                    'ruby',
                    command
                ];
                const v79 = v78.concat(args);
                const v80 = v79.join(' ');
                const v81 = kill(child, v80);
                v81;
            };
            const v83 = child.on('exit', v82);
            v83;
        }
        return child;
    } else {
        const v84 = cmd.shift();
        const v85 = crossSpawn(v84, cmd, opts);
        return v85;
    }
};
const v86 = {};
v86.rubySpawn = rubySpawn;
module.exports = v86;