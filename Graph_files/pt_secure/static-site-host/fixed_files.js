const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const v87 = require('fs');
const fs = v87.promises;
const fsSync = require('fs');
const v88 = process.env;
const v89 = v88.SITE_FILES_DIR;
const siteFilesDir = v89 || './site_files';
const v90 = path.resolve(siteFilesDir);
const SITE_ROOT = fsSync.realpathSync(v90);
const v91 = { recursive: true };
const v92 = fsSync.mkdirSync(SITE_ROOT, v91);
v92;
const sanitizeName = function (name) {
    const v93 = name || 'file';
    const base = path.basename(v93);
    const v94 = base.replace(/[^a-zA-Z0-9._-]/g, '_');
    const v95 = v94.slice(0, 200);
    return v95;
};
const allowedTypes = [
    '.html',
    '.css',
    '.js',
    '.json',
    '.txt',
    '.md',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.svg',
    '.webp',
    '.pdf',
    '.ico',
    '.xml',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot'
];
const v97 = (req, file, cb) => {
    const v96 = cb(null, SITE_ROOT);
    return v96;
};
const v101 = (req, file, cb) => {
    const v98 = file.originalname;
    const v99 = sanitizeName(v98);
    const v100 = cb(null, v99);
    return v100;
};
const v102 = {
    destination: v97,
    filename: v101
};
const storage = multer.diskStorage(v102);
const fileFilter = (req, file, cb) => {
    const v103 = file.originalname;
    const v104 = sanitizeName(v103);
    const v105 = path.extname(v104);
    const ext = v105.toLowerCase();
    const v106 = allowedTypes.includes(ext);
    if (v106) {
        const v107 = cb(null, true);
        v107;
    } else {
        const v108 = new Error(`File type not allowed: ${ ext }`);
        const v109 = cb(v108);
        v109;
    }
};
const v110 = 10 * 1024;
const v111 = v110 * 1024;
const v112 = {};
v112.fileSize = v111;
const v113 = {
    storage,
    fileFilter,
    limits: v112
};
const upload = multer(v113);
const v121 = async (req, res, next) => {
    try {
        const files = await fs.readdir(SITE_ROOT);
        const v117 = async filename => {
            const filePath = path.join(SITE_ROOT, filename);
            const stats = await fs.stat(filePath);
            const v114 = stats.size;
            const v115 = stats.mtime;
            const v116 = {};
            v116.name = filename;
            v116.size = v114;
            v116.modified = v115;
            v116.url = `/site/${ filename }`;
            return v116;
        };
        const v118 = files.map(v117);
        const fileDetails = await Promise.all(v118);
        const v119 = res.json(fileDetails);
        v119;
    } catch (err) {
        const v120 = next(err);
        v120;
    }
};
const v122 = router.get('/', v121);
v122;
const v123 = upload.array('files');
const v145 = async (req, res, next) => {
    try {
        const v124 = req.files;
        const v125 = !v124;
        const v126 = req.files;
        const v127 = v126.length;
        const v128 = v127 === 0;
        const v129 = v125 || v128;
        if (v129) {
            const v130 = res.status(400);
            const v131 = { error: 'No files uploaded' };
            const v132 = v130.json(v131);
            return v132;
        }
        const v133 = req.files;
        const v138 = file => {
            const v134 = file.filename;
            const v135 = file.size;
            const v136 = file.filename;
            const v137 = {};
            v137.name = v134;
            v137.size = v135;
            v137.url = `/site/${ v136 }`;
            return v137;
        };
        const uploadedFiles = v133.map(v138);
        const v139 = res.status(201);
        const v140 = req.files;
        const v141 = v140.length;
        const v142 = {
            message: `Successfully uploaded ${ v141 } file(s)`,
            files: uploadedFiles
        };
        const v143 = v139.json(v142);
        v143;
    } catch (err) {
        const v144 = next(err);
        v144;
    }
};
const v146 = router.post('/upload', v123, v145);
v146;
const v157 = async (req, res, next) => {
    try {
        const v147 = req.params;
        const v148 = v147.filename;
        const sanitizedFilename = sanitizeName(v148);
        const filePath = path.join(SITE_ROOT, sanitizedFilename);
        await fs.access(filePath);
        await fs.unlink(filePath);
        const v149 = { message: `Successfully deleted ${ sanitizedFilename }` };
        const v150 = res.json(v149);
        v150;
    } catch (err) {
        const v151 = err.code;
        const v152 = v151 === 'ENOENT';
        if (v152) {
            const v153 = res.status(404);
            const v154 = { error: 'File not found' };
            const v155 = v153.json(v154);
            return v155;
        }
        const v156 = next(err);
        v156;
    }
};
const v158 = router.delete('/:filename', v157);
v158;
const v171 = async (req, res, next) => {
    try {
        const v159 = req.params;
        const v160 = v159.filename;
        const sanitizedFilename = sanitizeName(v160);
        const filePath = path.join(SITE_ROOT, sanitizedFilename);
        const stats = await fs.stat(filePath);
        const v161 = stats.size;
        const v162 = stats.mtime;
        const v163 = {
            name: sanitizedFilename,
            size: v161,
            modified: v162,
            url: `/site/${ sanitizedFilename }`
        };
        const v164 = res.json(v163);
        v164;
    } catch (err) {
        const v165 = err.code;
        const v166 = v165 === 'ENOENT';
        if (v166) {
            const v167 = res.status(404);
            const v168 = { error: 'File not found' };
            const v169 = v167.json(v168);
            return v169;
        }
        const v170 = next(err);
        v170;
    }
};
const v172 = router.get('/:filename', v171);
v172;
module.exports = router;