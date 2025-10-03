const v17 = require('util');
const promisify = v17.promisify;
const v18 = require('path');
const join = v18.join;
const shell = require('any-shell-escape');
const v19 = require('fs');
const v20 = v19.exists;
const exists = promisify(v20);
const v21 = require('child_process');
const v22 = v21.exec;
const exec = promisify(v22);
const pathToFfmpeg = require('ffmpeg-static');
const v30 = async function (filename) {
    const dest = mp4Name(filename);
    const v23 = require('fs');
    const v24 = v23.exists;
    const exists = promisify(v24);
    if (await exists(dest)) {
        return dest;
    }
    const v25 = join('_site', filename);
    const v26 = join('_site', dest);
    const v27 = [
        pathToFfmpeg,
        '-y',
        '-v',
        'error',
        '-i',
        v25,
        '-filter_complex',
        '[0:v] fps=15',
        '-vsync',
        0,
        '-f',
        'mp4',
        '-pix_fmt',
        'yuv420p',
        v26
    ];
    const command = shell(v27);
    try {
        await exec(command);
    } catch (e) {
        const v28 = e.stderr;
        const v29 = new Error(`Failed executing ${ command } with ${ v28 }`);
        throw v29;
    }
    return dest;
};
exports.gif2mp4 = v30;
const mp4Name = function (filename) {
    const v31 = _ => {
        return '.mp4';
    };
    const v32 = filename.replace(/\.\w+$/, v31);
    return v32;
};