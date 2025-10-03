const v16 = require('child_process');
const execSync = v16.execSync;
const fs = require('fs');
const path = require('path');
const shq = function (s) {
    const v17 = String(s);
    const v18 = `'\\''`;
    const v19 = v17.replace(/'/g, v18);
    const v20 = `'${ v19 }'`;
    return v20;
};
const calcDigest = function (filePath, algo = 'sha256') {
    const v21 = [
        'sha256',
        'sha512'
    ];
    const ALGO = new Set(v21);
    const v22 = ALGO.has(algo);
    const v23 = !v22;
    if (v23) {
        const v24 = new Error('Unsupported algorithm');
        throw v24;
    }
    const fp = path.resolve(filePath);
    const v25 = fs.existsSync(fp);
    const v26 = !v25;
    if (v26) {
        const v27 = new Error('File not found');
        throw v27;
    }
    const v28 = shq(fp);
    const cmd = `openssl dgst -${ algo } ${ v28 }`;
    const v29 = { encoding: 'utf8' };
    const out = execSync(cmd, v29);
    const v30 = out.trim();
    return v30;
};