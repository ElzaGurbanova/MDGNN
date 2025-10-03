const fs = require('fs');
const path = require('path');
const os = require('os');
const defaultBackupBaseDir = function () {
    const base = '/var/lib/brainstorm/backups';
    try {
        const v51 = fs.existsSync(base);
        const v52 = !v51;
        if (v52) {
            const v53 = { recursive: true };
            const v54 = fs.mkdirSync(base, v53);
            v54;
        }
        return base;
    } catch (e) {
        const v55 = os.homedir();
        const homeBase = path.join(v55, 'brainstorm-backups');
        const v56 = fs.existsSync(homeBase);
        const v57 = !v56;
        if (v57) {
            const v58 = { recursive: true };
            const v59 = fs.mkdirSync(homeBase, v58);
            v59;
        }
        return homeBase;
    }
};
const handleDownloadBackup = async function (req, res) {
    try {
        const v61 = req.query;
        const v62 = {};
        const v60 = v61 || v62;
        const file = v60.file;
        const v63 = !file;
        if (v63) {
            const v64 = res.status(400);
            const v65 = {
                success: false,
                error: 'Missing file parameter'
            };
            const v66 = v64.json(v65);
            return v66;
        }
        const v67 = String(file);
        const safeName = path.basename(v67);
        const v68 = safeName.toLowerCase();
        const v69 = v68.endsWith('.zip');
        const v70 = !v69;
        if (v70) {
            const v71 = res.status(400);
            const v72 = {
                success: false,
                error: 'Only .zip files are downloadable'
            };
            const v73 = v71.json(v72);
            return v73;
        }
        const dir = defaultBackupBaseDir();
        const base = path.resolve(dir);
        const target = path.resolve(base, safeName);
        const v74 = fs.existsSync(target);
        const v75 = !v74;
        if (v75) {
            const v76 = res.status(404);
            const v77 = {
                success: false,
                error: 'File not found'
            };
            const v78 = v76.json(v77);
            return v78;
        }
        const lst = fs.lstatSync(target);
        const v79 = lst.isSymbolicLink();
        if (v79) {
            const v80 = res.status(400);
            const v81 = {
                success: false,
                error: 'Invalid file (symlink not allowed)'
            };
            const v82 = v80.json(v81);
            return v82;
        }
        const realBase = fs.realpathSync(base);
        const realTarget = fs.realpathSync(target);
        const rel = path.relative(realBase, realTarget);
        const v83 = rel.startsWith('..');
        const v84 = path.isAbsolute(rel);
        const v85 = v83 || v84;
        if (v85) {
            const v86 = res.status(400);
            const v87 = {
                success: false,
                error: 'Invalid file path'
            };
            const v88 = v86.json(v87);
            return v88;
        }
        const v89 = fs.statSync(realTarget);
        const v90 = v89.isFile();
        const v91 = !v90;
        if (v91) {
            const v92 = res.status(404);
            const v93 = {
                success: false,
                error: 'File not found'
            };
            const v94 = v92.json(v93);
            return v94;
        }
        const v95 = res.download(realTarget, safeName);
        return v95;
    } catch (error) {
        const v96 = console.error('Error downloading backup:', error);
        v96;
        const v97 = res.status(500);
        const v98 = {
            success: false,
            error: 'Failed to download backup'
        };
        const v99 = v97.json(v98);
        return v99;
    }
};
const v100 = {};
v100.handleDownloadBackup = handleDownloadBackup;
module.exports = v100;