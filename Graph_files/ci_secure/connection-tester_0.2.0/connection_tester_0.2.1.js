'use strict';
const net = require('net');
const util = require('util');
const path = require('path');
const shell = require('child_process');
let SOCKET_TIMEOUT = 1000;
var ValidHostnameRegex = new RegExp('^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$');
const isValidHostNameOrIP = function (host) {
    const v52 = net.isIP(host);
    const v53 = ValidHostnameRegex.test(host);
    const v54 = v52 || v53;
    return v54;
};
const testSync = function (host, port, connectTimeout) {
    const nodeBinary = process.execPath;
    const scriptPath = path.join(__dirname, './scripts/connection-tester');
    const cmd = util.format('"%s" "%s" %s %s %s', nodeBinary, scriptPath, host, port, connectTimeout);
    const v55 = shell.execSync(cmd);
    const shellOut = v55.toString();
    const output = {};
    output.success = false;
    output.error = null;
    if (shellOut) {
        const v56 = shellOut.match(/true/);
        if (v56) {
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
    const v57 = socket.connect(port, host);
    v57;
    const v58 = socket.setTimeout(connectTimeout);
    v58;
    const v61 = function () {
        const v59 = socket.destroy();
        v59;
        output.success = true;
        const v60 = callback(null, output);
        return v60;
    };
    const v62 = socket.on('connect', v61);
    v62;
    const v67 = function (err) {
        const v63 = socket.destroy();
        v63;
        const v64 = err.message;
        const v65 = err && v64;
        output.error = v65 || err;
        const v66 = callback(err, output);
        return v66;
    };
    const v68 = socket.on('error', v67);
    v68;
    const v74 = function (err) {
        const v69 = socket.destroy();
        v69;
        const v70 = err.message;
        const v71 = err && v70;
        const v72 = v71 || err;
        output.error = v72 || 'socket TIMEOUT';
        const v73 = callback(err, output);
        return v73;
    };
    const v75 = socket.on('timeout', v74);
    v75;
};
const v78 = function (socketTimeout) {
    const v76 = !socketTimeout;
    const v77 = !v76;
    if (v77) {
        SOCKET_TIMEOUT = socketTimeout;
    }
    return SOCKET_TIMEOUT;
};
const v101 = function ConnectionTester(host, port, connectTimeout, callback) {
    const v79 = isValidHostNameOrIP(host);
    const v80 = !v79;
    if (v80) {
        const v81 = console.error('[connection-tester] invalid host: ', host);
        v81;
        host = undefined;
    }
    var originalPort = port;
    const v82 = +port;
    port = v82;
    const v83 = !port;
    const v84 = port < 0;
    const v85 = v83 || v84;
    const v86 = port > 65535;
    const v87 = v85 || v86;
    if (v87) {
        const v88 = console.error('[connection-tester] invalid port: ', originalPort);
        v88;
        port = undefined;
    }
    const v89 = typeof connectTimeout;
    const v90 = v89 === 'function';
    if (v90) {
        const v91 = console.error('deprecated: Please migrate to the new interface ConnectionTester(host, port, timeout, callback)');
        v91;
        callback = connectTimeout;
        connectTimeout = SOCKET_TIMEOUT;
    }
    const v92 = connectTimeout === undefined;
    if (v92) {
        connectTimeout = SOCKET_TIMEOUT;
    }
    const v93 = typeof connectTimeout;
    const v94 = v93 === 'number';
    if (v94) {
        const v95 = !port;
        const v96 = !host;
        const v97 = v95 || v96;
        if (v97) {
            var output = {};
            output.success = false;
            output.error = 'invalid host/port';
            if (callback) {
                const v98 = callback(null, output);
                return v98;
            } else {
                return output;
            }
        }
        if (callback) {
            const v99 = testAsync(host, port, connectTimeout, callback);
            return v99;
        } else {
            const v100 = testSync(host, port, connectTimeout);
            return v100;
        }
    }
};
const v102 = {};
v102.timeout = v78;
v102.test = v101;
module.exports = v102;