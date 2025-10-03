const v52 = function (docroot, phpBin) {
    'use strict';
    phpBin = phpBin || 'php';
    var fs = require('fs');
    const v27 = require('path');
    var join = v27.join;
    const v28 = require('path');
    var norm = v28.normalize;
    const v51 = function (req, res, next) {
        const v29 = req.url;
        const v30 = /\.php$/i.test(v29);
        if (v30) {
            const v31 = req.url;
            const v32 = join(docroot, v31);
            var phpFile = norm(v32);
            const v48 = function (exists) {
                if (exists) {
                    const v33 = res.setHeader('Content-Type', 'text/html');
                    v33;
                    const v34 = require('child_process');
                    const v35 = [phpFile];
                    var cp = v34.spawn(phpBin, v35);
                    const v36 = cp.stdout;
                    const v38 = function (data) {
                        const v37 = res.write(data);
                        v37;
                    };
                    const v39 = v36.on('data', v38);
                    v39;
                    const v40 = cp.stderr;
                    const v42 = function (data) {
                        const v41 = res.write(data);
                        v41;
                    };
                    const v43 = v40.on('data', v42);
                    v43;
                    const v45 = function () {
                        const v44 = res.end('');
                        v44;
                    };
                    const v46 = cp.on('close', v45);
                    v46;
                } else {
                    const v47 = next();
                    v47;
                }
            };
            const v49 = fs.exists(phpFile, v48);
            v49;
        } else {
            const v50 = next();
            v50;
        }
    };
    return v51;
};
module.exports = v52;