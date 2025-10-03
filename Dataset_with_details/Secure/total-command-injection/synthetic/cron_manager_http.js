'use strict';
/**
 * HTTP cron manager demo — FIXED (safer)
 * Validates a constrained cron spec and task name; simulates persistence without shell calls.
 */
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

function isCronSpec(s) { return /^([\d*/,-]{1,20}\s+){4}[\d*/,-]{1,20}$/.test(String(s)); }
function isTask(t) { return /^[a-zA-Z0-9._:-]{1,40}$/.test(String(t)); }
const DB = path.join('/tmp', 'cron_fixed_db.json');

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/cron') { res.statusCode = 404; return res.end('not found'); }
  const { spec = '', task = '' } = parsed.query;
  if (!isCronSpec(spec) || !isTask(task)) { res.statusCode = 400; return res.end('bad request'); }
  let data = []; try { data = JSON.parse(fs.readFileSync(DB,'utf8')); } catch {}
  data.push({ spec, task, ts: Date.now() });
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
  res.setHeader('content-type','application/json');
  res.end(JSON.stringify({ ok: true, saved: { spec, task }, simulated: true }));
});

server.listen(8092, () => console.log('Fixed cron manager on 8092/cron'));

