import {
    spawn,
    spawnSync
} from 'child_process';
const makeSpawnOptions = function (options) {
    const spawnOptions = {};
    spawnOptions.shell = true;
    const v23 = options.cwd;
    const v24 = options && v23;
    if (v24) {
        const v25 = options.cwd;
        spawnOptions.cwd = v25;
    }
    const v26 = options.env;
    const v27 = options && v26;
    if (v27) {
        const v28 = options.env;
        spawnOptions.env = v28;
    }
    return spawnOptions;
};
export const execute = function (command, args, options) {
    const spawnOptions = makeSpawnOptions(options);
    const v42 = (resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const proc = spawn(command, args, spawnOptions);
        const v29 = proc.stdout;
        const v30 = data => {
            stdout = stdout + data;
        };
        const v31 = v29.on('data', v30);
        v31;
        const v32 = proc.stderr;
        const v33 = data => {
            stderr = stderr + data;
        };
        const v34 = v32.on('data', v33);
        v34;
        const v40 = code => {
            const v35 = code !== 0;
            if (v35) {
                const v36 = stdout || stderr;
                const v37 = reject(v36);
                return v37;
            }
            const v38 = stdout || stderr;
            const v39 = resolve(v38);
            v39;
        };
        const v41 = proc.on('close', v40);
        v41;
    };
    const v43 = new Promise(v42);
    return v43;
};
export const executeSync = function (command, args, options) {
    const spawnOptions = makeSpawnOptions(options);
    const v44 = spawnSync(command, args, spawnOptions);
    return v44;
};