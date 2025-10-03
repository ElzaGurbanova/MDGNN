'use strict';
/**
 * HTTP endpoint that proxies limited SSH actions — FIXED (safer)
 * Restricts actions to an allowlist; validates tokens; no shell concatenation; safeRun logs only.
 */
const http = require('http');
const url = require('url');

function safeRun(tool, args) {
  console.log('[safeRun]', tool, args);
  return { code: 0, stdout: 'simulated', stderr: '' };
}

function isToken(t) { return /^[a-zA-Z0-9_.-]{1,32}$/.test(String(t)); }
const ACTIONS = new Map([
  ['status', ['--status']],
  ['disk',   ['--disk']],
  ['version',['--version']]
]);

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/ssh/proxy') { res.statusCode = 404; return res.end('not found'); }
  const q = parsed.query;
  const user = String(q.user||''); const host = String(q.host||''); const action = String(q.action||'');
  if (!isToken(user) || !isToken(host) || !ACTIONS.has(action)) { res.statusCode = 400; return res.end('bad request'); }
  // Safer: separate tool and args; do not allow arbitrary remote strings.
  const tool = '/usr/bin/ssh-lite';
  const args = ['--user', user, '--host', host, ...ACTIONS.get(action)];
  const r = safeRun(tool, args);
  res.setHeader('content-type','application/json');
  res.end(JSON.stringify({ ok: r.code===0, user, host, action, simulated: true }));
});

server.listen(8091, () => console.log('Fixed SSH proxy on 8091/ssh/proxy'));

