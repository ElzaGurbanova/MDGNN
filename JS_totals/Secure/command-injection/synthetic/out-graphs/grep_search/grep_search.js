const v26 = require('child_process');
const execSync = v26.execSync;
const fs = require('fs');
const path = require('path');
const shq = function (s) {
    const v27 = String(s);
    const v28 = `'\\''`;
    const v29 = v27.replace(/'/g, v28);
    const v30 = `'${ v29 }'`;
    return v30;
};
const safeSearch = function (projectDir, term, glob = '*.js') {
    const root = path.resolve(projectDir);
    const v31 = fs.existsSync(root);
    const v32 = !v31;
    const v33 = fs.statSync(root);
    const v34 = v33.isDirectory();
    const v35 = !v34;
    const v36 = v32 || v35;
    if (v36) {
        const v37 = new Error('Bad project dir');
        throw v37;
    }
    const v38 = /^[\w .,:@#%+=/()-]{1,80}$/.test(term);
    const v39 = !v38;
    if (v39) {
        const v40 = new Error('Invalid search term');
        throw v40;
    }
    const v41 = /^[\w.*?-]{1,40}$/.test(glob);
    const v42 = !v41;
    if (v42) {
        const v43 = new Error('Invalid glob');
        throw v43;
    }
    const v44 = shq(glob);
    const v45 = shq(term);
    const v46 = shq(root);
    const cmd = `grep -R --line-number --color=never --include=${ v44 } ${ v45 } ${ v46 }`;
    try {
        const v47 = [
            'ignore',
            'pipe',
            'pipe'
        ];
        const v48 = {
            encoding: 'utf8',
            stdio: v47
        };
        const out = execSync(cmd, v48);
        return out;
    } catch (e) {
        const v49 = e.status;
        const v50 = v49 === 1;
        if (v50) {
            return '';
        }
        throw e;
    }
};