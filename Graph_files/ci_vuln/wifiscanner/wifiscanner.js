'use strict';
const childProcess = require('child_process');
module.exports = class WifiScanner {
    constructor(options, parser) {
        this.parser = parser;
        this.options = options;
    }
    scan(callback, standardErrorCallback) {
        const v18 = this.command;
        const v26 = (error, standardOut, standardError) => {
            const v19 = typeof standardErrorCallback;
            const v20 = v19 === 'function';
            const v21 = standardError && v20;
            if (v21) {
                const v22 = standardErrorCallback(standardError);
                v22;
            }
            const v23 = standardOut.toString();
            const v24 = this.parse(v23);
            const v25 = callback(error, v24);
            v25;
        };
        const v27 = childProcess.exec(v18, v26);
        v27;
    }
    get command() {
        const v28 = this.options;
        const v29 = v28.binaryPath;
        const v30 = v29 + ' ';
        const v31 = this.options;
        const v32 = v31.args;
        const v33 = v30 + v32;
        return v33;
    }
    parse(data) {
        const v34 = this.parser(data);
        return v34;
    }
};