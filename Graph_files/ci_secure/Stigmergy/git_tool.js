import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
const splitArgs = function (str) {
    const v45 = !str;
    if (v45) {
        const v46 = [];
        return v46;
    }
    const out = [];
    const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let m;
    while (m = re.exec(str)) {
        const v47 = m[1];
        const v48 = m[2];
        const v49 = v47 || v48;
        const v50 = m[3];
        const v51 = v49 || v50;
        const v52 = out.push(v51);
        v52;
    }
    return out;
};
const runFile = async function (cmd, argv) {
    const v54 = 1024 * 1024;
    const v55 = {
        shell: false,
        maxBuffer: v54
    };
    const v53 = await execFileAsync(cmd, argv, v55);
    const stdout = v53.stdout;
    const stderr = v53.stderr;
    const v56 = {};
    v56.stdout = stdout;
    v56.stderr = stderr;
    return v56;
};
const runCommand = async function (command) {
    const v57 = String(command);
    const v58 = splitArgs(v57);
    const [cmd, ...argv] = v58;
    const v59 = !cmd;
    if (v59) {
        const v60 = new Error('Empty command');
        throw v60;
    }
    const v61 = runFile(cmd, argv);
    return v61;
};
export const commit = async function ({message}) {
    const v62 = !message;
    const v63 = message.trim();
    const v64 = v63 === '';
    const v65 = v62 || v64;
    if (v65) {
        const v66 = new Error('A non-empty commit message is required.');
        throw v66;
    }
    const v67 = [
        'add',
        '.'
    ];
    await runFile('git', v67);
    const v69 = [
        'commit',
        '-m',
        message
    ];
    const v68 = await runFile('git', v69);
    const stdout = v68.stdout;
    const v70 = stdout.trim();
    const v71 = `Successfully committed changes: ${ v70 }`;
    return v71;
};
export const push = async function ({remote = 'origin', branch = 'main'}) {
    const v72 = !remote;
    const v73 = !branch;
    const v74 = v72 || v73;
    if (v74) {
        const v75 = new Error('Both \'remote\' and \'branch\' are required for push.');
        throw v75;
    }
    const validPattern = /^[a-zA-Z0-9_.\-\/]+$/;
    const v76 = validPattern.test(remote);
    const v77 = !v76;
    const v78 = validPattern.test(branch);
    const v79 = !v78;
    const v80 = v77 || v79;
    if (v80) {
        const v81 = new Error('Invalid remote or branch name contains unsafe characters.');
        throw v81;
    }
    const v83 = [
        'push',
        remote,
        branch
    ];
    const v82 = await runFile('git', v83);
    const stdout = v82.stdout;
    const stderr = v82.stderr;
    const v84 = stderr.includes('Everything up-to-date');
    const v85 = !v84;
    const v86 = stderr && v85;
    if (v86) {
        const v87 = `Push completed with warnings: ${ stderr }`;
        return v87;
    }
    const v88 = `Successfully pushed to ${ remote }/${ branch }.`;
    return v88;
};