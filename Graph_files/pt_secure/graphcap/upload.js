const path = require('path');
const multer = require('multer');
const v46 = require('../utils/logger');
const logError = v46.logError;
const v47 = require('../config');
const uploadDir = v47.uploadDir;
const FILE_SIZE_LIMIT = v47.FILE_SIZE_LIMIT;
const fileFilter = (req, file, cb) => {
    const v48 = file.mimetype;
    const v49 = v48.startsWith('image/');
    if (v49) {
        const v50 = cb(null, true);
        v50;
    } else {
        const v51 = new Error('Only image files are allowed');
        const v52 = cb(v51, false);
        v52;
    }
};
const v54 = (req, file, cb) => {
    const v53 = cb(null, uploadDir);
    v53;
};
const v60 = (req, file, cb) => {
    const v55 = file.originalname;
    const v56 = path.basename(v55);
    const sanitizedFilename = v56.replace(/[^a-zA-Z0-9.-]/g, '_');
    const v57 = Date.now();
    const v58 = `${ v57 }-${ sanitizedFilename }`;
    const v59 = cb(null, v58);
    v59;
};
const v61 = {
    destination: v54,
    filename: v60
};
const storage = multer.diskStorage(v61);
const v62 = {};
v62.fileSize = FILE_SIZE_LIMIT;
v62.files = 5;
const v63 = {
    storage,
    limits: v62,
    fileFilter
};
const upload = multer(v63);
const handleMulterErrors = function (err, req, res, next) {
    const v64 = multer.MulterError;
    const v65 = err instanceof v64;
    if (v65) {
        const v66 = err.code;
        const v67 = v66 === 'LIMIT_FILE_SIZE';
        if (v67) {
            const v68 = logError('File too large', err);
            v68;
            const v69 = res.status(413);
            const v70 = 1024 * 1024;
            const v71 = FILE_SIZE_LIMIT / v70;
            const v72 = { error: `File too large. Maximum size is ${ v71 }MB` };
            const v73 = v69.json(v72);
            return v73;
        } else {
            const v74 = err.code;
            const v75 = v74 === 'LIMIT_FILE_COUNT';
            if (v75) {
                const v76 = logError('Too many files', err);
                v76;
                const v77 = res.status(413);
                const v78 = { error: 'Too many files. Maximum is 5 files per upload' };
                const v79 = v77.json(v78);
                return v79;
            } else {
                const v80 = logError('Multer error', err);
                v80;
                const v81 = res.status(400);
                const v82 = err.message;
                const v83 = { error: v82 };
                const v84 = v81.json(v83);
                return v84;
            }
        }
    } else {
        if (err) {
            const v85 = logError('Upload error', err);
            v85;
            const v86 = res.status(500);
            const v87 = { error: 'File upload failed' };
            const v88 = v86.json(v87);
            return v88;
        }
    }
    const v89 = next();
    v89;
};
const v90 = {};
v90.upload = upload;
v90.handleMulterErrors = handleMulterErrors;
module.exports = v90;