const v27 = require('child_process');
const execSync = v27.execSync;
const fs = require('fs');
const path = require('path');
const shq = function (s) {
    const v28 = String(s);
    const v29 = `'\\''`;
    const v30 = v28.replace(/'/g, v29);
    const v31 = `'${ v30 }'`;
    return v31;
};
const v32 = [
    'web1',
    'web2',
    'backup'
];
const ALLOWED_HOSTS = new Set(v32);
const rsyncUpload = function (localDir, hostAlias, remoteDir) {
    const v33 = ALLOWED_HOSTS.has(hostAlias);
    const v34 = !v33;
    if (v34) {
        const v35 = new Error('Host not allowed');
        throw v35;
    }
    const ld = path.resolve(localDir);
    const v36 = fs.existsSync(ld);
    const v37 = !v36;
    const v38 = fs.statSync(ld);
    const v39 = v38.isDirectory();
    const v40 = !v39;
    const v41 = v37 || v40;
    if (v41) {
        const v42 = new Error('Local dir invalid');
        throw v42;
    }
    const v43 = /^\/[A-Za-z0-9/_-]+$/.test(remoteDir);
    const v44 = !v43;
    if (v44) {
        const v45 = new Error('Bad remote dir');
        throw v45;
    }
    const v46 = path.sep;
    const v47 = ld + v46;
    const v48 = shq(v47);
    const v49 = `${ hostAlias }:${ remoteDir }`;
    const v50 = shq(v49);
    const cmd = `rsync -az --delete ${ v48 } ${ v50 }`;
    const v51 = { stdio: 'inherit' };
    const v52 = execSync(cmd, v51);
    v52;
};