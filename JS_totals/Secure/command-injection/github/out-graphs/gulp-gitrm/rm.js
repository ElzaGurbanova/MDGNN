var map = require('map-stream');
var gutil = require('gulp-util');
const v28 = require('child_process');
var execFile = v28.execFile;
const v54 = function (opt) {
    const v29 = !opt;
    if (v29) {
        opt = {};
    }
    const v30 = opt.args;
    const v31 = !v30;
    if (v31) {
        opt.args = ' ';
    }
    const rm = function (file, cb) {
        const v32 = file.path;
        const v33 = !v32;
        if (v33) {
            const v34 = new Error('gulp-git: file is required');
            throw v34;
        }
        const v35 = opt.args;
        const v36 = v35 || '';
        const v37 = String(v36);
        var extra = v37.trim();
        let extraArgs;
        const v38 = extra.split(/\s+/);
        const v39 = v38.filter(Boolean);
        const v40 = [];
        if (extra) {
            extraArgs = v39;
        } else {
            extraArgs = v40;
        }
        const v41 = file.path;
        const v42 = [
            'rm',
            '--',
            v41
        ];
        var argv = v42.concat(extraArgs);
        const v43 = file.cwd;
        const v44 = { cwd: v43 };
        const v51 = function (err, stdout, stderr) {
            const v45 = err && cb;
            if (v45) {
                const v46 = cb(err);
                return v46;
            }
            const v47 = stdout || '';
            const v48 = stderr || '';
            const v49 = gutil.log(v47, v48);
            v49;
            if (cb) {
                const v50 = cb(null, file);
                v50;
            }
        };
        const v52 = execFile('git', argv, v44, v51);
        v52;
    };
    const v53 = map(rm);
    return v53;
};
module.exports = v54;