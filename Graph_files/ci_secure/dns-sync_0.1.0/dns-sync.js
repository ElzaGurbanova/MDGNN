'use strict';
var net = require('net');
var util = require('util');
var path = require('path');
var shell = require('shelljs');
const v16 = require('debug');
var debug = v16('dns-sync');
var ValidHostnameRegex = new RegExp('^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$');
const isValidHostName = function (hostname) {
    const v17 = ValidHostnameRegex.test(hostname);
    return v17;
};
const v29 = function resolve(hostname) {
    var output;
    var nodeBinary = process.execPath;
    const v18 = isValidHostName(hostname);
    const v19 = !v18;
    if (v19) {
        const v20 = console.error('Invalid hostname:', hostname);
        v20;
        return null;
    }
    var scriptPath = path.join(__dirname, '../scripts/dns-lookup-script');
    var response;
    var cmd = util.format('"%s" "%s" %s', nodeBinary, scriptPath, hostname);
    const v21 = { silent: true };
    response = shell.exec(cmd, v21);
    const v22 = response.code;
    const v23 = v22 === 0;
    const v24 = response && v23;
    if (v24) {
        output = response.output;
        const v25 = net.isIP(output);
        const v26 = output && v25;
        if (v26) {
            return output;
        }
    }
    const v27 = 'fail to resolve hostname ' + hostname;
    const v28 = debug('hostname', v27);
    v28;
    return null;
};
const v30 = {};
v30.resolve = v29;
module.exports = v30;