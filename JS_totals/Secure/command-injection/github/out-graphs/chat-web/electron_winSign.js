const v57 = require('child_process');
const execFile = v57.execFile;
const fs = require('fs');
const path = require('path');
const splitArgs = function (str) {
    const v58 = !str;
    if (v58) {
        const v59 = [];
        return v59;
    }
    const out = [];
    const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let m;
    while (m = re.exec(str)) {
        const v60 = m[1];
        const v61 = m[2];
        const v62 = v60 || v61;
        const v63 = m[3];
        const v64 = v62 || v63;
        const v65 = out.push(v64);
        v65;
    }
    return out;
};
const v112 = async function (options) {
    const inPath = options.path;
    const appOutDir = path.dirname(inPath);
    const v74 = (resolve, reject) => {
        const v66 = [
            'find-generic-password',
            '-s',
            'riot_signing_token',
            '-w'
        ];
        const v67 = {};
        const v72 = (err, stdout) => {
            if (err) {
                const v68 = console.error('Couldn\'t find signing token in keychain', err);
                v68;
                const v69 = reject(err);
                v69;
            } else {
                const v70 = stdout.trim();
                const v71 = resolve(v70);
                v71;
            }
        };
        const v73 = execFile('security', v66, v67, v72);
        v73;
    };
    const tokenPassphrase = await new Promise(v74);
    const v110 = (resolve, reject) => {
        const v75 = Math.random();
        const v76 = v75.toString(36);
        const v77 = v76.substring(2, 15);
        const v78 = 'tmp_' + v77;
        const v79 = v78 + '.exe';
        const tmpFile = path.join(appOutDir, v79);
        const v80 = process.env;
        const v81 = v80.OSSLSIGNCODE_SIGNARGS;
        const v82 = v81 || '';
        const envArgs = splitArgs(v82);
        const v83 = options.hash;
        const baseArgs = [
            'sign',
            '-h',
            v83,
            '-pass',
            tokenPassphrase,
            '-in',
            inPath,
            '-out',
            tmpFile
        ];
        const v84 = options.isNest;
        if (v84) {
            const v85 = baseArgs.push('-nest');
            v85;
        }
        const v86 = baseArgs.slice(0, 1);
        const v87 = v86.concat(envArgs);
        const v88 = baseArgs.slice(1);
        const finalArgs = v87.concat(v88);
        const v89 = {};
        const v108 = (error, stdout) => {
            if (error) {
                const v90 = finalArgs.join(' ');
                const v91 = 'Running: osslsigncode ' + v90;
                const v92 = console.log(v91);
                v92;
                const v93 = stdout || '';
                const v94 = console.log(v93);
                v94;
                const v95 = error.code;
                const v96 = v95 || 'unknown';
                const v97 = 'osslsigncode failed with code ' + v96;
                const v98 = console.error(v97);
                v98;
                const v99 = error.code;
                const v100 = v99 || 'unknown';
                const v101 = 'osslsigncode failed with code ' + v100;
                const v102 = reject(v101);
                v102;
                return;
            }
            const v106 = err => {
                if (err) {
                    const v103 = console.error('Error renaming file', err);
                    v103;
                    const v104 = reject(err);
                    v104;
                } else {
                    const v105 = resolve();
                    v105;
                }
            };
            const v107 = fs.rename(tmpFile, inPath, v106);
            v107;
        };
        const v109 = execFile('osslsigncode', finalArgs, v89, v108);
        v109;
    };
    const v111 = new Promise(v110);
    return v111;
};
exports.default = v112;