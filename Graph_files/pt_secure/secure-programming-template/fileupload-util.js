const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const ALLOWED_FILE_TYPES = {};
ALLOWED_FILE_TYPES['image/jpeg'] = '.jpg';
ALLOWED_FILE_TYPES['image/png'] = '.png';
ALLOWED_FILE_TYPES['application/pdf'] = '.pdf';
const v25 = 5 * 1024;
const MAX_FILE_SIZE = v25 * 1024;
const v27 = (req, file, cb) => {
    const v26 = cb(null, 'uploads/');
    v26;
};
const v32 = (req, file, cb) => {
    const v28 = crypto.randomBytes(16);
    const randomName = v28.toString('hex');
    const v29 = file.mimetype;
    const extension = ALLOWED_FILE_TYPES[v29];
    const v30 = `${ randomName }${ extension }`;
    const v31 = cb(null, v30);
    v31;
};
const v33 = {
    destination: v27,
    filename: v32
};
const storage = multer.diskStorage(v33);
const fileFilter = (req, file, cb) => {
    const v34 = file.mimetype;
    const v35 = ALLOWED_FILE_TYPES[v34];
    const v36 = !v35;
    if (v36) {
        const v37 = new Error('Invalid file type');
        const v38 = cb(v37, false);
        return v38;
    }
    const v39 = file.size;
    const v40 = v39 > MAX_FILE_SIZE;
    if (v40) {
        const v41 = new Error('File size too large');
        const v42 = cb(v41, false);
        return v42;
    }
    const v43 = cb(null, true);
    v43;
};
const v44 = {};
v44.fileSize = MAX_FILE_SIZE;
const v45 = {
    storage: storage,
    fileFilter: fileFilter,
    limits: v44
};
const upload = multer(v45);
const sanitizeFilename = filename => {
    const v46 = path.basename(filename);
    const v47 = v46.replace(/[^a-zA-Z0-9.-]/g, '_');
    return v47;
};
const v48 = {};
v48.upload = upload;
v48.sanitizeFilename = sanitizeFilename;
module.exports = v48;