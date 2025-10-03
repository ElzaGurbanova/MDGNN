const fs = require('fs');
const Path = require('path');

this.router.get('/item/:id/*', (req, res) => {
  const item = this.db.libraryItems.find(ab => ab.id === req.params.id);
  if (!item) return res.status(404).send('Item not found with id ' + req.params.id);

  if (!req.user.checkCanAccessLibraryItem(item)) {
    Logger.error(`[StaticRouter] User attempted to access library item file without access ${req.params['0']}`, req.user);
    return res.sendStatus(403);
  }

  // Normalize separators and decode once
  const remainingRaw = String(req.params['0'] || '').replace(/\\/g, '/');

  try {
    // Base directory/file
    const base = Path.resolve(item.path);

    // If the item is a single file, only allow empty remainder
    let target;
    if (item.isFile) {
      if (remainingRaw !== '' && remainingRaw !== '/') return res.sendStatus(404);
      target = base;
    } else {
      // Prevent absolute override by prefixing with '.' before resolve
      target = Path.resolve(base, '.' + (remainingRaw.startsWith('/') ? remainingRaw : '/' + remainingRaw));
    }

    // Boundary-safe containment check
    const rel = Path.relative(base, target);
    if (rel.startsWith('..') || Path.isAbsolute(rel)) {
      Logger.error(`[StaticRouter] Traversal attempt: ${remainingRaw}`);
      return res.sendStatus(403);
    }

    // Symlink-hardening: ensure canonical path remains under base
    const realBase = fs.realpathSync.native(base);
    const realTarget = fs.realpathSync.native(target);
    const relReal = Path.relative(realBase, realTarget);
    if (relReal.startsWith('..') || Path.isAbsolute(relReal)) {
      Logger.error(`[StaticRouter] Symlink escape: ${remainingRaw}`);
      return res.sendStatus(403);
    }

    let opts = {};
    const audioMimeType = getAudioMimeTypeFromExtname(Path.extname(realTarget));
    if (audioMimeType) opts = { headers: { 'Content-Type': audioMimeType } };

    // If using X-Accel, ensure you map to an internal location, not a raw filesystem path
    if (global.XAccel) {
      Logger.debug(`Use X-Accel to serve static file ${realTarget}`);
      return res.status(204).header({ 'X-Accel-Redirect': global.XAccel + realTarget }).send();
    }

    res.sendFile(realTarget, opts);
  } catch (e) {
    Logger.error(`[StaticRouter] Error serving file: ${e.message}`);
    return res.sendStatus(404);
  }
});

