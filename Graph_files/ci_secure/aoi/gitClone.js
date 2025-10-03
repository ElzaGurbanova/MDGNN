const v44 = require('child_process');
const execFile = v44.execFile;
const v45 = require('util');
const promisify = v45.promisify;
const execFileAsync = promisify(execFile);
const v85 = async d => {
    const v46 = d.util;
    const data = v46.aoiFunc(d);
    const v47 = data.inside;
    const args = '' = v47.splits[0];
    const v48 = args || '';
    const v49 = String(v48);
    const repo = v49.trim();
    const v50 = !repo;
    const v51 = /\s/.test(repo);
    const v52 = v50 || v51;
    if (v52) {
        data.result = 'Repository URL is required (no spaces).';
        const v53 = d.util;
        const v54 = v53.setCode(data);
        const v55 = {};
        v55.code = v54;
        return v55;
    }
    const v56 = /^https?:\/\/[^ ]+\.git$/.test(repo);
    const v57 = /^git:\/\/[^ ]+\.git$/.test(repo);
    const v58 = v56 || v57;
    const v59 = /^ssh:\/\/[^ ]+\.git$/.test(repo);
    const v60 = v58 || v59;
    const v61 = /^[\w.-]+@[\w.-]+:[\w./-]+\.git$/.test(repo);
    const looksLikeRepo = v60 || v61;
    const v62 = !looksLikeRepo;
    if (v62) {
        data.result = 'Invalid repository URL/SSH spec.';
        const v63 = d.util;
        const v64 = v63.setCode(data);
        const v65 = {};
        v65.code = v64;
        return v65;
    }
    try {
        const v67 = [
            'clone',
            repo
        ];
        const v68 = 1024 * 1024;
        const v69 = {
            shell: false,
            maxBuffer: v68
        };
        const v66 = await execFileAsync('git', v67, v69);
        const stdout = v66.stdout;
        const stderr = v66.stderr;
        const v70 = /Cloning into/i.test(stderr);
        const v71 = !v70;
        const v72 = stderr && v71;
        if (v72) {
            const v73 = console.warn('Git clone warning:', stderr);
            v73;
        }
        const m = repo.match(/([^/]+)\.git$/);
        let repoName;
        const v74 = m[1];
        if (m) {
            repoName = v74;
        } else {
            repoName = repo;
        }
        data.result = `Successfully cloned repository: ${ repoName }`;
    } catch (error) {
        const v75 = error.stderr;
        const v76 = error.message;
        const v77 = v75 || v76;
        const v78 = console.error('Git clone error:', v77);
        v78;
        const v79 = error.stderr;
        const v80 = error.message;
        const v81 = v79 || v80;
        data.result = `Clone failed: ${ v81 }`;
    }
    const v82 = d.util;
    const v83 = v82.setCode(data);
    const v84 = {};
    v84.code = v83;
    return v84;
};
const v86 = {};
v86.name = '$gitClone';
v86.type = 'function';
v86.code = v85;
module.exports = v86;