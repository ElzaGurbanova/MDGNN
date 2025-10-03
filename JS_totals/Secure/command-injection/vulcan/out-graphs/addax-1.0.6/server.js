const _ = require('lodash');
const express = require('express');
const v42 = require('child_process');
const exec = v42.exec;
const v43 = require('./authentication.js');
const readAuthFile = v43.readAuthFile;
const sanitizePath = function (path) {
    const v44 = !path;
    if (v44) {
        return path;
    }
    const illegalRe = /[\?<>\\:\*\|":;& ]/g;
    const controlRe = /[\x00-\x1f\x80-\x9f]/g;
    const v45 = path.replace(illegalRe, '');
    const v46 = v45.replace(controlRe, '');
    return v46;
};
const authenticateUser = async function (token, rootDirectory) {
    const auth = await readAuthFile();
    const v47 = _.get(auth, token, null);
    const v48 = v47 === rootDirectory;
    return v48;
};
const presignPath = function (config, userDir, path) {
    const v49 = config.rootPath;
    const s3path = `s3://${ v49 }/${ userDir }/${ path }`;
    const s3command = `aws s3 presign --expires-in 604800 ${ s3path }`;
    const v59 = (resolve, reject) => {
        const v57 = (err, stdout, stderr) => {
            if (err) {
                const v50 = reject(err);
                v50;
            } else {
                const v51 = stderr !== '';
                if (v51) {
                    const v52 = new Error(stderr);
                    const v53 = reject(v52);
                    v53;
                } else {
                    const v54 = -1;
                    const v55 = stdout.slice(0, v54);
                    const v56 = resolve(v55);
                    v56;
                }
            }
        };
        const v58 = exec(s3command, v57);
        v58;
    };
    const v60 = new Promise(v59);
    return v60;
};
const v82 = (config, options = {}) => {
    const app = express();
    const v76 = async (req, res) => {
        const v61 = req.params;
        const root = v61.root;
        const path = v61[0];
        const v62 = req.query;
        const token = v62.token;
        const v63 = root && path;
        const v64 = v63 && token;
        const v65 = v64 && await authenticateUser(token, root);
        if (v65) {
            try {
                const v66 = new Date();
                const v67 = `[${ v66 }][access]`;
                const v68 = console.log(v67, root, path);
                v68;
                const v69 = sanitizePath(path);
                const v70 = res.redirect(await presignPath(config, root, v69));
                v70;
            } catch (err) {
                const v71 = new Date();
                const v72 = `[${ v71 }][ERROR]`;
                const v73 = console.error(v72, err);
                v73;
                const v74 = res.sendStatus(500);
                v74;
            }
        } else {
            const v75 = res.sendStatus(404);
            v75;
        }
    };
    const v77 = app.get('/:root/*', v76);
    v77;
    const v79 = (req, res) => {
        const v78 = res.sendStatus(404);
        v78;
    };
    const v80 = app.get('*', v79);
    v80;
    const v81 = app.listen(options);
    v81;
};
module.exports = v82;