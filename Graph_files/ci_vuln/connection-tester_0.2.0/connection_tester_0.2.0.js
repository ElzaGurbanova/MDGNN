'use strict';
const net = require('net');
const util = require('util');
const path = require('path');
const shell = require('child_process');
let SOCKET_TIMEOUT = 1000;
const testSync = function (host, port, connectTimeout) {
    const nodeBinary = process.execPath;
    const scriptPath = path.join(__dirname, './scripts/connection-tester');
    const cmd = util.format('"%s" "%s" %s %s %s', nodeBinary, scriptPath, host, port, connectTimeout);
    const v37 = shell.execSync(cmd);
    const shellOut = v37.toString();
    const output = {};
    output.success = false;
    output.error = null;
    if (shellOut) {
        const v38 = shellOut.match(/true/);
        if (v38) {
            output.success = true;
        } else {
            output.error = shellOut;
        }
    } else {
        output.error = 'No output from connection test';
    }
    return output;
};
const testAsync = function (host, port, connectTimeout, callback) {
    const socket = new net.Socket();
    const output = {};
    output.success = false;
    output.error = null;
    const v39 = socket.connect(port, host);
    v39;
    const v40 = socket.setTimeout(connectTimeout);
    v40;
    const v43 = function () {
        const v41 = socket.destroy();
        v41;
        output.success = true;
        const v42 = callback(null, output);
        return v42;
    };
    const v44 = socket.on('connect', v43);
    v44;
    const v49 = function (err) {
        const v45 = socket.destroy();
        v45;
        const v46 = err.message;
        const v47 = err && v46;
        output.error = v47 || err;
        const v48 = callback(err, output);
        return v48;
    };
    const v50 = socket.on('error', v49);
    v50;
    const v56 = function (err) {
        const v51 = socket.destroy();
        v51;
        const v52 = err.message;
        const v53 = err && v52;
        const v54 = v53 || err;
        output.error = v54 || 'socket TIMEOUT';
        const v55 = callback(err, output);
        return v55;
    };
    const v57 = socket.on('timeout', v56);
    v57;
};
const v60 = function (socketTimeout) {
    const v58 = !socketTimeout;
    const v59 = !v58;
    if (v59) {
        SOCKET_TIMEOUT = socketTimeout;
    }
    return SOCKET_TIMEOUT;
};
const v71 = function ConnectionTester(host, port, callbackOrConnectTimeout, callback) {
    const v61 = typeof callbackOrConnectTimeout;
    const v62 = v61 === 'function';
    if (v62) {
        const v63 = console.log('deprecated: Please migrate to the new interface ConnectionTester(host, port, timeout, callback)');
        v63;
        const v64 = testAsync(host, port, SOCKET_TIMEOUT, callbackOrConnectTimeout);
        return v64;
    }
    const v65 = typeof callbackOrConnectTimeout;
    const v66 = v65 === 'number';
    if (v66) {
        if (callback) {
            const v67 = testAsync(host, port, callbackOrConnectTimeout, callback);
            return v67;
        } else {
            const v68 = testSync(host, port, callbackOrConnectTimeout);
            return v68;
        }
    }
    const v69 = callbackOrConnectTimeout === undefined;
    if (v69) {
        const v70 = testSync(host, port, SOCKET_TIMEOUT);
        return v70;
    }
};
const v72 = {};
v72.timeout = v60;
v72.test = v71;
module.exports = v72;