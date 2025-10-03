const v24 = require('child_process');
const execSync = v24.execSync;
const fs = require('fs');
const path = require('path');
const shq = function (s) {
    const v25 = String(s);
    const v26 = `'\\''`;
    const v27 = v25.replace(/'/g, v26);
    const v28 = `'${ v27 }'`;
    return v28;
};
const within = function (base, p) {
    const rp = path.resolve(p);
    const rb = path.resolve(base);
    const v29 = rp === rb;
    const v30 = path.sep;
    const v31 = rb + v30;
    const v32 = rp.startsWith(v31);
    const v33 = v29 || v32;
    return v33;
};
const transcodeVideo = function (mediaRoot, inputRel, outputRel) {
    const inAbs = path.resolve(mediaRoot, inputRel);
    const outAbs = path.resolve(mediaRoot, outputRel);
    const v34 = within(mediaRoot, inAbs);
    const v35 = !v34;
    const v36 = within(mediaRoot, outAbs);
    const v37 = !v36;
    const v38 = v35 || v37;
    if (v38) {
        const v39 = new Error('Path outside media root');
        throw v39;
    }
    const v40 = fs.existsSync(inAbs);
    const v41 = !v40;
    if (v41) {
        const v42 = new Error('Input missing');
        throw v42;
    }
    const v43 = shq(inAbs);
    const v44 = shq(outAbs);
    const cmd = `ffmpeg -y -i ${ v43 } -c:v libx264 -preset veryfast -crf 23 -c:a aac ${ v44 }`;
    const v45 = { stdio: 'inherit' };
    const v46 = execSync(cmd, v45);
    v46;
};