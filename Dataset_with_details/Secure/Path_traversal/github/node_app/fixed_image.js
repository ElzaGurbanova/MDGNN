import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export default function handler(req, res) {
  // Basic Auth
  const auth = req.headers.authorization || '';
  const [scheme, credentials] = auth.split(' ');

  if (scheme !== 'Basic' || !credentials) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    return res.status(401).end('Authentication required');
  }

  const decoded = Buffer.from(credentials, 'base64').toString();
  const [user, pass] = decoded.split(':');

  if (user !== 'admin' || pass !== 'admin') {
    return res.status(403).end('Forbidden');
  }

  // Coerce query param to a single string
  let { name } = req.query;
  if (Array.isArray(name)) name = name[0];

  if (!name || typeof name !== 'string') {
    return res.status(400).end('Missing image name');
  }

  // Canonical base directory
  const imageDir = path.resolve(process.cwd(), 'protected_images');

  try {
    // Resolve against base with '.' to block absolute override
    const target = path.resolve(imageDir, '.' + name);

    // Path-aware containment check
    const rel = path.relative(imageDir, target);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      return res.status(400).end('Invalid image path');
    }

    // Symlink-hardening: ensure canonical paths are still inside base
    const realBase = fs.realpathSync(imageDir);
    let realTarget;
    try {
      realTarget = fs.realpathSync(target);
    } catch {
      return res.status(404).end('Image not found');
    }
    const relReal = path.relative(realBase, realTarget);
    if (relReal.startsWith('..') || path.isAbsolute(relReal)) {
      return res.status(403).end('Forbidden');
    }

    // Must be a regular file
    let stat;
    try {
      stat = fs.statSync(realTarget);
    } catch {
      return res.status(404).end('Image not found');
    }
    if (!stat.isFile()) {
      return res.status(404).end('Image not found');
    }

    const contentType = mime.lookup(realTarget) || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    const stream = fs.createReadStream(realTarget);
    stream.on('error', () => res.status(500).end('Read error'));
    stream.pipe(res);
  } catch (e) {
    // Any other errors
    return res.status(400).end('Invalid image path');
  }
}

