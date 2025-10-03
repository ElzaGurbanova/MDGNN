const v19 = require('child_process');
const execSync = v19.execSync;
const fs = require('fs');
const path = require('path');
const shq = function (s) {
    const v20 = String(s);
    const v21 = `'\\''`;
    const v22 = v20.replace(/'/g, v21);
    const v23 = `'${ v22 }'`;
    return v23;
};
const extractTarGz = function (archivePath, destDir) {
    const ap = path.resolve(archivePath);
    const dp = path.resolve(destDir);
    const v24 = ap.endsWith('.tar.gz');
    const v25 = !v24;
    if (v25) {
        const v26 = new Error('Only .tar.gz allowed');
        throw v26;
    }
    const v27 = fs.existsSync(ap);
    const v28 = !v27;
    if (v28) {
        const v29 = new Error('Archive not found');
        throw v29;
    }
    const v30 = fs.existsSync(dp);
    const v31 = !v30;
    if (v31) {
        const v32 = new Error('Destination not found');
        throw v32;
    }
    const v33 = shq(ap);
    const v34 = shq(dp);
    const cmd = `tar --extract --gunzip --file ${ v33 } --directory ${ v34 } --no-same-owner --no-same-permissions`;
    const v35 = { stdio: 'inherit' };
    const v36 = execSync(cmd, v35);
    v36;
};