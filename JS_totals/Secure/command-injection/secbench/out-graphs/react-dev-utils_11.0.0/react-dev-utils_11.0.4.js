'use strict';
var chalk = require('chalk');
const v31 = require('child_process');
var execSync = v31.execSync;
const v32 = require('child_process');
var execFileSync = v32.execFileSync;
var path = require('path');
const v33 = [
    'pipe',
    'pipe',
    'ignore'
];
var execOptions = {};
execOptions.encoding = 'utf8';
execOptions.stdio = v33;
const isProcessAReactApp = function (processCommand) {
    const v34 = /^node .*react-scripts\/scripts\/start\.js\s?$/.test(processCommand);
    return v34;
};
const getProcessIdOnPort = function (port) {
    const v35 = '-i:' + port;
    const v36 = [
        v35,
        '-P',
        '-t',
        '-sTCP:LISTEN'
    ];
    const v37 = execFileSync('lsof', v36, execOptions);
    const v38 = v37.split('\n');
    const v39 = v38[0];
    const v40 = v39.trim();
    return v40;
};
const getPackageNameInDirectory = function (directory) {
    const v41 = directory.trim();
    var packagePath = path.join(v41, 'package.json');
    try {
        const v42 = require(packagePath);
        const v43 = v42.name;
        return v43;
    } catch (e) {
        return null;
    }
};
const getProcessCommand = function (processId, processDirectory) {
    const v44 = 'ps -o command -p ' + processId;
    const v45 = v44 + ' | sed -n 2p';
    var command = execSync(v45, execOptions);
    command = command.replace(/\n$/, '');
    const v46 = isProcessAReactApp(command);
    if (v46) {
        const packageName = getPackageNameInDirectory(processDirectory);
        let v47;
        if (packageName) {
            v47 = packageName;
        } else {
            v47 = command;
        }
        return v47;
    } else {
        return command;
    }
};
const getDirectoryOfProcessById = function (processId) {
    const v48 = 'lsof -p ' + processId;
    const v49 = v48 + ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'';
    const v50 = execSync(v49, execOptions);
    const v51 = v50.trim();
    return v51;
};
const getProcessForPort = function (port) {
    try {
        var processId = getProcessIdOnPort(port);
        var directory = getDirectoryOfProcessById(processId);
        var command = getProcessCommand(processId, directory);
        const v52 = chalk.cyan(command);
        const v53 = ' (pid ' + processId;
        const v54 = v53 + ')\n';
        const v55 = chalk.grey(v54);
        const v56 = v52 + v55;
        const v57 = chalk.blue('  in ');
        const v58 = v56 + v57;
        const v59 = chalk.cyan(directory);
        const v60 = v58 + v59;
        return v60;
    } catch (e) {
        return null;
    }
};
module.exports = getProcessForPort;