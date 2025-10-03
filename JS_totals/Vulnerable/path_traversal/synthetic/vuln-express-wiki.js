// vuln-express-wiki.js
// VULNERABLE: mixes path.join with user input; absolute override; symlink follow; weak sanitization.

'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA = path.resolve(__dirname, 'data/wiki'); // intended root

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// helper to render bare HTML
function page(title, body) {
  return `<!doctype html>
<html><head><meta charset="utf8"><title>${title}</title></head>
<body><h1>${title}</h1>${body}</body></html>`;
}

app.get('/health', (_req, res) => res.json({ ok: true }));

// view page (naive)
app.get('/wiki', (req, res) => {
  const name = String(req.query.page || 'home.md');
  const file = path.join(DATA, name);           // absolute override if name starts with '/'
  if (!file.startsWith(DATA)) return res.status(400).send('Bad path');

  try {
    const txt = fs.readFileSync(file, 'utf8');
    res.type('html').send(page(`View: ${name}`,
      `<pre>${txt.replace(/[&<>]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[s]))}</pre>
       <p><a href="/wiki/edit?page=${encodeURIComponent(name)}">Edit</a> |
          <a href="/wiki/export?page=${encodeURIComponent(name)}">Export</a></p>`));
  } catch {
    res.status(404).send(page('Not found', `<p>${name} not found.</p>`));
  }
});

// edit form (naive)
app.get('/wiki/edit', (req, res) => {
  const name = String(req.query.page || 'home.md');
  const file = path.join(DATA, name);
  if (!file.startsWith(DATA)) return res.status(400).send('Bad path');
  let txt = '';
  try { txt = fs.readFileSync(file, 'utf8'); } catch {}
  res.type('html').send(page(`Edit: ${name}`, `
    <form method="post" action="/wiki/save">
      <input type="hidden" name="page" value="${name}"/>
      <textarea name="content" rows="20" cols="80">${txt.replace(/</g,'&lt;')}</textarea><br/>
      <button>Save</button>
    </form>`));
});

// save (naive)
app.post('/wiki/save', (req, res) => {
  const name = String(req.body.page || 'home.md');
  const content = String(req.body.content || '');
  const file = path.join(DATA, name);         // traversal with ../../
  if (!file.startsWith(DATA)) return res.status(400).send('Bad path');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);            // follows symlink if exists
  res.redirect('/wiki?page=' + encodeURIComponent(name));
});

// export (naive) – streams file directly
app.get('/wiki/export', (req, res) => {
  const name = String(req.query.page || 'home.md');
  const file = path.join(DATA, name);
  if (!file.startsWith(DATA)) return res.status(400).send('Bad path');
  if (!fs.existsSync(file)) return res.status(404).send('Not found');
  res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(name));
  fs.createReadStream(file).on('error', () => res.status(500).end()).pipe(res);
});

app.get('/', (_req, res) =>
  res.type('html').send(page('Wiki (VULNERABLE)', `
  <ul>
    <li>GET /wiki?page=/etc/hosts</li>
    <li>GET /wiki/edit?page=../../outside.md</li>
    <li>POST /wiki/save (page=../../evil.md)</li>
  </ul>`))
);

app.listen(5022, () => console.log('Wiki (VULN) on :5022'));

