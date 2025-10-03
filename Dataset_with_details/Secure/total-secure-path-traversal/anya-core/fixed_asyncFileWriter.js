// [AIS-2][BPC-2] Asynchronous File Writer with Progress Tracking
const fs = require('fs/promises');
const path = require('path');

async function secureWrite(filePath, data, options = {}) {
  const finalOptions = {
    encoding: 'utf8',
    mode: 0o644,
    flush: true,
    // optional: set { exclusive: true } to require new file creation via 'wx'
    baseDir: process.cwd(),
    ...options
  };

  // ---- Path containment (prevents traversal / absolute override)
  const baseDir = path.resolve(finalOptions.baseDir);
  const target = path.isAbsolute(filePath)
    ? path.resolve(filePath)
    : path.resolve(baseDir, filePath);

  const rel = path.relative(baseDir, target);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error('Invalid file path');
  }

  // Ensure parent directory exists
  const dir = path.dirname(target);
  await fs.mkdir(dir, { recursive: true });

  // Symlink hardening: parent must remain inside base after realpath,
  // and refuse writing through an existing symlink at the target path
  const realBase = await fs.realpath(baseDir);
  const realParent = await fs.realpath(dir).catch(() => null);
  if (!realParent || path.relative(realBase, realParent).startsWith('..')) {
    throw new Error('Invalid file path');
  }
  try {
    const lst = await fs.lstat(target);
    if (lst.isSymbolicLink()) throw new Error('Refusing to write through symlink');
  } catch (e) {
    if (e && e.code !== 'ENOENT') throw e; // ignore "not exists", rethrow others
  }

  // Convert input to Buffer for correct byte counting
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(String(data), finalOptions.encoding);

  // Split large data into chunks for memory safety
  const CHUNK_SIZE = 1024 * 1024; // 1MB
  if (buf.length > 1024 * 1024 * 100) { // 100MB limit (BDF v2.5)
    throw new Error('Exceeds BDF v2.5 memory safety limits');
  }

  const flag = finalOptions.exclusive ? 'wx' : 'w';
  const writer = await fs.open(target, flag, finalOptions.mode);

  try {
    for (let offset = 0; offset < buf.length; offset += CHUNK_SIZE) {
      const chunk = buf.subarray(offset, Math.min(offset + CHUNK_SIZE, buf.length));
      await writer.write(chunk, 0, chunk.length, offset);

      if (finalOptions.onProgress) {
        finalOptions.onProgress({
          bytesWritten: offset + chunk.length,
          totalBytes: buf.length
        });
      }
    }

    // Optional flush (most filesystems flush on close; keep for caller intent)
    if (finalOptions.flush && writer.sync) {
      try { await writer.sync(); } catch {}
    }
  } finally {
    await writer.close();
  }
}

module.exports = { secureWrite };

