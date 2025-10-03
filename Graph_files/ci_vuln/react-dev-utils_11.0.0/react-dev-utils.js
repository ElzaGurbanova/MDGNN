'use strict';
var chalk = require('chalk');
const v30 = require('child_process');
var execSync = v30.execSync;
var path = require('path');
const v31 = [
    'pipe',
    'pipe',
    'ignore'
];
var execOptions = {};
execOptions.encoding = 'utf8';
execOptions.stdio = v31;
const isProcessAReactApp = function (processCommand) {
    const v32 = /^node .*react-scripts\/scripts\/start\.js\s?$/.test(processCommand);
    return v32;
};
const getProcessIdOnPort = function (port) {
    const v33 = 'lsof -i:' + port;
    const v34 = v33 + ' -P -t -sTCP:LISTEN';
    const v35 = execSync(v34, execOptions);
    const v36 = v35.split('\n');
    const v37 = v36[0];
    const v38 = v37.trim();
    return v38;
};
const getPackageNameInDirectory = function (directory) {
    const v39 = directory.trim();
    var packagePath = path.join(v39, 'package.json');
    try {
        const v40 = require(packagePath);
        const v41 = v40.name;
        return v41;
    } catch (e) {
        return null;
    }
};
const getProcessCommand = function (processId, processDirectory) {
    const v42 = 'ps -o command -p ' + processId;
    const v43 = v42 + ' | sed -n 2p';
    var command = execSync(v43, execOptions);
    command = command.replace(/\n$/, '');
    const v44 = isProcessAReactApp(command);
    if (v44) {
        const packageName = getPackageNameInDirectory(processDirectory);
        let v45;
        if (packageName) {
            v45 = packageName;
        } else {
            v45 = command;
        }
        return v45;
    } else {
        return command;
    }
};
const getDirectoryOfProcessById = function (processId) {
    const v46 = 'lsof -p ' + processId;
    const v47 = v46 + ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'';
    const v48 = execSync(v47, execOptions);
    const v49 = v48.trim();
    return v49;
};
const getProcessForPort = function (port) {
    try {
        var processId = getProcessIdOnPort(port);
        var directory = getDirectoryOfProcessById(processId);
        var command = getProcessCommand(processId, directory);
        const v50 = chalk.cyan(command);
        const v51 = ' (pid ' + processId;
        const v52 = v51 + ')\n';
        const v53 = chalk.grey(v52);
        const v54 = v50 + v53;
        const v55 = chalk.blue('  in ');
        const v56 = v54 + v55;
        const v57 = chalk.cyan(directory);
        const v58 = v56 + v57;
        return v58;
    } catch (e) {
        return null;
    }
};
module.exports = getProcessForPort;