const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads/cvs');
const v30 = fs.existsSync(uploadDir);
const v31 = !v30;
if (v31) {
    const v32 = { recursive: true };
    const v33 = fs.mkdirSync(uploadDir, v32);
    v33;
}
const v35 = function (req, file, cb) {
    const v34 = cb(null, uploadDir);
    v34;
};
const v44 = function (req, file, cb) {
    const v36 = Date.now();
    const v37 = v36 + '-';
    const v38 = Math.random();
    const v39 = v38 * 1000000000;
    const v40 = Math.round(v39);
    const uniqueSuffix = v37 + v40;
    const v41 = file.originalname;
    const sanitizedName = v41.replace(/[^a-zA-Z0-9.-]/g, '_');
    const v42 = uniqueSuffix + '-';
    const filename = v42 + sanitizedName;
    const v43 = cb(null, filename);
    v43;
};
const v45 = {
    destination: v35,
    filename: v44
};
const storage = multer.diskStorage(v45);
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];
    const allowedExtensions = [
        '.pdf',
        '.doc',
        '.docx',
        '.txt'
    ];
    const v46 = file.originalname;
    const v47 = path.extname(v46);
    const fileExtension = v47.toLowerCase();
    const v48 = file.mimetype;
    const v49 = allowedMimeTypes.includes(v48);
    const v50 = allowedExtensions.includes(fileExtension);
    const v51 = v49 && v50;
    if (v51) {
        const v52 = cb(null, true);
        v52;
    } else {
        const v53 = new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed for CV uploads.');
        const v54 = cb(v53, false);
        v54;
    }
};
const v55 = 5 * 1024;
const v56 = v55 * 1024;
const v57 = {};
v57.fileSize = v56;
v57.files = 1;
const v58 = {
    storage: storage,
    fileFilter: fileFilter,
    limits: v57
};
const upload = multer(v58);
module.exports = upload;