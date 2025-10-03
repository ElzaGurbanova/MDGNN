import fs from 'node:fs';
import path from 'node:path';
import {
    execSync,
    execFileSync
} from 'node:child_process';
const root = process.cwd();
const tmpDir = path.join(root, '.precommit-sim');
const v72 = () => {
    const file = path.join(tmpDir, 'clean-sample.ts');
    const v71 = fs.writeFileSync(file, 'export const add = (a: number, b: number) => a + b;\n');
    v71;
};
const v73 = {};
v73.desc = 'All passing changes';
v73.mutate = v72;
const v75 = () => {
    const file = path.join(tmpDir, 'lint-error.ts');
    const v74 = fs.writeFileSync(file, 'const unused = 42;\nexport const ok = 1;\n');
    v74;
};
const v76 = {};
v76.desc = 'ESLint violation (unused variable)';
v76.mutate = v75;
const v78 = () => {
    const file = path.join(tmpDir, 'format-error.ts');
    const v77 = fs.writeFileSync(file, 'export const msg = "hi"\n');
    v77;
};
const v79 = {};
v79.desc = 'Formatting inconsistency (double quotes, no semicolon maybe tolerated)';
v79.mutate = v78;
const v81 = () => {
    const file = path.join(tmpDir, 'type-error.ts');
    const v80 = fs.writeFileSync(file, 'export const broken: number = "string";\n');
    v80;
};
const v82 = {};
v82.desc = 'TypeScript type mismatch';
v82.mutate = v81;
const scenarios = {};
scenarios.clean = v73;
scenarios['lint-error'] = v76;
scenarios['format-error'] = v79;
scenarios['type-error'] = v82;
const run = cmd => {
    const v83 = { stdio: 'pipe' };
    const v84 = execSync(cmd, v83);
    const v85 = v84.toString();
    return v85;
};
const stageFile = function (p) {
    const v86 = path.relative(root, p);
    const v87 = [
        'add',
        v86
    ];
    const v88 = execFileSync('git', v87);
    v88;
};
const resetTmp = function () {
    const v89 = fs.existsSync(tmpDir);
    if (v89) {
        const v90 = {
            recursive: true,
            force: true
        };
        const v91 = fs.rmSync(tmpDir, v90);
        v91;
    }
    const v92 = { recursive: true };
    const v93 = fs.mkdirSync(tmpDir, v92);
    v93;
};
const runHookLike = function () {
    const v94 = { stdio: 'inherit' };
    const v95 = execSync('npx lint-staged', v94);
    v95;
    const v96 = run('git diff --cached --name-only --diff-filter=ACM');
    const v97 = v96.split(/\r?\n/);
    const v101 = f => {
        const v98 = f.endsWith('.ts');
        const v99 = f.endsWith('.tsx');
        const v100 = v98 || v99;
        return v100;
    };
    const changedTs = v97.filter(v101);
    const v102 = changedTs.length;
    if (v102) {
        const v103 = { stdio: 'inherit' };
        const v104 = execSync('pnpm -w type-check', v103);
        v104;
    }
};
const simulate = function (name) {
    const scenario = scenarios[name];
    const v105 = !scenario;
    if (v105) {
        const v106 = `Unknown scenario: ${ name }`;
        const v107 = console.error(v106);
        v107;
        const v108 = process.exit(2);
        v108;
    }
    const v109 = scenario.desc;
    const v110 = `\n▶ Scenario: ${ name } – ${ v109 }`;
    const v111 = console.log(v110);
    v111;
    const v112 = resetTmp();
    v112;
    const v113 = scenario.mutate();
    v113;
    let f;
    const v114 = fs.readdirSync(tmpDir);
    for (f of v114) {
        const v115 = path.join(tmpDir, f);
        const v116 = stageFile(v115);
        v116;
    }
    let passed = true;
    try {
        const v117 = runHookLike();
        v117;
    } catch (e) {
        passed = false;
    }
    const v118 = execSync('git reset HEAD .');
    v118;
    let v119;
    if (passed) {
        v119 = `✅ Scenario '${ name }' passed`;
    } else {
        v119 = `❌ Scenario '${ name }' failed (expected depending on case)`;
    }
    const v120 = console.log(v119);
    v120;
    return passed;
};
const v121 = process.argv;
const arg = v121[2];
if (arg) {
    const success = simulate(arg);
    const v122 = !success;
    const v123 = arg === 'clean';
    const v124 = v122 && v123;
    if (v124) {
        const v125 = process.exit(1);
        v125;
    }
    const v126 = process.exit(0);
    v126;
}
let overall = true;
let name;
const v127 = Object.keys(scenarios);
for (name of v127) {
    const expectedFail = name !== 'clean';
    const result = simulate(name);
    const v128 = expectedFail && result;
    if (v128) {
        const v129 = `⚠ Expected failure for scenario '${ name }' but it passed.`;
        const v130 = console.error(v129);
        v130;
        overall = false;
    }
    const v131 = !expectedFail;
    const v132 = !result;
    const v133 = v131 && v132;
    if (v133) {
        const v134 = `⚠ Expected pass for scenario '${ name }' but it failed.`;
        const v135 = console.error(v134);
        v135;
        overall = false;
    }
}
const v136 = resetTmp();
v136;
const v137 = !overall;
if (v137) {
    const v138 = console.error('\u274C One or more scenario expectations not met.');
    v138;
    const v139 = process.exit(1);
    v139;
}
const v140 = console.log('\n\uD83C\uDF89 All scenario expectations met.');
v140;