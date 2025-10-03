import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
const escapeDrawtextText = function (s) {
    const v35 = String(s);
    const v36 = v35.replace(/\\/g, '\\\\');
    const v37 = v36.replace(/:/g, '\\:');
    const v38 = v37.replace(/'/g, '\\\'');
    return v38;
};
const addTextToVideo = function (inputVideoPath, outputVideoPath, text, x, y, fontSize = 50, fontColor = 'white', fontFile = null, audioFile = null) {
    const args = [];
    const v39 = args.push('-i', inputVideoPath);
    v39;
    const v40 = fs.existsSync(audioFile);
    const hasAudio = audioFile && v40;
    if (hasAudio) {
        const v41 = args.push('-i', audioFile);
        v41;
    }
    const escapedText = escapeDrawtextText(text);
    let drawOpts = `text='${ escapedText }':x=${ x }:y=${ y }:fontsize=${ fontSize }:fontcolor=${ fontColor }`;
    const v42 = fs.existsSync(fontFile);
    const v43 = fontFile && v42;
    if (v43) {
        drawOpts += `:fontfile='${ fontFile }'`;
    }
    if (hasAudio) {
        const filter = `[0:v]drawtext=${ drawOpts }[v]`;
        const v44 = args.push('-filter_complex', filter, '-map', '[v]', '-map', '1:a', '-shortest');
        v44;
    } else {
        const v45 = `drawtext=${ drawOpts }`;
        const v46 = args.push('-vf', v45, '-codec:a', 'copy');
        v46;
    }
    const v47 = args.push(outputVideoPath);
    v47;
    const v63 = (resolve, reject) => {
        const v48 = args.join(' ');
        const v49 = `Executing: ffmpeg ${ v48 }`;
        const v50 = console.log(v49);
        v50;
        const v51 = { windowsHide: true };
        const v61 = (error, stdout, stderr) => {
            if (error) {
                const v52 = error.message;
                const v53 = `Error: ${ v52 }`;
                const v54 = console.error(v53);
                v54;
                const v55 = reject(error);
                return v55;
            }
            if (stderr) {
                const v56 = `FFmpeg stderr: ${ stderr }`;
                const v57 = console.log(v56);
                v57;
            }
            const v58 = `Video processed successfully: ${ outputVideoPath }`;
            const v59 = console.log(v58);
            v59;
            const v60 = resolve(outputVideoPath);
            v60;
        };
        const v62 = execFile('ffmpeg', args, v51, v61);
        v62;
    };
    const v64 = new Promise(v63);
    return v64;
};
const main = async function () {
    try {
        const result = await addTextToVideo('./input-video.mp4', './output-video.mp4', 'this is social media campaign app, designed to run your full social media campaign', 50, 100, 36, 'white', null, './background-music.mp3');
        const v65 = `Success! Output saved to: ${ result }`;
        const v66 = console.log(v65);
        v66;
    } catch (error) {
        const v67 = console.error('Failed to process video:', error);
        v67;
    }
};
const v68 = main();
v68;