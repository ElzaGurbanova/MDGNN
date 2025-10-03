import express from 'express';
import mime from 'mime-types';
import path from 'path';
import fs from 'fs/promises';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
const router = express.Router();
const v69 = async (req, res) => {
    const v36 = req.params;
    const filename = v36.filename;
    const v37 = /^[a-zA-Z0-9_\-.]+$/.test(filename);
    const v38 = !v37;
    if (v38) {
        const v39 = res.status(400);
        const v40 = { error: 'Invalid filename' };
        const v41 = v39.json(v40);
        return v41;
    }
    const baseDir = path.resolve('uploads');
    const targetPath = path.resolve(baseDir, filename);
    try {
        await fs.access(targetPath);
        const lst = await fs.lstat(targetPath);
        const v42 = lst.isSymbolicLink();
        if (v42) {
            const v43 = res.status(400);
            const v44 = { error: 'Invalid file (symlink not allowed)' };
            const v45 = v43.json(v44);
            return v45;
        }
        const v46 = fs.realpath(baseDir);
        const v47 = () => {
            return baseDir;
        };
        const realBase = await v46.catch(v47);
        const realTarget = await fs.realpath(targetPath);
        const rel = path.relative(realBase, realTarget);
        const v48 = rel.startsWith('..');
        const v49 = path.isAbsolute(rel);
        const v50 = v48 || v49;
        if (v50) {
            const v51 = res.status(400);
            const v52 = { error: 'Invalid file path' };
            const v53 = v51.json(v52);
            return v53;
        }
        const v54 = path.extname(filename);
        const ext = v54.toLowerCase();
        const v55 = mime.lookup(ext);
        const mimeType = v55 || 'application/octet-stream';
        const v56 = [
            '.jpg',
            '.jpeg',
            '.png',
            '.pdf'
        ];
        const v57 = v56.includes(ext);
        if (v57) {
            const v58 = `inline; filename="${ filename }"`;
            const v59 = res.setHeader('Content-Disposition', v58);
            v59;
        } else {
            const v60 = `attachment; filename="${ filename }"`;
            const v61 = res.setHeader('Content-Disposition', v60);
            v61;
        }
        const v62 = res.setHeader('Content-Type', mimeType);
        v62;
        const v63 = res.setHeader('X-Content-Type-Options', 'nosniff');
        v63;
        const v64 = res.sendFile(realTarget);
        v64;
    } catch (err) {
        const v65 = console.error('[File Download] Error:', err);
        v65;
        const v66 = res.status(404);
        const v67 = { error: 'File not found or access denied.' };
        const v68 = v66.json(v67);
        v68;
    }
};
const v70 = router.get('/download/:filename', requireAuth, requireAdmin, v69);
v70;
export default router;