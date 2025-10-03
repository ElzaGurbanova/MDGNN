'use strict';
/**
 * HTTP LaTeX builder — FIXED (safer)
 * Allowlists template names and output directory; no shell; simulates a build.
 */
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const TEMPLATES = new Set(['report', 'invoice', 'paper']);
const BASE_OUT = '/srv/latex_out';

function underBase(p) {
  const full = path.resolve(BASE_OUT, String(p||''));
  if (!full.startsWith(path.resolve(BASE_OUT) + path.sep)) return null;
  return full;
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/latex') { res.statusCode = 404; return res.end('not found'); }
  const tmpl = String(parsed.query.template||''); const out = underBase(String(parsed.query.out||'.'));
  if (!TEMPLATES.has(tmpl) || !out) { res.statusCode = 400; return res.end('bad request'); }
  const content = '% Simulated LaTeX for ' + tmpl + '\n\\begin{document}\nHello\\end{document}\n';
  try { fs.writeFileSync(path.join(out, tmpl + '.tex'), content); } catch {}
  res.setHeader('content-type','application/json');
  res.end(JSON.stringify({ ok: true, template: tmpl, out, simulated: true }));
});

server.listen(8093, () => console.log('Fixed LaTeX builder on 8093/latex'));

