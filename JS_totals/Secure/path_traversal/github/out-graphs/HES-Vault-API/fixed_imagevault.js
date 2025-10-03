const path = require('path');
const v55 = require('fs');
const fs = v55.promises;
const fsSync = require('fs');
const ImageCleanupService = function ImageCleanupService() {
};
const deleteImage = async function deleteImage(imagePath) {
    const v56 = !imagePath;
    if (v56) {
        const v57 = console.log('No image path provided for deletion');
        v57;
        return false;
    }
    try {
        const v58 = process.cwd();
        const v59 = path.join(v58, 'public', 'uploads');
        const BASE = fsSync.realpathSync(v59);
        const raw = String(imagePath);
        const decoded = decodeURIComponent(raw);
        const unified = decoded.replace(/\\/g, '/');
        const m = unified.match(/^\/?uploads\/(.+)$/i);
        const v60 = !m;
        if (v60) {
            const v61 = `Invalid image path for deletion: ${ imagePath }`;
            const v62 = console.log(v61);
            v62;
            return false;
        }
        const relPart = m[1];
        const v63 = relPart.split('/');
        const segs = v63.filter(Boolean);
        const v64 = segs.length;
        const v65 = v64 === 0;
        const v69 = s => {
            const v66 = s === '.';
            const v67 = s === '..';
            const v68 = v66 || v67;
            return v68;
        };
        const v70 = segs.some(v69);
        const v71 = v65 || v70;
        if (v71) {
            const v72 = `Invalid image path segments: ${ imagePath }`;
            const v73 = console.log(v72);
            v73;
            return false;
        }
        const candidate = path.resolve(BASE, relPart);
        const v74 = path.dirname(candidate);
        const parentReal = fsSync.realpathSync(v74);
        const relCheck = path.relative(BASE, parentReal);
        const v75 = relCheck.startsWith('..');
        const v76 = path.isAbsolute(relCheck);
        const v77 = v75 || v76;
        if (v77) {
            const v78 = `Path escapes upload root: ${ imagePath }`;
            const v79 = console.log(v78);
            v79;
            return false;
        }
        const v80 = `Attempting to delete image: ${ candidate }`;
        const v81 = console.log(v80);
        v81;
        const v82 = fsSync.existsSync(candidate);
        const v83 = !v82;
        if (v83) {
            const v84 = `Image not found for deletion: ${ candidate }`;
            const v85 = console.log(v84);
            v85;
            return false;
        }
        await fs.unlink(candidate);
        const v86 = `✓ Successfully deleted image: ${ imagePath }`;
        const v87 = console.log(v86);
        v87;
        const v88 = path.basename(candidate);
        const thumbnailFilename = `thumb_${ v88 }`;
        const v89 = path.dirname(candidate);
        const thumbnailFullPath = path.join(v89, thumbnailFilename);
        const v90 = fsSync.existsSync(thumbnailFullPath);
        if (v90) {
            await fs.unlink(thumbnailFullPath);
            const v91 = `✓ Successfully deleted thumbnail: ${ thumbnailFilename }`;
            const v92 = console.log(v91);
            v92;
        }
        return true;
    } catch (error) {
        const v93 = `Error deleting image ${ imagePath }:`;
        const v94 = console.error(v93, error);
        v94;
        return false;
    }
};
ImageCleanupService.deleteImage = deleteImage;
const deleteMultipleImages = async function deleteMultipleImages(imagePaths) {
    const v95 = Array.isArray(imagePaths);
    const v96 = !v95;
    const v97 = imagePaths.length;
    const v98 = v97 === 0;
    const v99 = v96 || v98;
    if (v99) {
        const v100 = [];
        const v101 = [];
        const v102 = {};
        v102.deleted = v100;
        v102.failed = v101;
        return v102;
    }
    const v103 = [];
    const v104 = [];
    const results = {};
    results.deleted = v103;
    results.failed = v104;
    let p;
    for (p of imagePaths) {
        const ok = await this.deleteImage(p);
        const v105 = results.deleted;
        const v106 = results.failed;
        let v107;
        if (ok) {
            v107 = v105;
        } else {
            v107 = v106;
        }
        const v108 = v107.push(p);
        v108;
    }
    return results;
};
ImageCleanupService.deleteMultipleImages = deleteMultipleImages;
ImageCleanupService['is_class'] = true;
module.exports = ImageCleanupService;