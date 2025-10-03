import chalk from 'chalk';
import columns from 'cli-columns';
import { tools } from '@ckeditor/ckeditor5-dev-utils';
import util from 'util';
import assertNpmAuthorization from '../utils/assertnpmauthorization.js';
import { execFile } from 'child_process';
const execFilePromise = util.promisify(execFile);
export default const reassignNpmTags = async function ({npmOwner, version, packages}) {
    const errors = [];
    const packagesSkipped = [];
    const packagesUpdated = [];
    await assertNpmAuthorization(npmOwner);
    const v70 = packages.length;
    const v71 = { total: v70 };
    const counter = tools.createSpinner('Reassigning npm tags...', v71);
    const v72 = counter.start();
    v72;
    const v104 = async packageName => {
        const v73 = !packageName;
        const v74 = packageName.startsWith('-');
        const v75 = v73 || v74;
        const v76 = !version;
        const v77 = v75 || v76;
        const v78 = String(version);
        const v79 = v78.startsWith('-');
        const v80 = v77 || v79;
        if (v80) {
            const v81 = `Invalid package or version: ${ packageName }@${ version }`;
            const v82 = errors.push(v81);
            v82;
            const v83 = counter.increase();
            v83;
            return;
        }
        const run = () => {
            const v84 = [
                'dist-tag',
                'add',
                `${ packageName }@${ version }`,
                'latest'
            ];
            const v85 = execFilePromise('npm', v84);
            return v85;
        };
        const updateLatestTagRetryable = retry(run);
        const v86 = updateLatestTagRetryable();
        const v91 = response => {
            const v87 = response.stdout;
            const stdout = v87 || '';
            const v88 = response.stderr;
            const stderr = v88 || '';
            if (stdout) {
                const v89 = packagesUpdated.push(packageName);
                v89;
            } else {
                if (stderr) {
                    const v90 = new Error(stderr);
                    throw v90;
                }
            }
        };
        const v92 = v86.then(v91);
        const v100 = error => {
            const v93 = error.message;
            const v94 = String(v93);
            const v95 = v94.includes('is already set to version');
            if (v95) {
                const v96 = packagesSkipped.push(packageName);
                v96;
            } else {
                const v97 = error.message;
                const v98 = trimErrorMessage(v97);
                const v99 = errors.push(v98);
                v99;
            }
        };
        const v101 = v92.catch(v100);
        const v103 = () => {
            const v102 = counter.increase();
            v102;
        };
        await v101.finally(v103);
    };
    const updateTagPromises = packages.map(v104);
    await Promise.allSettled(updateTagPromises);
    const v105 = counter.finish();
    v105;
    const v106 = packagesUpdated.length;
    if (v106) {
        const v107 = chalk.bold;
        const v108 = v107.green('\u2728 Tags updated:');
        const v109 = console.log(v108);
        v109;
        const v110 = columns(packagesUpdated);
        const v111 = console.log(v110);
        v111;
    }
    const v112 = packagesSkipped.length;
    if (v112) {
        const v113 = chalk.bold;
        const v114 = v113.yellow('\u2B07️ Packages skipped:');
        const v115 = console.log(v114);
        v115;
        const v116 = columns(packagesSkipped);
        const v117 = console.log(v116);
        v117;
    }
    const v118 = errors.length;
    if (v118) {
        const v119 = chalk.bold;
        const v120 = v119.red('\uD83D\uDC1B Errors found:');
        const v121 = console.log(v120);
        v121;
        const v124 = msg => {
            const v122 = `* ${ msg }`;
            const v123 = console.log(v122);
            return v123;
        };
        const v125 = errors.forEach(v124);
        v125;
    }
};
const trimErrorMessage = function (message) {
    const v126 = message.replace(/npm ERR!.*\n/g, '');
    const v127 = v126.trim();
    return v127;
};
const retry = function (callback, times = 3) {
    const v138 = (...args) => {
        const v128 = Promise.resolve();
        const v130 = () => {
            const v129 = callback(...args);
            return v129;
        };
        const v131 = v128.then(v130);
        const v136 = err => {
            const v132 = times > 0;
            if (v132) {
                const v133 = times - 1;
                const v134 = retry(callback, v133);
                const v135 = v134(...args);
                return v135;
            }
            throw err;
        };
        const v137 = v131.catch(v136);
        return v137;
    };
    return v138;
};