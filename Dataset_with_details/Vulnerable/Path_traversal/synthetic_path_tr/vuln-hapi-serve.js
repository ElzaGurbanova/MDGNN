// vuln-hapi-serve.js
// VULNERABLE: naive path handling with absolute override; follows symlinks.

'use strict';
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, 'profiles');

async function start() {
  const server = Hapi.server({ port: 5019, host: 'localhost' });

  server.route({
    method: 'GET',
    path: '/avatar',
    handler: (request, h) => {
      const u = String(request.query.user || 'guest');
      const img = path.join(ROOT, u, 'avatar.png'); // traversal possible with u containing /../
      if (!img.startsWith(ROOT) || !fs.existsSync(img)) return h.response('Not found').code(404);
      return h.file ? h.file(img) : h.response(fs.readFileSync(img)).type('image/png');
    }
  });

  server.route({
    method: 'GET',
    path: '/attach',
    handler: (request, h) => {
      const p = String(request.query.path || '');
      const f = path.join(ROOT, p); // absolute override
      if (!f.startsWith(ROOT) || !fs.existsSync(f)) return h.response('Not found').code(404);
      return h.response(fs.readFileSync(f)).type('application/octet-stream');
    }
  });

  await server.start();
  console.log('hapi serve (VULN) on :5019');
}

start().catch(console.error);

