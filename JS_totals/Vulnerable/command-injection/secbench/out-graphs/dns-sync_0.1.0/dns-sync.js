'use strict';
var net = require('net');
var util = require('util');
var path = require('path');
var shell = require('shelljs');
const v12 = require('debug');
var debug = v12('dns-sync');
const v21 = function resolve(hostname) {
    var output;
    var nodeBinary = process.execPath;
    var scriptPath = path.join(__dirname, '../scripts/dns-lookup-script');
    var response;
    var cmd = util.format('"%s" "%s" %s', nodeBinary, scriptPath, hostname);
    const v13 = { silent: true };
    response = shell.exec(cmd, v13);
    const v14 = response.code;
    const v15 = v14 === 0;
    const v16 = response && v15;
    if (v16) {
        output = response.output;
        const v17 = net.isIP(output);
        const v18 = output && v17;
        if (v18) {
            return output;
        }
    }
    const v19 = 'fail to resolve hostname ' + hostname;
    const v20 = debug('hostname', v19);
    v20;
    return null;
};
const v22 = {};
v22.resolve = v21;
module.exports = v22;