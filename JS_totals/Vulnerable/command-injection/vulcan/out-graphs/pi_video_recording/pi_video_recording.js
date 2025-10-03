'use strict';
const childProcess = require('child_process');
const fs = require('fs');
const treeKill = require('tree-kill');
const globalConf = require('./config.json');
const execSync = childProcess.execSync;
const writePath = globalConf.writePath;
const livePort = globalConf.livePort;
const v38 = globalConf.size;
const width = v38.width;
const v39 = globalConf.size;
const height = v39.height;
const v40 = execSync('hostname');
let hostname = ` ${ v40 }`;
hostname = hostname.replace(/\s/g, '');
let logStream;
let proc;
const writeLogs = function (fileName) {
    const logPath = `${ writePath }/${ hostname }_${ fileName }.log`;
    const v41 = `Writing logs in ${ logPath }`;
    const v42 = console.log(v41);
    v42;
    const v43 = { flags: 'a' };
    logStream = fs.createWriteStream(logPath, v43);
    const v44 = proc.stdout;
    const v45 = v44.pipe(logStream);
    v45;
    const v46 = proc.stderr;
    const v47 = v46.pipe(logStream);
    v47;
};
const v50 = function () {
    const v48 = `raspivid -o - -t 0 -ih -n -pf high -ISO 800 -ex night -vs -drc high -fps 30 -w ${ width } -h ${ height } -r ${ hostname } 
      | cvlc -vvv stream:///dev/stdin --sout '#standard{access=http,mux=ts,dst=:${ livePort }}' --demux=h264 --h264-fps=30.0000`;
    proc = childProcess.exec(v48);
    proc.title = 'live';
    const v49 = writeLogs('live');
    v49;
};
const v59 = function (callback) {
    const v51 = proc.pid;
    const v52 = 'killing pid : ' + v51;
    const v53 = console.log(v52);
    v53;
    const v54 = proc.pid;
    const v55 = treeKill(v54, 'SIGINT');
    v55;
    const v57 = function () {
        const v56 = callback();
        v56;
    };
    const v58 = setTimeout(v57, 2500);
    v58;
};
const v63 = function (file) {
    const v60 = file + '.h264';
    const v61 = [
        '-o',
        v60,
        '-t',
        '0',
        '-ih',
        '-pf',
        'high',
        '-ISO',
        '800',
        '-ex',
        'night',
        '-drc',
        'high',
        '-n',
        '-fps',
        '30',
        '-w',
        `${ width }`,
        '-h',
        `${ height }`,
        '-r',
        '90',
        '-b',
        '8000000',
        '-r',
        hostname
    ];
    proc = childProcess.spawn('raspivid', v61);
    proc.title = 'record';
    const v62 = writeLogs('record');
    v62;
};
const v69 = function (file, callback) {
    const v64 = proc.kill('SIGINT');
    v64;
    const parent = this;
    const v67 = function () {
        const v65 = parent.encodeRecord(file);
        v65;
        const v66 = callback();
        v66;
    };
    const v68 = setTimeout(v67, 2500);
    v68;
};
const v73 = function (file) {
    const v70 = `Encoding file ${ file } from h264 to mp4 (also removing h264)`;
    const v71 = console.log(v70);
    v71;
    const v72 = `avconv -r 30 -i ${ file }.h264 -threads 8 -y -loglevel quiet -vcodec copy ${ file }.mp4 && rm ${ file }.h264`;
    const process = childProcess.exec(v72);
    process.title = 'VIDEO_ENCODING';
};
const v74 = {};
v74.startLive = v50;
v74.stopLive = v59;
v74.startRecord = v63;
v74.stopRecord = v69;
v74.encodeRecord = v73;
module.exports = v74;