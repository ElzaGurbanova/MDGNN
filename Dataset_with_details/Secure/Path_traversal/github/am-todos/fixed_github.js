import express from 'express';
import logger from '../logger.js';
import { sanitizeHeader } from '../middleware/security.js';

const router = express.Router();

router.post('/api/github', async (req, res) => {
  const { path: rawPath, method = 'GET', headers = {}, body, owner, repo } = req.body || {};
  if (!rawPath || !owner || !repo) return res.status(400).json({ error: 'Missing required fields' });

  const nameRe = /^[a-zA-Z0-9._-]+$/;
  if (!nameRe.test(owner) || !nameRe.test(repo)) return res.status(403).json({ error: 'Invalid owner/repo' });

  // 1) Parse & decode once; reject control chars
  let u;
  try { u = new URL(`https://api.github.com${rawPath}`); } 
  catch { return res.status(403).json({ error: 'Bad path' }); }
  if (/[^\x20-\x7E]/.test(u.pathname)) return res.status(403).json({ error: 'Bad chars in path' });

  const segs = u.pathname.split('/').filter(Boolean).map(s => {
    try { return decodeURIComponent(s); } catch { throw new Error('Bad encoding'); }
  });

  // 2) Must be /repos/:owner/:repo/...
  if (segs[0] !== 'repos' || segs[1] !== owner || segs[2] !== repo) {
    return res.status(403).json({ error: 'Invalid repository path' });
  }

  // 3) No traversal segments
  if (segs.some(s => s === '.' || s === '..')) {
    return res.status(403).json({ error: 'Path traversal detected' });
  }

  // 4) Allowlist endpoints
  const rest = segs.slice(3);
  const segOk = (s) => /^[a-zA-Z0-9._-]+$/.test(s); // file/folder names
  let allowed = false;

  if (rest[0] === 'contents') {
    // /repos/:o/:r/contents[/<path>]
    allowed = rest.length === 1 || (rest.length >= 2 && rest.slice(1).every(segOk));
  } else if (rest[0] === 'commits') {
    // /repos/:o/:r/commits or /commits/<sha>
    allowed = rest.length === 1 || (rest.length === 2 && /^[0-9a-fA-F]+$/.test(rest[1]));
  }

  if (!allowed) return res.status(403).json({ error: 'Endpoint not allowed' });

  // 5) Method allowlist (read-only)
  const m = String(method).toUpperCase();
  if (!['GET', 'HEAD'].includes(m)) return res.status(405).json({ error: 'Method not allowed' });

  // 6) Build safe upstream request
  const githubUrl = `https://api.github.com${u.pathname}${u.search}`;
  const fetchOptions = {
    method: m,
    headers: {
      'User-Agent': 'Agentic-Markdown-Todos',
      ...(headers.Authorization && { Authorization: sanitizeHeader(headers.Authorization) }),
      ...(headers.Accept && { Accept: sanitizeHeader(headers.Accept) })
    }
  };

  try {
    const response = await fetch(githubUrl, fetchOptions);
    const text = await response.text();
    res.status(response.status);
    for (const [k, v] of response.headers) {
      if (['content-type','etag','last-modified'].includes(k.toLowerCase())) res.setHeader(k, v);
    }
    return res.send(text);
  } catch (e) {
    logger.error('GitHub API proxy error:', e);
    return res.status(500).json({ error: 'Failed to proxy GitHub API request' });
  }
});

export default router;
