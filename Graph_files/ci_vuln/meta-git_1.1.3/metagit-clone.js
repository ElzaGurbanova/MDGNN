const exec = require('meta-exec');
const fs = require('fs');
const v35 = require('debug');
const debug = v35('meta-git-clone');
const getMetaFile = require('get-meta-file');
const path = require('path');
const program = require('commander');
const util = require('util');
const v36 = process.argv;
const v37 = v36[2];
const v38 = !v37;
const v39 = process.argv;
const v40 = v39[2];
const v41 = v40 === '--help';
const v42 = v38 || v41;
if (v42) {
    const v43 = `\n  usage:\n\n    meta git clone <metaRepoUrl>\n`;
    const v44 = console.log(v43);
    return v44;
}
let repoUrl;
const v45 = process.argv;
const v46 = v45[2];
const v47 = v46 === 'blank';
const v48 = process.argv;
const v49 = v48[3];
const v50 = process.argv;
const v51 = v50[2];
if (v47) {
    repoUrl = v49;
} else {
    repoUrl = v51;
}
const v52 = path.basename(repoUrl);
const dirname = v52.replace('.git', '');
const v53 = `meta git cloning into \'${ repoUrl }\' at ${ dirname }`;
const v54 = console.log(v53);
v54;
const v55 = {
    cmd: `git clone ${ repoUrl } ${ dirname }`,
    displayDir: dirname
};
const v67 = (err, result) => {
    if (err) {
        throw err;
    }
    const newDir = path.resolve(dirname);
    const v56 = `chdir to ${ newDir }`;
    const v57 = debug(v56);
    v57;
    const v58 = process.chdir(newDir);
    v58;
    const meta = getMetaFile();
    const projects = meta.projects;
    const folders = Object.keys(projects);
    var folder = null;
    const child = function (err) {
        if (err) {
            throw err;
        }
        const v59 = folders.length;
        const v60 = !v59;
        if (v60) {
            return 0;
        }
        folder = folders.pop();
        const gitUrl = projects[folder];
        const v61 = path.join(newDir, folder);
        const v62 = {
            cmd: `git clone ${ gitUrl } ${ folder }`,
            displayDir: v61
        };
        const v64 = err => {
            if (err) {
                throw err;
            }
            const v63 = child();
            v63;
        };
        const v65 = exec(v62, v64);
        v65;
    };
    const v66 = child();
    v66;
};
const v68 = exec(v55, v67);
v68;