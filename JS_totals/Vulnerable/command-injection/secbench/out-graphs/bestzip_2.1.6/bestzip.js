'use strict';
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const async = require('async');
const glob = require('glob');
const which = require('which');
const hasNativeZip = function () {
    const v90 = { nothrow: true };
    const v91 = which.sync('zip', v90);
    const v92 = Boolean(v91);
    return v92;
};
const expandSources = function (cwd, source, done) {
    const globOpts = {};
    globOpts.cwd = cwd;
    globOpts.dot = false;
    globOpts.noglobstar = true;
    globOpts.noext = true;
    globOpts.nobrace = true;
    const v93 = Array.isArray(source);
    if (v93) {
        const v95 = (_source, next) => {
            const v94 = expandSources(cwd, _source, next);
            return v94;
        };
        const v96 = async.concat(source, v95, done);
        return v96;
    }
    const v97 = typeof source;
    const v98 = v97 !== 'string';
    if (v98) {
        const v99 = typeof source;
        const v100 = new Error(`source is (${ v99 }) `);
        throw v100;
    }
    const v101 = glob.hasMagic(source, globOpts);
    if (v101) {
        const v102 = glob(source, globOpts, done);
        v102;
    } else {
        const v105 = () => {
            const v103 = [source];
            const v104 = done(null, v103);
            v104;
        };
        const v106 = process.nextTick(v105);
        v106;
    }
};
const walkDir = function (fullPath) {
    const v107 = fs.readdirSync(fullPath);
    const v110 = f => {
        const filePath = path.join(fullPath, f);
        const stats = fs.statSync(filePath);
        const v108 = stats.isDirectory();
        if (v108) {
            const v109 = walkDir(filePath);
            return v109;
        }
        return filePath;
    };
    const files = v107.map(v110);
    const v112 = (acc, cur) => {
        const v111 = acc.concat(cur);
        return v111;
    };
    const v113 = [];
    const v114 = files.reduce(v112, v113);
    return v114;
};
const nativeZip = options => {
    const v133 = (resolve, reject) => {
        let sources;
        const v115 = options.source;
        const v116 = Array.isArray(v115);
        const v117 = options.source;
        const v118 = v117.join(' ');
        const v119 = options.source;
        if (v116) {
            sources = v118;
        } else {
            sources = v119;
        }
        const v120 = options.destination;
        const command = `zip --quiet --recurse-paths ${ v120 } ${ sources }`;
        const v121 = options.cwd;
        const v122 = {
            stdio: 'inherit',
            cwd: v121
        };
        const zipProcess = cp.exec(command, v122);
        const v123 = zipProcess.on('error', reject);
        v123;
        const v131 = exitCode => {
            const v124 = exitCode === 0;
            if (v124) {
                const v125 = resolve();
                v125;
            } else {
                const v126 = options.cwd;
                const v127 = process.cwd();
                const v128 = v126 || v127;
                const v129 = new Error(`Unexpected exit code from native zip command: ${ exitCode }\n executed command '${ command }'\n executed inin directory '${ v128 }'`);
                const v130 = reject(v129);
                v130;
            }
        };
        const v132 = zipProcess.on('close', v131);
        v132;
    };
    const v134 = new Promise(v133);
    return v134;
};
const nodeZip = options => {
    const v164 = (resolve, reject) => {
        const v135 = options.cwd;
        const v136 = process.cwd();
        const cwd = v135 || v136;
        const v137 = options.destination;
        const v138 = path.resolve(cwd, v137);
        const output = fs.createWriteStream(v138);
        const archive = archiver('zip');
        const v139 = output.on('close', resolve);
        v139;
        const v140 = archive.on('error', reject);
        v140;
        const v141 = archive.pipe(output);
        v141;
        const addSource = function (source, next) {
            const fullPath = path.resolve(cwd, source);
            const destPath = source;
            const v154 = function (err, stats) {
                if (err) {
                    const v142 = next(err);
                    return v142;
                }
                const v143 = stats.isDirectory();
                if (v143) {
                    const files = walkDir(fullPath);
                    const v148 = f => {
                        const v144 = fullPath.length;
                        const subPath = f.substring(v144);
                        const v145 = destPath + subPath;
                        const v146 = { name: v145 };
                        const v147 = archive.file(f, v146);
                        v147;
                    };
                    const v149 = files.forEach(v148);
                    v149;
                } else {
                    const v150 = stats.isFile();
                    if (v150) {
                        const v151 = {
                            stats: stats,
                            name: destPath
                        };
                        const v152 = archive.file(fullPath, v151);
                        v152;
                    }
                }
                const v153 = next();
                v153;
            };
            const v155 = fs.stat(fullPath, v154);
            v155;
        };
        const v156 = options.source;
        const v162 = (err, expandedSources) => {
            if (err) {
                const v157 = reject(err);
                return v157;
            }
            const v160 = err => {
                if (err) {
                    const v158 = reject(err);
                    return v158;
                }
                const v159 = archive.finalize();
                v159;
            };
            const v161 = async.forEach(expandedSources, addSource, v160);
            v161;
        };
        const v163 = expandSources(cwd, v156, v162);
        v163;
    };
    const v165 = new Promise(v164);
    return v165;
};
const zip = function (options) {
    const v166 = typeof options;
    const compatMode = v166 === 'string';
    if (compatMode) {
        const v167 = arguments[1];
        const v168 = arguments[0];
        options.source = v167;
        options.destination = v168;
        options = {};
        options = {};
    }
    let promise;
    const v169 = hasNativeZip();
    if (v169) {
        promise = nativeZip(options);
    } else {
        promise = nodeZip(options);
    }
    if (compatMode) {
        const v170 = arguments[2];
        const v171 = promise.then(v170);
        const v172 = arguments[2];
        const v173 = v171.catch(v172);
        v173;
    } else {
        return promise;
    }
};
module.exports = zip;
const v174 = module.exports;
v174.zip = zip;
const v175 = module.exports;
v175.nodeZip = nodeZip;
const v176 = module.exports;
v176.nativeZip = nativeZip;
const v177 = module.exports;
v177.bestzip = zip;
const v178 = module.exports;
v178.hasNativeZip = hasNativeZip;