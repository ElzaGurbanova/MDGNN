const ffmpegPath = require("ffmpeg-static"); // absolute path to ffmpeg binary
const path = require('path');
const { promisify } = require("util");
const { execFile } = require("child_process");
const fs = require("fs");
const rimraf = require('rimraf');

const execFileAsync = promisify(execFile);

async function unpackVideoToFrames(file, dir = "frames") {
  try {
    // Make/clean the directory
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    rimraf.sync(path.join(dir, '*'));
    if (fs.existsSync('out-frames')) rimraf.sync(path.join('out-frames', '*'));

    // ffmpeg -i <file> -qscale:v 2 <dir>/out%03d.jpg
    const outPattern = path.join(dir, 'out%03d.jpg');
    await execFileAsync(ffmpegPath, ['-i', file, '-qscale:v', '2', outPattern], { windowsHide: true });

    return {
      path: path.join(dir, 'out%3d.jpg'),
      totalFrames: 460 // TODO: compute
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function packVideoFromFrames(filepath = ".out.mp4") {
  try {
    const dir = 'out-frames';
    // ffmpeg -y -start_number 0 -i out-frames/out%03d.jpg <filepath>.mp4
    const inPattern = path.join(dir, 'out%03d.jpg');
    const outFile = `${filepath}.mp4`;
    await execFileAsync(ffmpegPath, ['-y', '-start_number', '0', '-i', inPattern, outFile], { windowsHide: true });
    return { path: filepath }
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function processVideo(file) {
  await unpackVideoToFrames(file);
  // Apply obfuscation (if any)
  return await packVideoFromFrames();
}

module.exports = {
  processVideo,
  unpackVideoToFrames,
  packVideoFromFrames
};

