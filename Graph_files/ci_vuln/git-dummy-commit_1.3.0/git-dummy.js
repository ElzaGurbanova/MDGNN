'use strict';
var shell = require('shelljs');
var defaultMsg = 'Test commit';
const makeDefault = function (str) {
    const v21 = typeof str;
    const v22 = v21 === 'string';
    const v23 = str.trim();
    const v24 = !v23;
    const v25 = v22 && v24;
    const v26 = str === undefined;
    const v27 = v25 || v26;
    if (v27) {
        return defaultMsg;
    }
    return str;
};
const v40 = function (msg, silent) {
    var arg = '';
    msg = makeDefault(msg);
    const v28 = silent === undefined;
    if (v28) {
        silent = true;
    }
    const v29 = Array.isArray(msg);
    if (v29) {
        const v30 = msg.length;
        if (v30) {
            const v32 = function (m) {
                m = makeDefault(m);
                const v31 = '-m"' + m;
                arg += v31 + '" ';
            };
            const v33 = msg.forEach(v32);
            v33;
        } else {
            const v34 = '-m"' + defaultMsg;
            arg = v34 + '"';
        }
    } else {
        const v35 = '-m"' + msg;
        arg = v35 + '"';
    }
    const v36 = 'git commit ' + arg;
    const v37 = v36 + ' --allow-empty --no-gpg-sign';
    const v38 = { silent: silent };
    const v39 = shell.exec(v37, v38);
    v39;
};
module.exports = v40;