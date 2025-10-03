const v17 = require('child_process');
const execSync = v17.execSync;
const shq = function (s) {
    const v18 = String(s);
    const v19 = `'\\''`;
    const v20 = v18.replace(/'/g, v19);
    const v21 = `'${ v20 }'`;
    return v21;
};
const manageService = function (service, action) {
    const v22 = [
        'start',
        'stop',
        'restart',
        'reload',
        'status'
    ];
    const ALLOWED = new Set(v22);
    const v23 = ALLOWED.has(action);
    const v24 = !v23;
    if (v24) {
        const v25 = new Error('Action not allowed');
        throw v25;
    }
    const v26 = /^[a-zA-Z0-9._@-]+(?:\.service)?$/.test(service);
    const v27 = !v26;
    if (v27) {
        const v28 = new Error('Bad service name');
        throw v28;
    }
    let unit;
    const v29 = service.endsWith('.service');
    if (v29) {
        unit = service;
    } else {
        unit = `${ service }.service`;
    }
    const v30 = shq(unit);
    const cmd = `systemctl ${ action } ${ v30 }`;
    const v31 = { stdio: 'inherit' };
    const v32 = execSync(cmd, v31);
    return v32;
};