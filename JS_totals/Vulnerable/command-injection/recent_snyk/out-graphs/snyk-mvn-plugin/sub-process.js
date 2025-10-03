import * as childProcess from 'child_process';
import { debug } from './index';
export const execute = function (command, args, options) {
    const spawnOptions = {};
    spawnOptions.shell = true;
    const v35 = options.cwd;
    const v36 = options && v35;
    if (v36) {
        const v37 = options.cwd;
        spawnOptions.cwd = v37;
    }
    const v67 = (resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const proc = childProcess.spawn(command, args, spawnOptions);
        const v38 = proc.stdout;
        const v39 = data => {
            stdout = stdout + data;
        };
        const v40 = v38.on('data', v39);
        v40;
        const v41 = proc.stderr;
        const v42 = data => {
            stderr = stderr + data;
        };
        const v43 = v41.on('data', v42);
        v43;
        const v47 = err => {
            const v44 = err.message;
            const v45 = `Child process errored with: ${ v44 }`;
            const v46 = debug(v45);
            v46;
        };
        const v48 = proc.on('error', v47);
        v48;
        const v51 = code => {
            const v49 = `Child process exited with code: ${ code }`;
            const v50 = debug(v49);
            v50;
        };
        const v52 = proc.on('exit', v51);
        v52;
        const v65 = code => {
            const v53 = code !== 0;
            if (v53) {
                const v54 = `Child process failed with exit code: ${ code }`;
                const v55 = debug(v54, '----------------', 'STDERR:', stderr, '----------------', 'STDOUT:', stdout, '----------------');
                v55;
                let stdErrMessage;
                if (stderr) {
                    stdErrMessage = `\nSTDERR:\n${ stderr }`;
                } else {
                    stdErrMessage = '';
                }
                let stdOutMessage;
                if (stdout) {
                    stdOutMessage = `\nSTDOUT:\n${ stdout }`;
                } else {
                    stdOutMessage = '';
                }
                let debugSuggestion;
                const v56 = process.env;
                const v57 = v56.DEBUG;
                if (v57) {
                    debugSuggestion = '';
                } else {
                    debugSuggestion = `\nRun in debug mode (-d) to see STDERR and STDOUT.`;
                }
                const v58 = `Child process failed with exit code: ${ code }.` + debugSuggestion;
                const v59 = stdErrMessage || stdOutMessage;
                const v60 = v58 + v59;
                const v61 = new Error(v60);
                const v62 = reject(v61);
                return v62;
            }
            const v63 = stdout || stderr;
            const v64 = resolve(v63);
            v64;
        };
        const v66 = proc.on('close', v65);
        v66;
    };
    const v68 = new Promise(v67);
    return v68;
};