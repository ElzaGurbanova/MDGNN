'use strict';
/** System runner HTTP — FIXED (no shell; validation/allowlists) */
const http = require('http');
const url = require('url');

const ALLOWED = new Map([
  ['date',  ['--iso-8601=seconds']],
  ['uptime',['--pretty']]
]);
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/sys/run') { res.statusCode = 404; return res.end('not found'); }
  const name = String(parsed.query.name || '');
  if (!ALLOWED.has(name)) { res.statusCode = 400; return res.end('not allowed'); }
  // Simulate execution: compute a canned response
  const out = name === 'date' ? (new Date()).toISOString() : 'up 1 day (simulated)';
  res.setHeader('content-type','application/json');
  res.end(JSON.stringify({ ok: true, out, simulated: true }));
});
server.listen(8202, () => console.log('Fixed sys runner http://127.0.0.1:8202/sys/run'));

