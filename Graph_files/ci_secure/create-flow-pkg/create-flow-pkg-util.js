const cp = require('child_process');
const path = require('path');
const v74 = require('command-exists');
const cmdExists = v74.sync;
const fs = require('fs');
const v75 = {};
v75.installDevDeps = installDevDeps;
v75.checkYarn = checkYarn;
v75.cpSkeleton = cpSkeleton;
v75.updatePackageJson = updatePackageJson;
v75.getPkg = getPkg;
module.exports = v75;
const getPkg = function () {
    const v76 = getPkgFile();
    const v77 = require(v76);
    return v77;
};
const getPkgFile = function () {
    const v78 = process.cwd();
    const v79 = path.resolve(v78, './package.json');
    return v79;
};
const updatePackageJson = function (isLib = false, isBrowser = false) {
    const file = getPkgFile();
    const pkg = getPkg();
    const v80 = pkg.name;
    const filename = v80 + '.js';
    const v81 = 'dist/' + filename;
    let v82;
    if (isLib) {
        v82 = filename;
    } else {
        v82 = v81;
    }
    pkg.main = v82;
    const v83 = pkg.engines;
    const v84 = !v83;
    const v85 = pkg.engines;
    const v86 = v85.node;
    const v87 = !v86;
    const v88 = v84 || v87;
    if (v88) {
        const v89 = pkg.engines;
        const v90 = {};
        pkg.engines = v89 || v90;
        const v91 = pkg.engines;
        v91.node = '>= 6';
    }
    pkg.browser = isBrowser;
    const v92 = pkg.scripts;
    const v93 = !v92;
    if (v93) {
        const v94 = {};
        pkg.scripts = v94;
    }
    const v95 = pkg.scripts;
    v95.build = 'gulp build';
    const v96 = pkg.scripts;
    v96.test = 'jest';
    pkg.files = [
        'dist',
        'LICENSE',
        'README.md'
    ];
    const v97 = pkg.scripts;
    v97.lint = 'gulp validate';
    const v98 = pkg.scripts;
    v98.validate = 'gulp validate';
    const v99 = pkg.scripts;
    v99.node = 'cross-env NODE_ENV=development build/devnode.js';
    const v100 = pkg.scripts;
    v100.prepack = 'npm run build';
    if (isLib) {
        const v101 = pkg.scripts;
        v101.start = 'npm run test';
        const v102 = pkg.scripts;
        v102.postpack = 'build/postpack.sh';
    } else {
        const v103 = pkg.scripts;
        v103.start = 'cross-env NODE_ENV=development build/devnode.js src/' + filename;
    }
    const v104 = pkg.scripts;
    v104.example = 'cross-env NODE_ENV=development build/devnode.js example/' + filename;
    const v105 = pkg.scripts;
    const v106 = 'npm run build && cross-env NODE_ENV=development build/devnode.js example/' + filename;
    v105.distexample = v106 + ' --use-dist';
    const v107 = pkg.scripts;
    v107.prepublishOnly = 'mkdir -p dist/ && touch dist/.npmignore';
    const v108 = JSON.stringify(pkg, null, 2);
    const v109 = fs.writeFileSync(file, v108);
    v109;
};
const getDevDeps = function () {
    const v110 = require('./package');
    const v111 = v110.devDependencies;
    return v111;
};
const checkYarn = function () {
    const v112 = cmdExists('yarn');
    const v113 = !v112;
    if (v113) {
        const v114 = console.error('Please install yarn. sudo npm install yarn -g');
        v114;
        const v115 = process.exit(1);
        v115;
    }
};
const installDevDeps = function () {
    const v116 = getDevDeps();
    const v117 = Object.entries(v116);
    const v119 = ([pkg, ver]) => {
        const v118 = `${ pkg }@${ ver }`;
        return v118;
    };
    const deps = v117.map(v119);
    const v120 = [
        'add',
        '-D',
        ...deps
    ];
    const v121 = {
        stdio: 'inherit',
        shell: false
    };
    const res = cp.spawnSync('yarn', v120, v121);
    const v122 = res.status;
    const v123 = v122 !== 0;
    if (v123) {
        const v124 = new Error('Failed to install dev dependencies with yarn');
        throw v124;
    }
};
const cpSkeleton = function () {
    const pkg = getPkg();
    const name = pkg.name;
    const skelDir = path.resolve(__dirname, 'skel');
    const files = fs.readdirSync(skelDir);
    let file;
    for (file of files) {
        const src = path.resolve(skelDir, file);
        const v125 = [
            '-R',
            src,
            '.'
        ];
        const v126 = {
            stdio: 'inherit',
            shell: false
        };
        const res = cp.spawnSync('cp', v125, v126);
        const v127 = res.status;
        const v128 = v127 !== 0;
        if (v128) {
            const v129 = new Error(`Failed copying ${ file } from skeleton`);
            throw v129;
        }
    }
    const v130 = { recursive: true };
    const v131 = fs.mkdirSync('.cache', v130);
    v131;
    const v132 = path.join('.cache', '.gitignore');
    const v133 = { flag: 'w' };
    const v134 = fs.writeFileSync(v132, '*\n', v133);
    v134;
    const filejs = name + '.js';
    const targetSrc = path.join('src', filejs);
    const v135 = fs.existsSync(targetSrc);
    const v136 = !v135;
    if (v136) {
        const v137 = path.join('src', 'skel.js');
        const v138 = fs.renameSync(v137, targetSrc);
        v138;
    }
    const targetExample = path.join('example', filejs);
    const v139 = fs.existsSync(targetExample);
    const v140 = !v139;
    if (v140) {
        const v141 = path.join('example', 'skel.js');
        const v142 = fs.renameSync(v141, targetExample);
        v142;
    }
    const v143 = path.join('src', 'index.js');
    const v144 = 'module.exports = require("./' + filejs;
    const v145 = v144 + '");\n';
    const v146 = fs.writeFileSync(v143, v145);
    v146;
};