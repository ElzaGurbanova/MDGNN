const v23 = require('child_process');
const exec = v23.exec;
const path = require('path');
const fs = require('fs');
const os = require('os');
var selflatex = function (src_file, dest_file, callback) {
    const v24 = src_file.split('/');
    const v25 = -1;
    const v26 = v24.splice(v25);
    const v27 = v26[0];
    const v28 = v27.split('.');
    var texname = v28[0];
    const v29 = 'pdflatex -output-directory ' + dest_file;
    const v30 = v29 + ' ';
    const v31 = v30 + src_file;
    const v43 = (err, stdout, stderr) => {
        if (err) {
            const v32 = `pdflatex[1] error: ${ err }`;
            const v33 = callback(1, v32);
            v33;
        } else {
            const v34 = 'pdflatex -output-directory ' + dest_file;
            const v35 = v34 + ' ';
            const v36 = v35 + src_file;
            const v41 = (err, stdout, stderr) => {
                if (err) {
                    const v37 = `pdflatex[2] error: ${ err }`;
                    const v38 = callback(1, v37);
                    v38;
                } else {
                    const v39 = `[node-latex-complete] Complete source: ${ src_file }, check out result in ${ dest_file }!`;
                    const v40 = callback(0, v39);
                    v40;
                }
            };
            const v42 = exec(v36, v41);
            v42;
        }
    };
    const v44 = exec(v31, v43);
    v44;
};
module.exports = selflatex;