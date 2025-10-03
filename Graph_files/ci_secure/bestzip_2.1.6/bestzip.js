'use strict';
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const async = require('async');
const glob = require('glob');
const which = require('which');
const hasNativeZip = function () {
    const v88 = { nothrow: true };
    const v89 = which.sync('zip', v88);
    const v90 = Boolean(v89);
    return v90;
};
const expandSources = function (cwd, source, done) {
    const globOpts = {};
    globOpts.cwd = cwd;
    globOpts.dot = false;
    globOpts.noglobstar = true;
    globOpts.noext = true;
    globOpts.nobrace = true;
    const v91 = Array.isArray(source);
    if (v91) {
        const v93 = (_source, next) => {
            const v92 = expandSources(cwd, _source, next);
            return v92;
        };
        const v94 = async.concat(source, v93, done);
        return v94;
    }
    const v95 = typeof source;
    const v96 = v95 !== 'string';
    if (v96) {
        const v97 = typeof source;
        const v98 = new Error(`source is (${ v97 }) `);
        throw v98;
    }
    const v99 = glob.hasMagic(source, globOpts);
    if (v99) {
        const v100 = glob(source, globOpts, done);
        v100;
    } else {
        const v103 = () => {
            const v101 = [source];
            const v102 = done(null, v101);
            v102;
        };
        const v104 = process.nextTick(v103);
        v104;
    }
};
const walkDir = function (fullPath) {
    const v105 = fs.readdirSync(fullPath);
    const v108 = f => {
        const filePath = path.join(fullPath, f);
        const stats = fs.statSync(filePath);
        const v106 = stats.isDirectory();
        if (v106) {
            const v107 = walkDir(filePath);
            return v107;
        }
        return filePath;
    };
    const files = v105.map(v108);
    const v110 = (acc, cur) => {
        const v109 = acc.concat(cur);
        return v109;
    };
    const v111 = [];
    const v112 = files.reduce(v110, v111);
    return v112;
};
const nativeZip = options => {
    const v129 = (resolve, reject) => {
        const v113 = options.cwd;
        const v114 = process.cwd();
        const cwd = v113 || v114;
        const command = 'zip';
        const v115 = options.source;
        const v127 = (err, sources) => {
            const v116 = options.destination;
            const v117 = [
                '--quiet',
                '--recurse-paths',
                v116
            ];
            const args = v117.concat(sources);
            const v118 = {
                stdio: 'inherit',
                cwd
            };
            const zipProcess = cp.spawn(command, args, v118);
            const v119 = zipProcess.on('error', reject);
            v119;
            const v125 = exitCode => {
                const v120 = exitCode === 0;
                if (v120) {
                    const v121 = resolve();
                    v121;
                } else {
                    const v122 = args.join(' ');
                    const v123 = new Error(`Unexpected exit code from native zip: ${ exitCode }\n executed command '${ command } ${ v122 }'\n executed in directory '${ cwd }'`);
                    const v124 = reject(v123);
                    v124;
                }
            };
            const v126 = zipProcess.on('close', v125);
            v126;
        };
        const v128 = expandSources(cwd, v115, v127);
        v128;
    };
    const v130 = new Promise(v129);
    return v130;
};
const nodeZip = options => {
    const v160 = (resolve, reject) => {
        const v131 = options.cwd;
        const v132 = process.cwd();
        const cwd = v131 || v132;
        const v133 = options.destination;
        const v134 = path.resolve(cwd, v133);
        const output = fs.createWriteStream(v134);
        const archive = archiver('zip');
        const v135 = output.on('close', resolve);
        v135;
        const v136 = archive.on('error', reject);
        v136;
        const v137 = archive.pipe(output);
        v137;
        const addSource = function (source, next) {
            const fullPath = path.resolve(cwd, source);
            const destPath = source;
            const v150 = function (err, stats) {
                if (err) {
                    const v138 = next(err);
                    return v138;
                }
                const v139 = stats.isDirectory();
                if (v139) {
                    const files = walkDir(fullPath);
                    const v144 = f => {
                        const v140 = fullPath.length;
                        const subPath = f.substring(v140);
                        const v141 = destPath + subPath;
                        const v142 = { name: v141 };
                        const v143 = archive.file(f, v142);
                        v143;
                    };
                    const v145 = files.forEach(v144);
                    v145;
                } else {
                    const v146 = stats.isFile();
                    if (v146) {
                        const v147 = {
                            stats: stats,
                            name: destPath
                        };
                        const v148 = archive.file(fullPath, v147);
                        v148;
                    }
                }
                const v149 = next();
                v149;
            };
            const v151 = fs.stat(fullPath, v150);
            v151;
        };
        const v152 = options.source;
        const v158 = (err, expandedSources) => {
            if (err) {
                const v153 = reject(err);
                return v153;
            }
            const v156 = err => {
                if (err) {
                    const v154 = reject(err);
                    return v154;
                }
                const v155 = archive.finalize();
                v155;
            };
            const v157 = async.forEach(expandedSources, addSource, v156);
            v157;
        };
        const v159 = expandSources(cwd, v152, v158);
        v159;
    };
    const v161 = new Promise(v160);
    return v161;
};
const zip = function (options) {
    const v162 = typeof options;
    const compatMode = v162 === 'string';
    if (compatMode) {
        const v163 = arguments[1];
        const v164 = arguments[0];
        options.source = v163;
        options.destination = v164;
        options = {};
        options = {};
    }
    let promise;
    const v165 = hasNativeZip();
    if (v165) {
        promise = nativeZip(options);
    } else {
        promise = nodeZip(options);
    }
    if (compatMode) {
        const v166 = arguments[2];
        const v167 = promise.then(v166);
        const v168 = arguments[2];
        const v169 = v167.catch(v168);
        v169;
    } else {
        return promise;
    }
};
module.exports = zip;
const v170 = module.exports;
v170.zip = zip;
const v171 = module.exports;
v171.nodeZip = nodeZip;
const v172 = module.exports;
v172.nativeZip = nativeZip;
const v173 = module.exports;
v173.bestzip = zip;
const v174 = module.exports;
v174.hasNativeZip = hasNativeZip;