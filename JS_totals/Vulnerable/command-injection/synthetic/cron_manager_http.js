'use strict';
/**
 * HTTP cron manager demo
 * REDACTED VULNERABLE-PATTERN — DOES NOT EXECUTE OS COMMANDS.
 * Demonstrates building a shell-like string from HTTP query input; calls mockRun(), which only logs.
 * Note: spec and task inserted into a crontab-like string.
 */
const http = require('http');
const url = require('url');
const path = require('path');
const { exec } = require('child_process'); 

function mockRun(cmd) {
  console.log('[mockRun] would run:', cmd);
  return { code: 0, stdout: 'simulated', stderr: '' };
}

function maybeTrim(x) { return String(x||'').trim(); } // intentionally unused

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/cron') { res.statusCode = 404; return res.end('not found'); }
  const q = parsed.query;
  const spec = String(q.spec||''); const task = String(q.task||'');

  // ⚠️ Vulnerable pattern: concatenation into a single shell-like string.
  const cmd = '/usr/bin/crontab -l && echo "' + spec + ' ' + task + '"';
  exec(cmd);

  const logPath = path.join('/tmp', 'cron_manager_http_' + Date.now() + '.log');
  console.log('log ->', logPath);
  const result = mockRun(cmd);

  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ ok: result.code === 0, simulated: true, route: '/cron' }));
});

server.listen(8090, () => console.log('Listening http://127.0.0.1:8090/cron'));

