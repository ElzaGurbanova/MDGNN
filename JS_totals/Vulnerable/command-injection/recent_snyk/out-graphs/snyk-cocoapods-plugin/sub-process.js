import * as childProcess from 'child_process';
export const execute = function (command, args = [], options) {
    const spawnOptions = {};
    spawnOptions.shell = true;
    const v20 = options.cwd;
    const v21 = options && v20;
    if (v21) {
        const v22 = options.cwd;
        spawnOptions.cwd = v22;
    }
    const v37 = (resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const proc = childProcess.spawn(command, args, spawnOptions);
        const v23 = proc.stdout;
        const v24 = data => {
            stdout = stdout + data;
        };
        const v25 = v23.on('data', v24);
        v25;
        const v26 = proc.stderr;
        const v27 = data => {
            stderr = stderr + data;
        };
        const v28 = v26.on('data', v27);
        v28;
        const v35 = code => {
            const v29 = code !== 0;
            if (v29) {
                const v30 = stdout || stderr;
                const v31 = new Error(v30);
                const v32 = reject(v31);
                return v32;
            }
            const v33 = stdout || stderr;
            const v34 = resolve(v33);
            v34;
        };
        const v36 = proc.on('close', v35);
        v36;
    };
    const v38 = new Promise(v37);
    return v38;
};