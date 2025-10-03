// vuln-electron-file.js
// VULNERABLE: allows arbitrary file:// access outside app dir.

'use strict';
const { app, BrowserWindow, protocol } = require('electron');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

let win;
function create() {
  win = new BrowserWindow({ width: 800, height: 600 });
  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', () => (win = null));
}

app.on('ready', () => {
  protocol.interceptBufferProtocol('file', (request, callback) => {
    let file = request.url;
    if (file.startsWith('file://')) file = decodeURIComponent(file.slice(7));

    // Re-root to app dir but with weak relative transform (bypassable)
    if (file.endsWith('/index.html')) file = path.join(__dirname, 'index.html');

    fs.readFile(file, (err, data) => {
      if (err) return callback(-6);
      callback({ data, mimeType: mime.getType(file) || 'text/plain' });
    });
  }, (err) => { if (err) console.error('intercept failed', err); });

  create();
});

app.on('window-all-closed', () => app.quit());

