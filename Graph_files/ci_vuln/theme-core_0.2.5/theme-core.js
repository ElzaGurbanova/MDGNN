'use strict';
const v60 = require('child_process');
const exec = v60.exec;
const merge = require('lodash.merge');
const notifier = require('node-notifier');
const yaml = require('js-yaml');
const fs = require('fs');
const sh = function (cmd, exitOnError, cb) {
    const v61 = 1000 * 60;
    const v62 = v61 * 2;
    const v63 = {
        encoding: 'utf8',
        timeout: v62
    };
    const child = exec(cmd, v63);
    let stdout = '';
    const v64 = child.stdout;
    const v67 = data => {
        stdout += data;
        const v65 = process.stdout;
        const v66 = v65.write(data);
        v66;
    };
    const v68 = v64.on('data', v67);
    v68;
    const v69 = child.stderr;
    const v72 = data => {
        const v70 = process.stdout;
        const v71 = v70.write(data);
        v71;
    };
    const v73 = v69.on('data', v72);
    v73;
    const v88 = code => {
        const v74 = code > 0;
        if (v74) {
            if (exitOnError) {
                const v75 = typeof cb;
                const v76 = v75 === 'function';
                if (v76) {
                    const v77 = new Error(`Error with code ${ code } after running: ${ cmd }`);
                    const v78 = cb(v77);
                    v78;
                } else {
                    const v79 = process.stdout;
                    const v80 = `Error with code ${ code } after running: ${ cmd } \n`;
                    const v81 = v79.write(v80);
                    v81;
                    const v82 = process.exit(code);
                    v82;
                }
            } else {
                const v83 = {
                    title: cmd,
                    message: stdout,
                    sound: true
                };
                const v84 = notifier.notify(v83);
                v84;
            }
        }
        const v85 = typeof cb;
        const v86 = v85 === 'function';
        if (v86) {
            const v87 = cb();
            v87;
        }
    };
    const v89 = child.on('close', v88);
    v89;
};
const flattenArray = function (arrayOfArrays) {
    const v90 = [];
    const v91 = v90.concat;
    const v92 = [];
    const v93 = v91.apply(v92, arrayOfArrays);
    return v93;
};
const uniqueArray = function (item) {
    const u = {};
    const newArray = [];
    let i = 0;
    let l = item.length;
    let v94 = i < l;
    while (v94) {
        const v96 = {};
        const v97 = v96.hasOwnProperty;
        const v98 = item[i];
        const v99 = v97.call(u, v98);
        const v100 = !v99;
        if (v100) {
            const v101 = item[i];
            const v102 = newArray.push(v101);
            v102;
            const v103 = item[i];
            u[v103] = 1;
        }
        const v95 = ++i;
        v94 = i < l;
    }
    return newArray;
};
const error = function (message) {
    const err = new Error(message);
    err.showStack = false;
    return err;
};
const toYaml = function (object) {
    const v104 = yaml.safeDump(object);
    return v104;
};
const fromYaml = function (string) {
    const v105 = yaml.safeLoad(string);
    return v105;
};
const readYamlFile = function (file, cb) {
    const v108 = (err, data) => {
        if (err) {
            throw err;
        }
        const v106 = yaml.safeLoad(data);
        const v107 = cb(v106);
        v107;
    };
    const v109 = fs.readFile(file, 'utf8', v108);
    v109;
};
const readYamlFileSync = function (file) {
    const v110 = fs.readFileSync(file, 'utf8');
    const v111 = yaml.safeLoad(v110);
    return v111;
};
const writeYamlFile = function (file, data, cb) {
    const v112 = yaml.safeDump(data);
    const v114 = () => {
        if (cb) {
            const v113 = cb();
            v113;
        }
    };
    const v115 = fs.writeFile(file, v112, v114);
    v115;
};
const writeYamlFileSync = function (file, data) {
    const v116 = yaml.safeDump(data);
    const v117 = fs.writeFileSync(file, v116);
    v117;
};
const v118 = {};
v118.sh = sh;
v118.flattenArray = flattenArray;
v118.uniqueArray = uniqueArray;
v118.error = error;
v118.merge = merge;
v118.fromYaml = fromYaml;
v118.toYaml = toYaml;
v118.readYamlFile = readYamlFile;
v118.readYamlFileSync = readYamlFileSync;
v118.writeYamlFile = writeYamlFile;
v118.writeYamlFileSync = writeYamlFileSync;
module.exports = v118;