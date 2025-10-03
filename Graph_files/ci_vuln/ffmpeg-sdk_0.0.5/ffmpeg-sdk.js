const v53 = require('child_process');
const exec = v53.exec;
const execute = function (command) {
    const v58 = (resolve, reject) => {
        const v56 = (error, stdout, stderr) => {
            if (error) {
                const v54 = reject(stderr);
                v54;
            } else {
                const v55 = resolve(stdout);
                v55;
            }
        };
        const v57 = exec(command, v56);
        v57;
    };
    const v59 = new Promise(v58);
    return v59;
};
const timeInMilliSeconds = function (formattedTime) {
    let splitTime = formattedTime.split(':');
    const v60 = splitTime[2];
    let secondsSplit = v60.split('.');
    const v61 = splitTime[0];
    const v62 = parseInt(v61);
    const v63 = v62 * 60;
    const v64 = v63 * 60;
    const v65 = splitTime[1];
    const v66 = parseInt(v65);
    const v67 = v66 * 60;
    const v68 = v64 + v67;
    const v69 = secondsSplit[0];
    const v70 = parseInt(v69);
    const v71 = v68 + v70;
    const v72 = v71 * 1000;
    const v73 = secondsSplit[1];
    const v74 = parseInt(v73);
    const v75 = v74 || 0;
    const v76 = v72 + v75;
    return v76;
};
const formattedTime = function (milliSeconds) {
    const v77 = isNaN(milliSeconds);
    const v78 = milliSeconds < 0;
    const v79 = v77 || v78;
    if (v79) {
        return null;
    }
    const v80 = new Date(milliSeconds);
    let formattedDate = v80.toISOString();
    const v81 = formattedDate.split('1970-01-01T');
    let formattedTime = v81[1];
    const v82 = formattedTime.split('Z');
    const v83 = v82[0];
    return v83;
};
const clip = function (inputFilePath, outputFilePath, startTime, endTime) {
    let duration = endTime - startTime;
    const v84 = formattedTime(startTime);
    const v85 = formattedTime(duration);
    const v86 = `ffmpeg -ss ${ v84 } -i ${ inputFilePath } -t ${ v85 } ${ outputFilePath } -y`;
    const v87 = execute(v86);
    return v87;
};
const split = function (inputFilePath, outputFilePath, clipPoints) {
    let splitQueue = [];
    const v97 = (cl, ci) => {
        const v88 = clipPoints.length;
        const v89 = v88 - 1;
        const v90 = v89 > ci;
        if (v90) {
            const v91 = `${ ci }-${ outputFilePath }`;
            const v92 = clipPoints[ci];
            const v93 = ci + 1;
            const v94 = clipPoints[v93];
            const v95 = clip(inputFilePath, v91, v92, v94);
            const v96 = splitQueue.push(v95);
            v96;
        }
    };
    const v98 = clipPoints.forEach(v97);
    v98;
    const v99 = Promise.all(splitQueue);
    return v99;
};
const parseAudio = function (inputFilePath, outputFilePath) {
    const v100 = `ffmpeg -i ${ inputFilePath } -f mp2 ${ outputFilePath }`;
    const v101 = execute(v100);
    return v101;
};
const parseAudioLowQuality = function (inputFilePath, outputFilePath) {
    const v102 = `ffmpeg -i ${ inputFilePath } -ac 1 -ab 64000 ${ outputFilePath }`;
    const v103 = execute(v102);
    return v103;
};
const v104 = {};
v104.execute = execute;
v104.clip = clip;
v104.split = split;
v104.parseAudio = parseAudio;
v104.formattedTime = formattedTime;
v104.timeInMilliSeconds = timeInMilliSeconds;
v104.parseAudioLowQuality = parseAudioLowQuality;
module.exports = v104;