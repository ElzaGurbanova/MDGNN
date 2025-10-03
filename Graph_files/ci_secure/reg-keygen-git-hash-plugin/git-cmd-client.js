'use strict';
const v35 = require('child_process');
const execSync = v35.execSync;
const shellEscape = require('shell-escape');
const GitCmdClient = function GitCmdClient() {
    const v36 = {};
    this._revParseHash = v36;
};
const currentName = function currentName() {
    const v37 = { encoding: 'utf8' };
    const v38 = execSync('git branch | grep "^\\*" | cut -b 3-', v37);
    return v38;
};
GitCmdClient.currentName = currentName;
const revParse = function revParse(currentName) {
    const v39 = this._revParseHash;
    const v40 = v39[currentName];
    const v41 = !v40;
    if (v41) {
        const v43 = `git rev-parse "${ currentName }"`;
        const v44 = { encoding: 'utf8' };
        const v45 = execSync(v43, v44);
        v42[currentName] = v45;
    }
    const v46 = this._revParseHash;
    const v47 = v46[currentName];
    return v47;
};
GitCmdClient.revParse = revParse;
const branches = function branches() {
    const v48 = { encoding: 'utf8' };
    const v49 = execSync('git branch -a', v48);
    return v49;
};
GitCmdClient.branches = branches;
const containedBranches = function containedBranches(hash) {
    const v50 = [
        'git',
        'branch',
        '-a',
        '--contains',
        hash
    ];
    const v51 = shellEscape(v50);
    const v52 = { encoding: 'utf8' };
    const v53 = execSync(v51, v52);
    return v53;
};
GitCmdClient.containedBranches = containedBranches;
const logTime = function logTime(hash) {
    const v54 = [
        'git',
        'log',
        '--pretty=%ci',
        '-n',
        '1',
        hash
    ];
    const v55 = shellEscape(v54);
    const v56 = { encoding: 'utf8' };
    const v57 = execSync(v55, v56);
    return v57;
};
GitCmdClient.logTime = logTime;
const logBetween = function logBetween(a, b) {
    const v58 = [
        'git',
        'log',
        '--oneline',
        `${ a }..${ b }`
    ];
    const v59 = shellEscape(v58);
    const v60 = { encoding: 'utf8' };
    const v61 = execSync(v59, v60);
    return v61;
};
GitCmdClient.logBetween = logBetween;
const logGraph = function logGraph() {
    const v62 = { encoding: 'utf8' };
    const v63 = execSync('git log -n 300 --graph --pretty=format:"%h %p"', v62);
    return v63;
};
GitCmdClient.logGraph = logGraph;
const mergeBase = function mergeBase(a, b) {
    const v64 = [
        'git',
        'merge-base',
        '-a',
        a,
        b
    ];
    const v65 = shellEscape(v64);
    const v66 = { encoding: 'utf8' };
    const v67 = execSync(v65, v66);
    return v67;
};
GitCmdClient.mergeBase = mergeBase;
GitCmdClient['is_class'] = true;
const v68 = {};
v68.GitCmdClient = GitCmdClient;
module.exports = v68;