const Logger = require('../utils/logger');

function multiDecodeURIComponent(str, rounds = 3) {
  let out = str;
  for (let i = 0; i < rounds; i++) {
    try {
      const dec = decodeURIComponent(out);
      if (dec === out) break;
      out = dec;
    } catch {
      break;
    }
  }
  return out;
}

function hasTraversal(pathLike) {
  if (!pathLike) return false;

  // Work on a normalized, decoded copy
  const decoded = multiDecodeURIComponent(String(pathLike)).replace(/\\/g, '/');

  // Classic ../ or /.. with path-segment boundaries
  const classic = /(^|\/)\.\.(\/|$)/;

  // Also detect sneaky single-dot segments (sometimes collapsed incorrectly downstream)
  const singleDot = /(^|\/)\.(\/|$)/;

  // Encoded patterns that may still be present in the raw string
  // (useful before decoding fully, but we keep them here for defense-in-depth)
  const encodedVariants = /%2e%2e(?:%2f|\/|\\)|(?:%2f|\/|\\)%2e%2e/i;

  return classic.test(decoded) || singleDot.test(decoded) || encodedVariants.test(pathLike);
}

function createSecurityMiddleware(config) {
  const logger = new Logger(config.logLevel);

  return (req, res, next) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Extract only the pathname (exclude query string)
    const rawUrl = req.originalUrl || req.url || '/';
    const pathname = rawUrl.split('?')[0] || '/';

    // Path traversal protection (robust)
    if (hasTraversal(pathname) || hasTraversal(rawUrl)) {
      logger.warn(`Path traversal attempt detected: ${rawUrl} from ${req.ip}`);
      return res.status(400).json({ error: 'Invalid request' });
    }

    next();
  };
}

module.exports = createSecurityMiddleware;

