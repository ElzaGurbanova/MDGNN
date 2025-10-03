const path = require('path');
const v118 = require('fs');
const fs = v118.promises;
const safePathJoin = function (basePath, userPath) {
    const normalizedBase = path.resolve(basePath);
    const joinedPath = path.join(normalizedBase, userPath);
    const resolvedPath = path.resolve(joinedPath);
    const v119 = path.sep;
    const v120 = normalizedBase + v119;
    const v121 = resolvedPath.startsWith(v120);
    const v122 = !v121;
    const v123 = resolvedPath !== normalizedBase;
    const v124 = v122 && v123;
    if (v124) {
        const v125 = new Error('Path traversal attempt detected');
        throw v125;
    }
    return resolvedPath;
};
const isPathSafe = function (filePath) {
    const dangerousPatterns = [
        /\.\.[\/\\]/,
        /^[A-Za-z]:/,
        /[\x00-\x1f]/
    ];
    const v127 = pattern => {
        const v126 = pattern.test(filePath);
        return v126;
    };
    const v128 = dangerousPatterns.some(v127);
    const v129 = !v128;
    return v129;
};
const v130 = [
    '.jpg',
    '.jpeg'
];
const v131 = [
    255,
    216,
    255
];
const v132 = {
    offset: 0,
    bytes: v131
};
const v133 = [v132];
const v134 = {};
v134.extensions = v130;
v134.magicNumbers = v133;
const v135 = ['.png'];
const v136 = [
    137,
    80,
    78,
    71,
    13,
    10,
    26,
    10
];
const v137 = {
    offset: 0,
    bytes: v136
};
const v138 = [v137];
const v139 = {};
v139.extensions = v135;
v139.magicNumbers = v138;
const v140 = ['.webp'];
const v141 = [
    82,
    73,
    70,
    70
];
const v142 = {
    offset: 0,
    bytes: v141
};
const v143 = [
    87,
    69,
    66,
    80
];
const v144 = {
    offset: 8,
    bytes: v143
};
const v145 = [
    v142,
    v144
];
const v146 = {};
v146.extensions = v140;
v146.magicNumbers = v145;
const v147 = ['.gif'];
const v148 = [
    71,
    73,
    70,
    56,
    55,
    97
];
const v149 = {
    offset: 0,
    bytes: v148
};
const v150 = [
    71,
    73,
    70,
    56,
    57,
    97
];
const v151 = {
    offset: 0,
    bytes: v150
};
const v152 = [
    v149,
    v151
];
const v153 = {};
v153.extensions = v147;
v153.magicNumbers = v152;
const v154 = ['.svg'];
const v155 = {};
v155.extensions = v154;
v155.magicNumbers = null;
const ALLOWED_IMAGE_TYPES = {};
ALLOWED_IMAGE_TYPES['image/jpeg'] = v134;
ALLOWED_IMAGE_TYPES['image/png'] = v139;
ALLOWED_IMAGE_TYPES['image/webp'] = v146;
ALLOWED_IMAGE_TYPES['image/gif'] = v153;
ALLOWED_IMAGE_TYPES['image/svg+xml'] = v155;
const validateFileType = function (filename, mimetype, allowedTypes) {
    const v156 = allowedTypes.includes(mimetype);
    const v157 = !v156;
    if (v157) {
        return false;
    }
    const v158 = path.extname(filename);
    const ext = v158.toLowerCase();
    const typeConfig = ALLOWED_IMAGE_TYPES[mimetype];
    const v159 = !typeConfig;
    const v160 = typeConfig.extensions;
    const v161 = v160.includes(ext);
    const v162 = !v161;
    const v163 = v159 || v162;
    if (v163) {
        return false;
    }
    return true;
};
const validateFileContent = async function (filePath, expectedMimeType) {
    try {
        const typeConfig = ALLOWED_IMAGE_TYPES[expectedMimeType];
        const v164 = !typeConfig;
        if (v164) {
            return false;
        }
        const v165 = typeConfig.magicNumbers;
        const v166 = !v165;
        if (v166) {
            return true;
        }
        const buffer = Buffer.alloc(20);
        const fileHandle = await fs.open(filePath, 'r');
        await fileHandle.read(buffer, 0, 20, 0);
        await fileHandle.close();
        const v167 = typeConfig.magicNumbers;
        const v178 = magic => {
            let i = 0;
            const v168 = magic.bytes;
            const v169 = v168.length;
            let v170 = i < v169;
            while (v170) {
                const v172 = magic.offset;
                const v173 = v172 + i;
                const v174 = buffer[v173];
                const v175 = magic.bytes;
                const v176 = v175[i];
                const v177 = v174 !== v176;
                if (v177) {
                    return false;
                }
                const v171 = i++;
                v170 = i < v169;
            }
            return true;
        };
        const v179 = v167.every(v178);
        return v179;
    } catch (error) {
        const v180 = console.error('Error validating file content:', error);
        v180;
        return false;
    }
};
const getSafeFilename = function (originalFilename) {
    const timestamp = Date.now();
    const v181 = Math.random();
    const v182 = v181.toString(36);
    const randomString = v182.substring(2, 15);
    const v183 = path.extname(originalFilename);
    const ext = v183.toLowerCase();
    const validExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp',
        '.gif',
        '.svg',
        '.ico'
    ];
    const v184 = validExtensions.includes(ext);
    const v185 = !v184;
    if (v185) {
        const v186 = new Error('Invalid file extension');
        throw v186;
    }
    const v187 = `upload_${ timestamp }_${ randomString }${ ext }`;
    return v187;
};
const createFileUploadValidator = function (options = {}) {
    const v188 = options;
    const v189 = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];
    const allowedTypes = v188.undefined;
    const v190 = 50 * 1024;
    const v191 = v190 * 1024;
    const maxFileSize = v188.undefined;
    const validateContent = v188.undefined;
    const v233 = async (req, res, next) => {
        try {
            const v192 = req.files;
            const v193 = !v192;
            const v194 = req.files;
            const v195 = v194.length;
            const v196 = v195 === 0;
            const v197 = v193 || v196;
            if (v197) {
                const v198 = next();
                return v198;
            }
            let file;
            const v199 = req.files;
            for (file of v199) {
                const v200 = file.originalname;
                const v201 = file.mimetype;
                const v202 = validateFileType(v200, v201, allowedTypes);
                const v203 = !v202;
                if (v203) {
                    const v204 = res.status(400);
                    const v205 = file.originalname;
                    const v206 = allowedTypes.join(', ');
                    const v207 = { error: `Invalid file type: ${ v205 }. Allowed types: ${ v206 }` };
                    const v208 = v204.json(v207);
                    return v208;
                }
                const v209 = file.size;
                const v210 = v209 > maxFileSize;
                if (v210) {
                    const v211 = res.status(400);
                    const v212 = file.originalname;
                    const v213 = maxFileSize / 1024;
                    const v214 = v213 / 1024;
                    const v215 = { error: `File too large: ${ v212 }. Maximum size: ${ v214 }MB` };
                    const v216 = v211.json(v215);
                    return v216;
                }
                const v217 = file.path;
                const v218 = validateContent && v217;
                if (v218) {
                    const v219 = file.path;
                    const v220 = file.mimetype;
                    const isValidContent = await validateFileContent(v219, v220);
                    const v221 = !isValidContent;
                    if (v221) {
                        try {
                            const v222 = file.path;
                            await fs.unlink(v222);
                        } catch (err) {
                            const v223 = console.error('Error removing invalid file:', err);
                            v223;
                        }
                        const v224 = res.status(400);
                        const v225 = file.originalname;
                        const v226 = { error: `File content does not match declared type: ${ v225 }` };
                        const v227 = v224.json(v226);
                        return v227;
                    }
                }
            }
            const v228 = next();
            v228;
        } catch (error) {
            const v229 = console.error('File validation error:', error);
            v229;
            const v230 = res.status(500);
            const v231 = { error: 'File validation failed' };
            const v232 = v230.json(v231);
            v232;
        }
    };
    return v233;
};
const v234 = {};
v234.safePathJoin = safePathJoin;
v234.isPathSafe = isPathSafe;
v234.validateFileType = validateFileType;
v234.validateFileContent = validateFileContent;
v234.getSafeFilename = getSafeFilename;
v234.createFileUploadValidator = createFileUploadValidator;
v234.ALLOWED_IMAGE_TYPES = ALLOWED_IMAGE_TYPES;
module.exports = v234;