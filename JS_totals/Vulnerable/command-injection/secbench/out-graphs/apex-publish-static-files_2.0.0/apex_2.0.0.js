'use strict';
const path = require('path');
const v78 = require('child_process');
const execSync = v78.execSync;
const fs = require('fs');
const v153 = function (opts) {
    const defaults = {};
    defaults.sqlclPath = 'sql';
    defaults.destination = 'application';
    opts = Object.assign(defaults, opts);
    const v79 = opts.connectString;
    const v80 = typeof v79;
    const v81 = v80 === 'undefined';
    if (v81) {
        const v82 = new TypeError('connectString is required.');
        throw v82;
    }
    const v83 = opts.directory;
    const v84 = typeof v83;
    const v85 = v84 === 'undefined';
    if (v85) {
        const v86 = new TypeError('directory is a required argument.');
        throw v86;
    }
    const v87 = opts.appID;
    const v88 = typeof v87;
    const v89 = v88 === 'undefined';
    if (v89) {
        const v90 = new TypeError('appID is a required argument.');
        throw v90;
    }
    const v91 = opts.destination;
    const v92 = v91.toLowerCase();
    const v93 = v92 === 'plugin';
    const v94 = opts.pluginName;
    const v95 = typeof v94;
    const v96 = v95 === 'undefined';
    const v97 = v93 && v96;
    if (v97) {
        const v98 = new Error('pluginName is a required argument.');
        throw v98;
    }
    const v99 = opts.directory;
    const v100 = fs.existsSync(v99);
    const v101 = !v100;
    if (v101) {
        const v102 = opts.directory;
        const v103 = new Error(`Directory ${ v102 } is not a valid path.`);
        throw v103;
    }
    try {
        const v104 = opts.destination;
        const v105 = v104.toLowerCase();
        switch (v105) {
        case 'theme':
            const v106 = opts.appID;
            const v107 = `Uploading to ${ v106 } - Theme Files...`;
            const v108 = console.log(v107);
            v108;
            break;
        case 'workspace':
            const v109 = opts.appID;
            const v110 = `Uploading to ${ v109 } - Workspace Files...`;
            const v111 = console.log(v110);
            v111;
            break;
        case 'plugin':
            const v112 = opts.appID;
            const v113 = opts.pluginName;
            const v114 = `Uploading to ${ v112 } - ${ v113 } - Plugin Files...`;
            const v115 = console.log(v114);
            v115;
            break;
        default:
            const v116 = opts.appID;
            const v117 = `Uploading to ${ v116 } - Application Static Files...`;
            const v118 = console.log(v117);
            v118;
        }
        const v119 = opts.sqlclPath;
        const v120 = '"' + v119;
        const v121 = v120 + '"';
        const v122 = v121 + ' ';
        const v123 = opts.connectString;
        const v124 = v122 + v123;
        const v125 = v124 + ' @"';
        const v126 = path.resolve(__dirname, 'lib/script');
        const v127 = v125 + v126;
        const v128 = v127 + '"';
        const v129 = v128 + ' "';
        const v130 = path.resolve(__dirname, 'lib/distUpload.js');
        const v131 = v129 + v130;
        const v132 = v131 + '"';
        const v133 = v132 + ' "';
        const v134 = opts.directory;
        const v135 = path.resolve(v134);
        const v136 = v133 + v135;
        const v137 = v136 + '"';
        const v138 = v137 + ' ';
        const v139 = opts.appID;
        const v140 = v138 + v139;
        const v141 = v140 + ' "';
        const v142 = opts.destination;
        const v143 = v141 + v142;
        const v144 = v143 + '"';
        const v145 = v144 + ' "';
        const v146 = opts.pluginName;
        const v147 = v145 + v146;
        const v148 = v147 + '"';
        const v149 = { encoding: 'utf8' };
        const childProcess = execSync(v148, v149);
        const v150 = console.log(childProcess);
        v150;
        const v151 = console.log('Files were uploaded successfully.');
        v151;
        return true;
    } catch (err) {
        const v152 = console.error(err);
        v152;
        return false;
    }
};
const v154 = {};
v154.publish = v153;
module.exports = v154;