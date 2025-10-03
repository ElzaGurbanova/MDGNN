const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

class ImageCleanupService {
    static async deleteImage(imagePath) {
        if (!imagePath) {
            console.log('No image path provided for deletion');
            return false;
        }

        try {
            // Canonical base: <cwd>/public/uploads
            const BASE = fsSync.realpathSync(path.join(process.cwd(), 'public', 'uploads'));

            // Normalize input (handle encoding & backslashes)
            const raw = String(imagePath);
            const decoded = decodeURIComponent(raw);
            const unified = decoded.replace(/\\/g, '/');

            // Must be /uploads/<something> (or uploads/<something>)
            const m = unified.match(/^\/?uploads\/(.+)$/i);
            if (!m) {
                console.log(`Invalid image path for deletion: ${imagePath}`);
                return false;
            }

            const relPart = m[1];
            // Reject empty / dot segments
            const segs = relPart.split('/').filter(Boolean);
            if (segs.length === 0 || segs.some(s => s === '.' || s === '..')) {
                console.log(`Invalid image path segments: ${imagePath}`);
                return false;
            }

            // Resolve candidate under BASE and enforce containment (handles symlinks)
            const candidate = path.resolve(BASE, relPart);
            const parentReal = fsSync.realpathSync(path.dirname(candidate));
            const relCheck = path.relative(BASE, parentReal);
            if (relCheck.startsWith('..') || path.isAbsolute(relCheck)) {
                console.log(`Path escapes upload root: ${imagePath}`);
                return false;
            }

            console.log(`Attempting to delete image: ${candidate}`);

            if (!fsSync.existsSync(candidate)) {
                console.log(`Image not found for deletion: ${candidate}`);
                return false;
            }

            // Delete the main image (unlinking a symlink removes the link, not the target)
            await fs.unlink(candidate);
            console.log(`✓ Successfully deleted image: ${imagePath}`);

            // Try to delete thumbnail if it exists (thumb_<basename> in same dir)
            const thumbnailFilename = `thumb_${path.basename(candidate)}`;
            const thumbnailFullPath = path.join(path.dirname(candidate), thumbnailFilename);
            if (fsSync.existsSync(thumbnailFullPath)) {
                await fs.unlink(thumbnailFullPath);
                console.log(`✓ Successfully deleted thumbnail: ${thumbnailFilename}`);
            }

            return true;
        } catch (error) {
            console.error(`Error deleting image ${imagePath}:`, error);
            return false;
        }
    }

    static async deleteMultipleImages(imagePaths) {
        if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
            return { deleted: [], failed: [] };
        }

        const results = { deleted: [], failed: [] };
        for (const p of imagePaths) {
            const ok = await this.deleteImage(p);
            (ok ? results.deleted : results.failed).push(p);
        }
        return results;
    }
}

module.exports = ImageCleanupService;

