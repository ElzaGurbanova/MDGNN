const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const port = 3000;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all requests
app.use(limiter);

// Parse bodies BEFORE WAF so the middleware can inspect them
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ---------- Helpers for decoding & detection ----------
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

function hasTraversal(s) {
  if (!s) return false;
  const text = String(s);
  // Quickly bail if no dots at all (cheap guard)
  if (!text.includes('.')) return false;

  // Normalize percent case, backslashes to slashes
  let t = text.replace(/%2e/gi, '%2E').replace(/%2f/gi, '%2F').replace(/%5c/gi, '%5C');
  // Detect encoded dot/dir tokens still present
  const encodedPatterns = /%2E%2E(?:%2F|\/|\\)|%2E(?:%2F|\/|\\)|(?:%2F|\/|\\)%2E/g;

  // Decode a few rounds and normalize separators
  const decoded = multiDecodeURIComponent(text).replace(/\\/g, '/');

  // Actual traversal forms after decoding
  const classic = /(^|\/)\.\.(\/|$)/; // ../ or /.. at boundaries
  const sneaky  = /\/\.(\/|$)/;       // ./ segments (useful if app mistakenly collapses)

  return classic.test(decoded) || encodedPatterns.test(t) || sneaky.test(decoded);
}
// ----------------------------------------------------

// Basic WAF middleware (improved)
const wafMiddleware = (req, res, next) => {
  // Pull raw path only (exclude querystring)
  const rawPath = (req.originalUrl || req.url || '').split('?')[0] || '/';
  const decodedPath = multiDecodeURIComponent(rawPath).replace(/\\/g, '/');

  // Build a string view of the body to scan (if present)
  let bodyString = '';
  if (req.body !== undefined) {
    try {
      bodyString = typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body);
    } catch {
      bodyString = '';
    }
  }

  // SQL Injection (very naive heuristic)
  const sqlInjectionPattern = /(\%27)|(\')|(\-\-)|(\%23)|(#)/i;
  if (sqlInjectionPattern.test(req.url) || sqlInjectionPattern.test(bodyString)) {
    return res.status(403).json({ error: 'SQL Injection attempt detected' });
  }

  // XSS (very naive heuristic)
  const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  if (xssPattern.test(req.url) || xssPattern.test(bodyString)) {
    return res.status(403).json({ error: 'XSS attempt detected' });
  }

  // Path Traversal protection (decode & normalize; check both URL and body)
  if (hasTraversal(decodedPath) || hasTraversal(bodyString)) {
    return res.status(403).json({ error: 'Path Traversal attempt detected' });
  }

  next();
};

// Apply WAF middleware
app.use(wafMiddleware);

// Sample protected route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the protected API' });
});

// Start server
app.listen(port, () => {
  console.log(`WAF server running on port ${port}`);
});

