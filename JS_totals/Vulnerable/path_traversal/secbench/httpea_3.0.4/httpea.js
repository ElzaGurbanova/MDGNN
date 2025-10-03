#!/usr/bin/env node

'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const server = http.createServer();

function return404(res, filePath) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end(`Couldn't find the file: ${filePath}`);
}

server.listen(8080, 'localhost');

server.on('error', function(e) {
  if (e.code == 'EADDRINUSE') {
    server.listen(0, 'localhost');
  }
});

server.on('listening', function() {
  const port = server.address().port === 8080 ? '8080': `:${server.address().port}`;

  console.log('Static Folder Server running at:');
  console.log(`http://localhost:${port}`);
});

server.on('request', function(req, res) {
  let filePath = path.join(process.cwd(), req.url);

  if (!fs.existsSync(filePath)) {
    return404(res, filePath);
    return;
  }

  const stats = fs.lstatSync(filePath);

  if (stats.isDirectory()) {
    filePath = path.join(filePath, '/index.html');
    if (!fs.existsSync(filePath)) {
      return404(res, filePath);
      return;
    }
  }

  const file = fs.readFileSync(filePath);
  res.writeHead(200);
  res.write(file);
  res.end();
});
