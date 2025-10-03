const _ = require('lodash');
const express = require('express');
const v38 = require('child_process');
const exec = v38.exec;
const v39 = require('./authentication.js');
const readAuthFile = v39.readAuthFile;
const authenticateUser = async function (token, rootDirectory) {
    const auth = await readAuthFile();
    const v40 = _.get(auth, token, null);
    const v41 = v40 === rootDirectory;
    return v41;
};
const presignPath = function (config, userDir, path) {
    const v42 = config.rootPath;
    const s3path = `s3://${ v42 }/${ userDir }/${ path }`;
    const s3command = `aws s3 presign --expires-in 604800 ${ s3path }`;
    const v52 = (resolve, reject) => {
        const v50 = (err, stdout, stderr) => {
            if (err) {
                const v43 = reject(err);
                v43;
            } else {
                const v44 = stderr !== '';
                if (v44) {
                    const v45 = new Error(stderr);
                    const v46 = reject(v45);
                    v46;
                } else {
                    const v47 = -1;
                    const v48 = stdout.slice(0, v47);
                    const v49 = resolve(v48);
                    v49;
                }
            }
        };
        const v51 = exec(s3command, v50);
        v51;
    };
    const v53 = new Promise(v52);
    return v53;
};
const v74 = (config, options = {}) => {
    const app = express();
    const v68 = async (req, res) => {
        const v54 = req.params;
        const root = v54.root;
        const path = v54[0];
        const v55 = req.query;
        const token = v55.token;
        const v56 = root && path;
        const v57 = v56 && token;
        const v58 = v57 && await authenticateUser(token, root);
        if (v58) {
            try {
                const v59 = new Date();
                const v60 = `[${ v59 }][access]`;
                const v61 = console.log(v60, root, path);
                v61;
                const v62 = res.redirect(await presignPath(config, root, path));
                v62;
            } catch (err) {
                const v63 = new Date();
                const v64 = `[${ v63 }][ERROR]`;
                const v65 = console.error(v64, err);
                v65;
                const v66 = res.sendStatus(500);
                v66;
            }
        } else {
            const v67 = res.sendStatus(404);
            v67;
        }
    };
    const v69 = app.get('/:root/*', v68);
    v69;
    const v71 = (req, res) => {
        const v70 = res.sendStatus(404);
        v70;
    };
    const v72 = app.get('*', v71);
    v72;
    const v73 = app.listen(options);
    v73;
};
module.exports = v74;