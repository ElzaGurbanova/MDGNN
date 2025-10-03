const v21 = require('child_process');
var exec = v21.exec;
var path = require('path');
module.exports = open;
const open = function (target, appName, callback) {
    var opener;
    const v22 = typeof appName;
    const v23 = v22 === 'function';
    if (v23) {
        callback = appName;
        appName = null;
    }
    const v24 = process.platform;
    switch (v24) {
    case 'darwin':
        if (appName) {
            const v25 = escape(appName);
            const v26 = 'open -a "' + v25;
            opener = v26 + '"';
        } else {
            opener = 'open';
        }
        break;
    case 'win32':
        if (appName) {
            const v27 = escape(appName);
            const v28 = 'start "" "' + v27;
            opener = v28 + '"';
        } else {
            opener = 'start ""';
        }
        break;
    default:
        if (appName) {
            opener = escape(appName);
        } else {
            opener = path.join(__dirname, '../vendor/xdg-open');
        }
        break;
    }
    const v29 = process.env;
    const v30 = v29.SUDO_USER;
    if (v30) {
        const v31 = process.env;
        const v32 = v31.SUDO_USER;
        const v33 = 'sudo -u ' + v32;
        const v34 = v33 + ' ';
        opener = v34 + opener;
    }
    const v35 = opener + ' "';
    const v36 = escape(target);
    const v37 = v35 + v36;
    const v38 = v37 + '"';
    const v39 = exec(v38, callback);
    return v39;
};
const escape = function (s) {
    const v40 = s.replace(/"/g, '\\"');
    return v40;
};