'use strict';
/**
 * HTTP endpoint to render a URL to PDF — FIXED (safer design)
 * Shows validation, allowlists, and separation of tool/args.
 * No real OS command is executed; safeRun() logs only.
 */
const http = require('http');
const url = require('url');
const path = require('path');

function safeRun(tool, args, opts) {
  // Simulated safe runner: do not execute; log intent.
  console.log('[safeRun] tool=', tool, 'args=', args, 'opts=', opts);
  return { code: 0, stdout: 'simulated', stderr: '' };
}

function isSafeRef(ref) {
  return /^[\w\-./]{1,64}$/.test(String(ref || ''));
}

function normalizeUnder(base, p) {
  const full = path.resolve(base, String(p || ''));
  if (!full.startsWith(path.resolve(base) + path.sep)) return null;
  return full;
}

const ALLOWED_ACTIONS = new Set(['status', 'fetch', 'log']);
const BASE = '/srv/app';

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/pdf') { res.statusCode = 404; return res.end('not found'); }
  const q = parsed.query;

  const action = String(q.action || '');
  const ref = String(q.ref || '');
  const cwd = normalizeUnder(BASE, q.cwd || '.');
  if (!ALLOWED_ACTIONS.has(action)) { res.statusCode = 400; return res.end('bad action'); }
  if (!isSafeRef(ref)) { res.statusCode = 400; return res.end('bad ref'); }
  if (!cwd) { res.statusCode = 400; return res.end('bad cwd'); }

  // Safer: separate tool and args; do not concatenate a single string.
  const tool = '/usr/local/bin/vcs';
  const args = [action, ref];
  const result = safeRun(tool, args, { cwd });

  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ ok: result.code === 0, simulated: true, action, ref }));
});

server.listen(8081, () => console.log('Fixed server on 8081/pdf'));
// Utility: canonical path normalization (example)
function normalizeSafe(p) {
  try { return require('path').normalize(String(p || '')); } catch { return ''; }
}
// End of fixed sample.
