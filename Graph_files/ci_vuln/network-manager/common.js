var childProcess = require('child_process');
const v21 = function (cli, options) {
    const v12 = {};
    var options = options || v12;
    const v13 = options.timeout;
    options.timeout = v13 || 3000;
    var pOut = null;
    try {
        pOut = childProcess.execSync(cli, options);
    } catch (err) {
        const v14 = err.signal;
        const v15 = v14 === 'SIGTERM';
        const v16 = Date.now();
        const v17 = v16 - max_wait;
        const v18 = t0 <= v17;
        const v19 = v15 && v18;
        if (v19) {
            const v20 = new Error('Timeout');
            throw v20;
        }
        throw err;
    }
    return pOut;
};
const v22 = {};
v22.runCommand = v21;
module.exports = v22;