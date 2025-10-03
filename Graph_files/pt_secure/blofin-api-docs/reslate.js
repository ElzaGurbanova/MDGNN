'use strict';
const cp = require('child_process');
const path = require('path');
const sh = require('shelljs');
const v46 = {};
const v47 = process.env;
const v48 = process.cwd();
const v49 = path.relative(__dirname, v48);
const v50 = path.sep;
const v51 = '\\' + v50;
const v52 = new RegExp(v51, 'g');
const v53 = v49.replace(v52, '/');
const v54 = path.resolve(__dirname, './node_modules');
const v55 = path.sep;
const v56 = '\\' + v55;
const v57 = new RegExp(v56, 'g');
const v58 = v54.replace(v57, '/');
const v59 = {
    'SLATEDIR': v53,
    'NODE_PATH': v58
};
const env = Object.assign(v46, v47, v59);
const v60 = process.argv;
const v61 = v60[2];
const v62 = v61 === 'init';
if (v62) {
    const v63 = __dirname + '/slate/*';
    const v64 = sh.cp('-R', v63, '.');
    v64;
} else {
    const v65 = process.argv;
    const v66 = v65[2];
    const v67 = v66 === 'build';
    if (v67) {
        const v68 = process.platform;
        const v69 = /^win/.test(v68);
        let v70;
        if (v69) {
            v70 = 'npm.cmd';
        } else {
            v70 = 'npm';
        }
        const v71 = [
            'run',
            'build.local'
        ];
        const v72 = {
            stdio: 'inherit',
            cwd: __dirname,
            env
        };
        const v75 = function (err, output) {
            if (err) {
                const v73 = console.warn(err);
                v73;
            }
            const v74 = console.log(output);
            v74;
        };
        const v76 = cp.spawn(v70, v71, v72, v75);
        v76;
    } else {
        const v77 = process.argv;
        const v78 = v77[2];
        const v79 = v78 === 'serve';
        if (v79) {
            const v80 = process.platform;
            const v81 = /^win/.test(v80);
            let v82;
            if (v81) {
                v82 = 'npm.cmd';
            } else {
                v82 = 'npm';
            }
            const v83 = [
                'run',
                'serve.local'
            ];
            const v84 = {
                stdio: 'inherit',
                cwd: __dirname,
                env
            };
            const v87 = function (err, output) {
                if (err) {
                    const v85 = console.warn(err);
                    v85;
                }
                const v86 = console.log(output);
                v86;
            };
            const v88 = cp.spawn(v82, v83, v84, v87);
            v88;
        } else {
            const v89 = console.warn('Usage: slate [init|build|serve]');
            v89;
            const v90 = process.exit(1);
            v90;
        }
    }
}