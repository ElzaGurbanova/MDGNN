// vuln-socketio-readfile.js
// VULNERABLE: reads arbitrary paths sent over WebSocket.

'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const ROOT = path.resolve(__dirname, 'workspace');

const server = http.createServer((_, res) => res.end('WS up'));
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', socket => {
  console.log('client connected');

  socket.on('readFile', (relPath, cb) => {
    // Direct join: absolute override & traversal
    const target = path.join(ROOT, relPath);
    fs.readFile(target, 'utf8', (err, data) => {
      if (err) cb({ ok: false, error: 'read error' });
      else cb({ ok: true, data });
    });
  });

  socket.on('list', (dir, cb) => {
    fs.readdir(path.join(ROOT, dir || ''), (err, list) =>
      cb(err ? [] : list));
  });
});

server.listen(5017, () => console.log('Socket.io (VULN) on :5017'));

