const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads');
const v23 = fs.existsSync(uploadDir);
const v24 = !v23;
if (v24) {
    const v25 = { recursive: true };
    const v26 = fs.mkdirSync(uploadDir, v25);
    v26;
}
const v28 = function (req, file, cb) {
    const v27 = cb(null, uploadDir);
    v27;
};
const v34 = function (req, file, cb) {
    const v29 = file.originalname;
    const v30 = path.basename(v29);
    const safeName = v30.replace(/\s+/g, '_');
    const v31 = Date.now();
    const v32 = `${ v31 }-${ safeName }`;
    const v33 = cb(null, v32);
    v33;
};
const v35 = {
    destination: v28,
    filename: v34
};
const storage = multer.diskStorage(v35);
const fileFilter = (req, file, cb) => {
    const v36 = file.mimetype;
    const v37 = v36.startsWith('image/');
    if (v37) {
        const v38 = cb(null, true);
        v38;
    } else {
        const v39 = new Error('Only image files are allowed!');
        const v40 = cb(v39, false);
        v40;
    }
};
const v41 = 5 * 1024;
const v42 = v41 * 1024;
const v43 = {};
v43.fileSize = v42;
const v44 = {
    storage,
    fileFilter,
    limits: v43
};
const upload = multer(v44);
module.exports = upload;