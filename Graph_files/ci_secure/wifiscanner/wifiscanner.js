'use strict';
const childProcess = require('child_process');
module.exports = class WifiScanner {
    constructor(options, parser) {
        this.parser = parser;
        this.options = options;
    }
    scan(callback, standardErrorCallback) {
        const v20 = this.command;
        var cmd = v20.split(' ');
        const v21 = cmd[0];
        const v22 = cmd.slice(1);
        const v30 = (error, standardOut, standardError) => {
            const v23 = typeof standardErrorCallback;
            const v24 = v23 === 'function';
            const v25 = standardError && v24;
            if (v25) {
                const v26 = standardErrorCallback(standardError);
                v26;
            }
            const v27 = standardOut.toString();
            const v28 = this.parse(v27);
            const v29 = callback(error, v28);
            v29;
        };
        const v31 = childProcess.execFile(v21, v22, v30);
        v31;
    }
    get command() {
        const v32 = this.options;
        const v33 = v32.binaryPath;
        const v34 = v33 + ' ';
        const v35 = this.options;
        const v36 = v35.args;
        const v37 = v34 + v36;
        return v37;
    }
    parse(data) {
        const v38 = this.parser(data);
        return v38;
    }
};