import * as childProcess from 'child_process';
export const execute = function (command, args, options) {
    const spawnOptions = {};
    spawnOptions.shell = true;
    const v17 = options.cwd;
    const v18 = options && v17;
    if (v18) {
        const v19 = options.cwd;
        spawnOptions.cwd = v19;
    }
    const v31 = (resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const proc = childProcess.spawn(command, args, spawnOptions);
        const v20 = proc.stdout;
        const v21 = data => {
            stdout = stdout + data;
        };
        const v22 = v20.on('data', v21);
        v22;
        const v23 = proc.stderr;
        const v24 = data => {
            stderr = stderr + data;
        };
        const v25 = v23.on('data', v24);
        v25;
        const v29 = code => {
            const output = {};
            output.stdout = stdout;
            output.stderr = stderr;
            const v26 = code !== 0;
            if (v26) {
                const v27 = reject(output);
                return v27;
            }
            const v28 = resolve(output);
            v28;
        };
        const v30 = proc.on('close', v29);
        v30;
    };
    const v32 = new Promise(v31);
    return v32;
};