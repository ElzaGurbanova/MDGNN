const v13 = require('child_process');
var exec = v13.exec;
const v24 = function (iface, callback) {
    const v14 = 'ifconfig ' + iface;
    const v22 = function (err, out) {
        if (err) {
            const v15 = callback(err, null);
            v15;
            return;
        }
        const v16 = out.toLowerCase();
        var match = /[a-f0-9]{2}(:[a-f0-9]{2}){5}/.exec(v16);
        const v17 = !match;
        if (v17) {
            const v18 = callback('did not find a mac address', null);
            v18;
            return;
        }
        const v19 = match[0];
        const v20 = v19.toLowerCase();
        const v21 = callback(null, v20);
        v21;
    };
    const v23 = exec(v14, v22);
    v23;
};
module.exports = v24;