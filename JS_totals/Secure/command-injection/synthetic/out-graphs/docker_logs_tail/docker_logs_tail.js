const v20 = require('child_process');
const execSync = v20.execSync;
const shq = function (s) {
    const v21 = String(s);
    const v22 = `'\\''`;
    const v23 = v21.replace(/'/g, v22);
    const v24 = `'${ v23 }'`;
    return v24;
};
const dockerTailLogs = function (containerName, lines = 100) {
    const v25 = /^[a-zA-Z0-9._-]+$/.test(containerName);
    const v26 = !v25;
    if (v26) {
        const v27 = new Error('Invalid container name');
        throw v27;
    }
    const v28 = Number.isInteger(lines);
    const v29 = !v28;
    const v30 = lines < 1;
    const v31 = v29 || v30;
    const v32 = lines > 10000;
    const v33 = v31 || v32;
    if (v33) {
        const v34 = new Error('Invalid lines');
        throw v34;
    }
    const v35 = shq(containerName);
    const cmd = `docker logs --tail ${ lines } -f ${ v35 }`;
    const v36 = shq(containerName);
    const onceCmd = `docker logs --tail ${ lines } ${ v36 }`;
    const v37 = [
        'ignore',
        'pipe',
        'pipe'
    ];
    const v38 = {
        encoding: 'utf8',
        stdio: v37
    };
    const out = execSync(onceCmd, v38);
    return out;
};