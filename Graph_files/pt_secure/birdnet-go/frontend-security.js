const path = require('path');
const fs = require('fs');
const safeArrayAccess = function (arr, index) {
    const v26 = arr.at(index);
    return v26;
};
const ensureSafeDirectory = function (dirPath) {
    const resolvedPath = path.resolve(dirPath);
    const v27 = path.resolve(__dirname, '../doc');
    const v28 = path.resolve(__dirname, '../temp');
    const v29 = path.resolve(__dirname, '../screenshots');
    const allowedDirs = [
        v27,
        v28,
        v29
    ];
    const v31 = allowedDir => {
        const v30 = resolvedPath.startsWith(allowedDir);
        return v30;
    };
    const isAllowed = allowedDirs.some(v31);
    const v32 = !isAllowed;
    if (v32) {
        const v33 = new Error('Directory path not in allowed list');
        throw v33;
    }
    try {
        const v35 = allowedDir => {
            const v34 = resolvedPath.startsWith(allowedDir);
            return v34;
        };
        const matchingAllowedDir = allowedDirs.find(v35);
        const relativePath = path.relative(matchingAllowedDir, resolvedPath);
        const safePath = path.join(matchingAllowedDir, relativePath);
        const stats = fs.existsSync(safePath);
        const v36 = !stats;
        if (v36) {
            const v37 = { recursive: true };
            const v38 = fs.mkdirSync(safePath, v37);
            v38;
        }
        return true;
    } catch (error) {
        const v39 = process.stderr;
        const v40 = error.message;
        const v41 = `Failed to create directory: ${ v40 }\n`;
        const v42 = v39.write(v41);
        v42;
        return false;
    }
};
const sanitizeFilename = function (filename) {
    const v43 = !filename;
    if (v43) {
        return 'screenshot.png';
    }
    const v44 = filename.split(/[\\/]/);
    const v45 = v44.pop();
    const basename = v45 || 'screenshot.png';
    const sanitized = basename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const v46 = sanitized.endsWith('.png');
    const v47 = !v46;
    if (v47) {
        const v48 = sanitized + '.png';
        return v48;
    }
    return sanitized;
};
const getSafeOutputPath = function (outputDir, filename) {
    const resolvedDir = path.resolve(__dirname, outputDir);
    const safeFilename = sanitizeFilename(filename);
    const v49 = path.join(resolvedDir, safeFilename);
    return v49;
};
const v50 = {};
v50.safeArrayAccess = safeArrayAccess;
v50.ensureSafeDirectory = ensureSafeDirectory;
v50.sanitizeFilename = sanitizeFilename;
v50.getSafeOutputPath = getSafeOutputPath;
module.exports = v50;