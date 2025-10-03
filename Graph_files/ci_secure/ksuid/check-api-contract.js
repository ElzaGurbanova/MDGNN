const v75 = require('child_process');
const spawn = v75.spawn;
const v76 = ['npm'];
const ALLOWED_COMMANDS = new Set(v76);
const runCommand = function (command, args = []) {
    const v77 = ALLOWED_COMMANDS.has(command);
    const v78 = !v77;
    if (v78) {
        const v79 = Array.from(ALLOWED_COMMANDS);
        const v80 = v79.join(', ');
        const v81 = new Error(`Command '${ command }' is not allowed. Allowed commands: ${ v80 }`);
        throw v81;
    }
    const v88 = (resolve, reject) => {
        const v82 = process.cwd();
        const v83 = {
            stdio: 'inherit',
            cwd: v82
        };
        const child = spawn(command, args, v83);
        const v85 = code => {
            const v84 = resolve(code);
            v84;
        };
        const v86 = child.on('close', v85);
        v86;
        const v87 = child.on('error', reject);
        v87;
    };
    const v89 = new Promise(v88);
    return v89;
};
const main = async function () {
    const v90 = console.log('\uD83D\uDD0D API Contract Checker');
    v90;
    const v91 = console.log('========================');
    v91;
    const v92 = console.log('');
    v92;
    const v93 = console.log('This tool helps ensure your changes don\'t introduce breaking changes.');
    v93;
    const v94 = console.log('');
    v94;
    try {
        const v95 = console.log('\uD83D\uDCE6 Building project...');
        v95;
        const v96 = [
            'run',
            'build'
        ];
        const buildCode = await runCommand('npm', v96);
        const v97 = buildCode !== 0;
        if (v97) {
            const v98 = console.error('\u274C Build failed. Please fix build errors before checking API contract.');
            v98;
            const v99 = process.exit(1);
            v99;
        }
        const v100 = console.log('\u2705 Build successful!');
        v100;
        const v101 = console.log('');
        v101;
        const v102 = console.log('\uD83E\uDDEA Running API contract tests...');
        v102;
        const v103 = console.log('');
        v103;
        const v104 = [
            'run',
            'test:contract'
        ];
        const contractCode = await runCommand('npm', v104);
        const v105 = contractCode === 0;
        if (v105) {
            const v106 = console.log('');
            v106;
            const v107 = console.log('\uD83C\uDF89 All API contract tests passed!');
            v107;
            const v108 = console.log('');
            v108;
            const v109 = console.log('\u2705 Your changes are safe for MINOR or PATCH releases');
            v109;
            const v110 = console.log('\uD83D\uDCA1 No breaking changes detected - you\'re good to go!');
            v110;
        } else {
            const v111 = console.log('');
            v111;
            const v112 = console.log('\u26A0️  API contract tests failed!');
            v112;
            const v113 = console.log('');
            v113;
            const v114 = console.log('\uD83D\uDEA8 BREAKING CHANGES DETECTED');
            v114;
            const v115 = console.log('');
            v115;
            const v116 = console.log('Your changes introduce breaking changes that will require a MAJOR version bump.');
            v116;
            const v117 = console.log('');
            v117;
            const v118 = console.log('\uD83D\uDCCB Next Steps:');
            v118;
            const v119 = console.log('');
            v119;
            const v120 = console.log('1. Review the test failures above');
            v120;
            const v121 = console.log('2. Check docs/api-versioning.md for breaking change guidelines');
            v121;
            const v122 = console.log('3. Decide if these breaking changes are intentional:');
            v122;
            const v123 = console.log('');
            v123;
            const v124 = console.log('   \uD83C\uDFAF If INTENTIONAL (new major version):');
            v124;
            const v125 = console.log('   - Plan for major version release (e.g., 1.0.0 \u2192 2.0.0)');
            v125;
            const v126 = console.log('   - Update API contract tests to match new API');
            v126;
            const v127 = console.log('   - Document changes in CHANGELOG.md');
            v127;
            const v128 = console.log('   - Provide migration guide for users');
            v128;
            const v129 = console.log('');
            v129;
            const v130 = console.log('   \uD83D\uDD27 If UNINTENTIONAL (maintain compatibility):');
            v130;
            const v131 = console.log('   - Modify your changes to avoid breaking the API');
            v131;
            const v132 = console.log('   - Ensure backward compatibility is maintained');
            v132;
            const v133 = console.log('   - Run this script again to verify');
            v133;
            const v134 = console.log('');
            v134;
            const v135 = console.log('\uD83D\uDCA1 Tip: Run individual contract test suites:');
            v135;
            const v136 = console.log('   - npm test test/api-contract/api-contract.test.ts');
            v136;
            const v137 = console.log('   - npm test test/api-contract/cli-contract.test.ts');
            v137;
            const v138 = console.log('   - npm test test/api-contract/type-contract.test.ts');
            v138;
            const v139 = process.exit(1);
            v139;
        }
    } catch (error) {
        const v140 = error.message;
        const v141 = console.error('\u274C Error running API contract tests:', v140);
        v141;
        const v142 = process.exit(1);
        v142;
    }
};
const v143 = require.main;
const v144 = v143 === module;
if (v144) {
    const v145 = main();
    const v146 = console.error;
    const v147 = v145.catch(v146);
    v147;
}
const v148 = {};
v148.main = main;
module.exports = v148;