const crypto = require('crypto');
const util = require('util');
const v23 = require('child_process');
const v24 = v23.exec;
const exec = util.promisify(v24);
const escape = require('shell-escape');
const v35 = function (password, password_salt, password_iterations, algorithm) {
    switch (algorithm) {
    case 'PKCS5S2':
        const v25 = crypto.pbkdf2Sync(password, password_salt, password_iterations, 64, 'id-rsassa-pkcs1-v1_5-with-sha3-256');
        const v26 = v25.toString('base64');
        return v26;
    case 'SHA512':
        const v27 = `sha512`;
        const v28 = crypto.pbkdf2Sync(password, password_salt, password_iterations, 64, v27);
        const v29 = `base64`;
        const v30 = v28.toString(v29);
        return v30;
    case 'MD5':
        const v31 = `md5`;
        const v32 = crypto.pbkdf2Sync(password, password_salt, password_iterations, 64, v31);
        const v33 = `base64`;
        const v34 = v32.toString(v33);
        return v34;
    default:
        return null;
    }
};
const v40 = function (length) {
    if (length) {
        const v36 = crypto.randomBytes(length);
        const v37 = v36.toString('base64');
        return v37;
    } else {
        const v38 = crypto.randomBytes(16);
        const v39 = v38.toString('base64');
        return v39;
    }
};
const v43 = async function (password, password_salt, password_iterations, algorithm) {
    try {
        const v41 = [
            'java',
            '-jar',
            './src/helpers/hivemq-ese-helper.jar',
            'hash',
            'create',
            '-a',
            algorithm,
            '-i',
            password_iterations,
            '-p',
            password,
            '-s',
            password_salt
        ];
        const args = escape(v41);
        const v42 = await exec(args);
        const stdout = v42.stdout;
        const stderr = v42.stderr;
        if (stdout) {
            return stdout;
        } else {
            return stderr;
        }
    } catch (e) {
        return e;
    }
};
const v44 = {};
v44.encryptPassword = v35;
v44.generateSaltBase64 = v40;
v44.generateHash = v43;
module.exports = v44;