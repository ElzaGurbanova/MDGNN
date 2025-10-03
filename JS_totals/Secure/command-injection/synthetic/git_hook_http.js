'use strict';
/** Git hook runner HTTP — FIXED (no shell; validation/allowlists) */
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const ALLOWED_HOOKS = new Set(['pre-commit','post-commit','pre-push','post-checkout']);
function underRepo(p) {
  const full = path.resolve('/srv/repos', String(p||''));
  return full.startsWith('/srv/repos' + path.sep) ? full : null;
}
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/git/hook') { res.statusCode = 404; return res.end('not found'); }
  const repo = underRepo(parsed.query.repo || '');
  const hook = String(parsed.query.hook || '');
  if (!repo || !ALLOWED_HOOKS.has(hook)) { res.statusCode = 400; return res.end('bad req'); }
  // No shell: simulate hook by writing an audit record
  const record = { repo, hook, ts: Date.now() };
  fs.appendFileSync('/tmp/git_hooks_audit.jsonl', JSON.stringify(record)+'\n');
  res.setHeader('content-type','application/json');
  res.end(JSON.stringify({ ok: true, simulated: true }));
});
server.listen(8201, () => console.log('Fixed git hook http://127.0.0.1:8201/git/hook'));

