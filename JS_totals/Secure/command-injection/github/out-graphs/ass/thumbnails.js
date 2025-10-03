const ffmpeg = require('ffmpeg-static');
const Jimp = require('Jimp');
const v70 = require('child_process');
const execFile = v70.execFile;
const v71 = require('./utils');
const path = v71.path;
const v72 = require('./config.json');
const diskFilePath = v72.diskFilePath;
const v73 = 200 * 2;
const v74 = 140 * 2;
const THUMBNAIL = {};
THUMBNAIL.QUALITY = 75;
THUMBNAIL.WIDTH = v73;
THUMBNAIL.HEIGHT = v74;
const getFfmpegArgs = function (src, dest) {
    const v75 = process.env;
    const v76 = v75.NODE_ENV;
    const v77 = v76 === 'production';
    let v78;
    if (v77) {
        v78 = 'error';
    } else {
        v78 = 'debug';
    }
    const v79 = THUMBNAIL.WIDTH;
    const v80 = THUMBNAIL.HEIGHT;
    const v81 = [
        '-y',
        '-v',
        v78,
        '-i',
        src,
        '-ss',
        '00:00:01.000',
        '-frames:v',
        '1',
        '-s',
        `${ v79 }x${ v80 }`,
        dest
    ];
    return v81;
};
const getNewName = function (oldName) {
    const v82 = oldName.concat('.thumbnail.jpg');
    return v82;
};
const getNewNamePath = function (oldName) {
    const v83 = getNewName(oldName);
    const v84 = path(diskFilePath, 'thumbnails/', v83);
    return v84;
};
const getVideoThumbnail = function (file) {
    const v85 = file.randomId;
    const dest = getNewNamePath(v85);
    const v86 = file.path;
    const args = getFfmpegArgs(v86, dest);
    const v93 = (resolve, reject) => {
        const v87 = { windowsHide: true };
        const v91 = err => {
            const v88 = reject(err);
            const v89 = resolve();
            let v90;
            if (err) {
                v90 = v88;
            } else {
                v90 = v89;
            }
            return v90;
        };
        const v92 = execFile(ffmpeg, args, v87, v91);
        return v92;
    };
    const v94 = new Promise(v93);
    return v94;
};
const getImageThumbnail = function (file) {
    const v110 = (resolve, reject) => {
        const v95 = file.path;
        const v96 = Jimp.read(v95);
        const v106 = image => {
            const v97 = THUMBNAIL.QUALITY;
            const v98 = image.quality(v97);
            const v99 = THUMBNAIL.WIDTH;
            const v100 = THUMBNAIL.HEIGHT;
            const v101 = Jimp.RESIZE_BICUBIC;
            const v102 = v98.resize(v99, v100, v101);
            const v103 = file.randomId;
            const v104 = getNewNamePath(v103);
            const v105 = v102.write(v104);
            return v105;
        };
        const v107 = v96.then(v106);
        const v108 = v107.then(resolve);
        const v109 = v108.catch(reject);
        return v109;
    };
    const v111 = new Promise(v110);
    return v111;
};
const v138 = file => {
    const v136 = (resolve, reject) => {
        const v112 = file.is;
        const v113 = v112.video;
        const v114 = file.is;
        const v115 = v114.image;
        const v117 = () => {
            const v116 = Promise.resolve();
            return v116;
        };
        let v118;
        if (v115) {
            v118 = getImageThumbnail;
        } else {
            v118 = v117;
        }
        let v119;
        if (v113) {
            v119 = getVideoThumbnail;
        } else {
            v119 = v118;
        }
        const v120 = v119(file);
        const v133 = () => {
            const v121 = file.is;
            const v122 = v121.video;
            const v123 = file.is;
            const v124 = v123.image;
            const v125 = v122 || v124;
            const v126 = file.randomId;
            const v127 = getNewName(v126);
            const v128 = file.is;
            const v129 = v128.audio;
            let v130;
            if (v129) {
                v130 = 'views/ass-audio-icon.png';
            } else {
                v130 = 'views/ass-file-icon.png';
            }
            let v131;
            if (v125) {
                v131 = v127;
            } else {
                v131 = v130;
            }
            const v132 = resolve(v131);
            return v132;
        };
        const v134 = v120.then(v133);
        const v135 = v134.catch(reject);
        return v135;
    };
    const v137 = new Promise(v136);
    return v137;
};
module.exports = v138;