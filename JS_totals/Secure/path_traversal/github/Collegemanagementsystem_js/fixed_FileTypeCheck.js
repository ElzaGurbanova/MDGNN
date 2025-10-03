import fs from 'fs';
import path from 'path';
import { fileTypeFromStream } from 'file-type';
import { environmentVariables } from '../constant.js';
import { ApiResponse } from './ApiResponse.js';
import { safeUnlinkSync } from './fileUtils.js';

export async function fileTypeCheck(req, res) {
  try {
    const BASE_UPLOAD_DIR = path.resolve(__dirname, '../public/temp');
    const target = path.resolve(String(req.file.path || ''));

    // 1) Boundary-safe containment check (no string prefix)
    const rel = path.relative(BASE_UPLOAD_DIR, target);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      safeUnlinkSync(req.file.path);
      return res.status(400).json(new ApiResponse(400, 'Invalid file path.'));
    }

    // 2) Symlink-hardening: ensure the *real* target is still under the base
    const realBase = fs.realpathSync(BASE_UPLOAD_DIR);
    const realTarget = fs.realpathSync(target); // resolves symlinks
    const relReal = path.relative(realBase, realTarget);
    if (relReal.startsWith('..') || path.isAbsolute(relReal)) {
      safeUnlinkSync(req.file.path);
      return res.status(400).json(new ApiResponse(400, 'Invalid file path.'));
    }

    // 3) Detect type from stream and validate
    const stream = fs.createReadStream(realTarget);
    const detectedType = await fileTypeFromStream(stream).finally(() => stream.destroy());

    if (
      !detectedType ||
      !environmentVariables.allowedTypesFileTypes.includes(detectedType.mime)
    ) {
      safeUnlinkSync(realTarget);
      return res.status(415).json(new ApiResponse(415, 'Invalid file content. File must be an image.'));
    }

    // OK — caller can proceed
    return true;
  } catch (error) {
    console.error('Error during file type check:', error);
    // Best-effort cleanup
    try { if (req?.file?.path) safeUnlinkSync(req.file.path); } catch {}
    return res.status(500).json(new ApiResponse(500, 'Error processing file.'));
  }
}

