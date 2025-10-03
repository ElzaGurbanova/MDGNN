'use strict';
const path = require('path');
const v74 = require('child_process');
const spawnSync = v74.spawnSync;
const fs = require('fs');
const v145 = function (opts) {
    const defaults = {};
    defaults.sqlclPath = 'sql';
    defaults.destination = 'application';
    opts = Object.assign(defaults, opts);
    const v75 = opts.connectString;
    const v76 = typeof v75;
    const v77 = v76 === 'undefined';
    if (v77) {
        const v78 = new TypeError('connectString is required.');
        throw v78;
    }
    const v79 = opts.directory;
    const v80 = typeof v79;
    const v81 = v80 === 'undefined';
    if (v81) {
        const v82 = new TypeError('directory is a required argument.');
        throw v82;
    }
    const v83 = opts.appID;
    const v84 = typeof v83;
    const v85 = v84 === 'undefined';
    if (v85) {
        const v86 = new TypeError('appID is a required argument.');
        throw v86;
    }
    const v87 = opts.destination;
    const v88 = v87.toLowerCase();
    const v89 = v88 === 'plugin';
    const v90 = opts.pluginName;
    const v91 = typeof v90;
    const v92 = v91 === 'undefined';
    const v93 = v89 && v92;
    if (v93) {
        const v94 = new Error('pluginName is a required argument.');
        throw v94;
    }
    const v95 = opts.directory;
    const v96 = fs.existsSync(v95);
    const v97 = !v96;
    if (v97) {
        const v98 = opts.directory;
        const v99 = new Error(`Directory ${ v98 } is not a valid path.`);
        throw v99;
    }
    const getAllFiles = dir => {
        const v100 = fs.readdirSync(dir);
        const v106 = (files, file) => {
            const name = path.join(dir, file);
            const v101 = fs.statSync(name);
            const isDirectory = v101.isDirectory();
            const v102 = getAllFiles(name);
            const v103 = [
                ...files,
                ...v102
            ];
            const v104 = [
                ...files,
                name
            ];
            let v105;
            if (isDirectory) {
                v105 = v103;
            } else {
                v105 = v104;
            }
            return v105;
        };
        const v107 = [];
        const v108 = v100.reduce(v106, v107);
        return v108;
    };
    const v109 = opts.directory;
    const v110 = getAllFiles(v109);
    const v111 = v110.length;
    const v112 = v111 === 0;
    if (v112) {
        const v113 = `Directory is empty.`;
        const v114 = console.log(v113);
        v114;
    } else {
        try {
            const v115 = opts.destination;
            const v116 = v115.toLowerCase();
            switch (v116) {
            case 'theme':
                const v117 = opts.appID;
                const v118 = `Uploading to ${ v117 } - Theme Files...`;
                const v119 = console.log(v118);
                v119;
                break;
            case 'workspace':
                const v120 = opts.appID;
                const v121 = `Uploading to ${ v120 } - Workspace Files...`;
                const v122 = console.log(v121);
                v122;
                break;
            case 'plugin':
                const v123 = opts.appID;
                const v124 = opts.pluginName;
                const v125 = `Uploading to ${ v123 } - ${ v124 } - Plugin Files...`;
                const v126 = console.log(v125);
                v126;
                break;
            default:
                const v127 = opts.appID;
                const v128 = `Uploading to ${ v127 } - Application Static Files...`;
                const v129 = console.log(v128);
                v129;
            }
            const v130 = opts.connectString;
            const v131 = path.resolve(__dirname, 'lib/script');
            const v132 = '@' + v131;
            const v133 = path.resolve(__dirname, 'lib/distUpload.js');
            const v134 = opts.directory;
            const v135 = path.resolve(v134);
            const v136 = opts.appID;
            const v137 = opts.destination;
            const v138 = opts.pluginName;
            const spawnOpts = [
                v130,
                v132,
                v133,
                v135,
                v136,
                v137,
                v138
            ];
            const v139 = opts.sqlclPath;
            const v140 = { encoding: 'utf8' };
            const childProcess = spawnSync(v139, spawnOpts, v140);
            const v141 = childProcess.stdout;
            const v142 = console.log(v141);
            v142;
            const v143 = console.log('Files were uploaded successfully.');
            v143;
        } catch (err) {
            const v144 = console.error(err);
            v144;
        }
    }
};
const v146 = {};
v146.publish = v145;
module.exports = v146;