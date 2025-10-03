const ffmpeg = require('ffmpeg-static');
const Jimp = require('Jimp');
const { execFile } = require('child_process');
const { path } = require('./utils');
const { diskFilePath } = require('./config.json');

// Thumbnail parameters
const THUMBNAIL = {
  QUALITY: 75,
  WIDTH: 200 * 2,
  HEIGHT: 140 * 2,
};

/**
 * Build argv for ffmpeg thumbnail extraction (no shell)
 */
function getFfmpegArgs(src, dest) {
  return [
    '-y',
    '-v', (process.env.NODE_ENV === 'production' ? 'error' : 'debug'),
    '-i', src,
    '-ss', '00:00:01.000',
    '-frames:v', '1',
    '-s', `${THUMBNAIL.WIDTH}x${THUMBNAIL.HEIGHT}`,
    dest
  ];
}

/**
 * Builds a thumbnail filename
 */
function getNewName(oldName) {
  return oldName.concat('.thumbnail.jpg');
}

/**
 * Builds a path to the thumbnails
 */
function getNewNamePath(oldName) {
  return path(diskFilePath, 'thumbnails/', getNewName(oldName));
}

/**
 * Extracts an image from a video file to use as a thumbnail, using ffmpeg
 */
function getVideoThumbnail(file) {
  const dest = getNewNamePath(file.randomId);
  const args = getFfmpegArgs(file.path, dest);
  return new Promise((resolve, reject) =>
    execFile(ffmpeg, args, { windowsHide: true }, (err) => (err ? reject(err) : resolve()))
  );
}

/**
 * Generates a thumbnail for the provided image
 */
function getImageThumbnail(file) {
  return new Promise((resolve, reject) =>
    Jimp.read(file.path)
      .then((image) => image
        .quality(THUMBNAIL.QUALITY)
        .resize(THUMBNAIL.WIDTH, THUMBNAIL.HEIGHT, Jimp.RESIZE_BICUBIC)
        .write(getNewNamePath(file.randomId)))
      .then(resolve)
      .catch(reject)
  );
}

/**
 * Generates a thumbnail
 * @returns The thumbnail filename (NOT the path)
 */
module.exports = (file) =>
  new Promise((resolve, reject) =>
    (file.is.video ? getVideoThumbnail : file.is.image ? getImageThumbnail : () => Promise.resolve())(file)
      .then(() => resolve((file.is.video || file.is.image) ? getNewName(file.randomId) : file.is.audio ? 'views/ass-audio-icon.png' : 'views/ass-file-icon.png'))
      .catch(reject)
  );

