const v22 = require('child_process');
const exec = v22.exec;
const path = require('path');
const v42 = () => {
    const BASE_URL = 'https://storage.googleapis.com/';
    const upload = function (inputDirectory, bucket, force = false) {
        const v27 = (yes, no) => {
            let _path = path.resolve(inputDirectory);
            let _rn;
            if (force) {
                _rn = '-r';
            } else {
                _rn = '-Rn';
            }
            const v23 = `gsutil -m cp ${ _rn } -a public-read ${ _path } ${ bucket }`;
            let _cmd = exec(v23);
            const v25 = code => {
                const v24 = yes();
                v24;
            };
            const v26 = _cmd.on('exit', v25);
            v26;
        };
        const v28 = new Promise(v27);
        return v28;
    };
    const cors = function (bucket) {
        const v33 = (yes, no) => {
            const v29 = path.join(__dirname, 'google-storage-cors.json');
            let _c = `gsutil cors set ${ v29 } ${ bucket }`;
            const v30 = console.log(_c);
            v30;
            const v32 = (code, stdout, stderr) => {
                const v31 = yes();
                v31;
            };
            let _cmd = exec(_c, v32);
        };
        const v34 = new Promise(v33);
        return v34;
    };
    const publicRead = function (bucket) {
        const v39 = (yes, no) => {
            let _c = `gsutil -m acl set -R -a public-read ${ bucket }`;
            const v35 = console.log(_c);
            v35;
            const v38 = (code, stdout, stderr) => {
                if (stderr) {
                    const v36 = no(stderr);
                    v36;
                } else {
                    const v37 = yes();
                    v37;
                }
            };
            let _cmd = exec(_c, v38);
        };
        const v40 = new Promise(v39);
        return v40;
    };
    const v41 = {};
    v41.baseUrl = BASE_URL;
    v41.upload = upload;
    v41.cors = cors;
    v41.publicRead = publicRead;
    return v41;
};
const P = v42();
module.exports = P;