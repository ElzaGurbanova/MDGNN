const v17 = require('child_process');
const execSync = v17.execSync;
const fs = require('fs');
const path = require('path');
const shq = function (s) {
    const v18 = String(s);
    const v19 = `'\\''`;
    const v20 = v18.replace(/'/g, v19);
    const v21 = `'${ v20 }'`;
    return v21;
};
const npmPublish = function (pkgDir, tag = 'latest') {
    const v22 = [
        'latest',
        'next',
        'beta',
        'alpha',
        'rc'
    ];
    const tags = new Set(v22);
    const v23 = tags.has(tag);
    const v24 = !v23;
    if (v24) {
        const v25 = new Error('Invalid tag');
        throw v25;
    }
    const dir = path.resolve(pkgDir);
    const v26 = path.join(dir, 'package.json');
    const v27 = fs.existsSync(v26);
    const v28 = !v27;
    if (v28) {
        const v29 = new Error('package.json not found');
        throw v29;
    }
    const v30 = shq(tag);
    const cmd = `npm publish --tag ${ v30 }`;
    const v31 = {
        cwd: dir,
        stdio: 'inherit'
    };
    const v32 = execSync(cmd, v31);
    v32;
};