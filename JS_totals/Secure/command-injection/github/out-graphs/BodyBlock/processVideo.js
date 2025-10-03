const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const v21 = require('util');
const promisify = v21.promisify;
const v22 = require('child_process');
const execFile = v22.execFile;
const fs = require('fs');
const rimraf = require('rimraf');
const execFileAsync = promisify(execFile);
const unpackVideoToFrames = async function (file, dir = 'frames') {
    try {
        const v23 = fs.existsSync(dir);
        const v24 = !v23;
        if (v24) {
            const v25 = fs.mkdirSync(dir);
            v25;
        }
        const v26 = path.join(dir, '*');
        const v27 = rimraf.sync(v26);
        v27;
        const v28 = fs.existsSync('out-frames');
        if (v28) {
            const v29 = path.join('out-frames', '*');
            const v30 = rimraf.sync(v29);
            v30;
        }
        const outPattern = path.join(dir, 'out%03d.jpg');
        const v31 = [
            '-i',
            file,
            '-qscale:v',
            '2',
            outPattern
        ];
        const v32 = { windowsHide: true };
        await execFileAsync(ffmpegPath, v31, v32);
        const v33 = path.join(dir, 'out%3d.jpg');
        const v34 = {};
        v34.path = v33;
        v34.totalFrames = 460;
        return v34;
    } catch (error) {
        const v35 = console.error(error);
        v35;
        return false;
    }
};
const packVideoFromFrames = async function (filepath = '.out.mp4') {
    try {
        const dir = 'out-frames';
        const inPattern = path.join(dir, 'out%03d.jpg');
        const outFile = `${ filepath }.mp4`;
        const v36 = [
            '-y',
            '-start_number',
            '0',
            '-i',
            inPattern,
            outFile
        ];
        const v37 = { windowsHide: true };
        await execFileAsync(ffmpegPath, v36, v37);
        const v38 = {};
        v38.path = filepath;
        return v38;
    } catch (error) {
        const v39 = console.error(error);
        v39;
        return false;
    }
};
const processVideo = async function (file) {
    await unpackVideoToFrames(file);
    return await packVideoFromFrames();
};
const v40 = {};
v40.processVideo = processVideo;
v40.unpackVideoToFrames = unpackVideoToFrames;
v40.packVideoFromFrames = packVideoFromFrames;
module.exports = v40;