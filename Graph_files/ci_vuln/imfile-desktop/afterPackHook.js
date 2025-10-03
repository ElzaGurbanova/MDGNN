const fs = require('node:fs');
const v39 = require('node:child_process');
const spawn = v39.spawn;
const v40 = require('node:process');
const chdir = v40.chdir;
const pkg = require('../package.json');
const v41 = pkg.name;
const binName = `${ v41 }`.toLowerCase();
const exec = async function exec(cmd, args = []) {
    const v42 = { shell: true };
    const child = spawn(cmd, args, v42);
    const v43 = redirectOutputFor(child);
    v43;
    await waitFor(child);
};
const redirectOutputFor = child => {
    const printStdout = data => {
        const v44 = process.stdout;
        const v45 = data.toString();
        const v46 = v44.write(v45);
        v46;
    };
    const printStderr = data => {
        const v47 = process.stderr;
        const v48 = data.toString();
        const v49 = v47.write(v48);
        v49;
    };
    const v50 = child.stdout;
    const v51 = v50.on('data', printStdout);
    v51;
    const v52 = child.stderr;
    const v53 = v52.on('data', printStderr);
    v53;
    const v58 = () => {
        const v54 = child.stdout;
        const v55 = v54.off('data', printStdout);
        v55;
        const v56 = child.stderr;
        const v57 = v56.off('data', printStderr);
        v57;
    };
    const v59 = child.once('close', v58);
    v59;
};
const waitFor = async function (child) {
    const v63 = resolve => {
        const v61 = () => {
            const v60 = resolve();
            return v60;
        };
        const v62 = child.once('close', v61);
        v62;
    };
    const v64 = new Promise(v63);
    return v64;
};
const linuxTargets = [
    'AppImage',
    'deb',
    'rpm',
    'snap'
];
const v76 = async function (context) {
    const v65 = console.warn('after build; disable sandbox');
    v65;
    const v66 = context.targets;
    const v68 = target => {
        const v67 = linuxTargets.includes(target);
        return v67;
    };
    const isLinux = v66.find(v68);
    const v69 = !isLinux;
    if (v69) {
        return;
    }
    const originalDir = process.cwd();
    const dirname = context.appOutDir;
    const v70 = chdir(dirname);
    v70;
    const v71 = binName + '.bin';
    const v72 = [
        binName,
        v71
    ];
    await exec('mv', v72);
    const wrapperScript = `#!/bin/bash
    "\${BASH_SOURCE%/*}"/${ binName }.bin "$@" --no-sandbox
  `;
    const v73 = fs.writeFileSync(binName, wrapperScript);
    v73;
    const v74 = [
        '+x',
        binName
    ];
    await exec('chmod', v74);
    const v75 = chdir(originalDir);
    v75;
};
module.exports = v76;