const APP_NAME = 'aso-server';
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 3000;

const getHostPortFromPrompt = () => {
  const args = process.argv;
  if (args.length > 3) {
    console.log('Expected zero or one arguments.\n');
    process.exit(help());
  }
  if (args.length < 3) {
    return [DEFAULT_HOST, DEFAULT_PORT];
  }
  if (args[2].indexOf('help') > -1 || args[2].indexOf('?') > -1 || args[2] === '-h') {
    process.exit(help());
  }
  const hostPort = args[2].split(':');
  return hostPort.length == 1
    ? (hostPort[0] > 0 ? [DEFAULT_HOST, hostPort[0]] : [hostPort[0], DEFAULT_PORT])
    : [hostPort[0] != '' ? hostPort[0] : DEFAULT_HOST,
        hostPort[1] != '' ? hostPort[1] : DEFAULT_PORT];
};

const help = () => {
    console.log(`\
Usage: node server [host:port OR host OR port]
Starts a simple HTTP file server.

Examples:
  node server                Uses default host and port
  node server 12345          Uses default host, port 12345
  node server localhost      Uses host localhost, default port
  node server 0.0.0.0:33669  Uses specified host and port
`);
}

const getHtml = (title, body) => `<html><head><title>${title}</title><link rel="icon" href="/f/favicon.png"></head><body>${body}\n<ul>\n`;

// Handles server connections
const connectionHandler = (req, res) => {
  let method = req.method;
  let action = req.url.substring(1).split('/');
  let value;
  try {
    value = decodeURI(action.slice(1).join('/'));
  } catch (e) {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    return res.end('400 Bad request');
  }
  action = action[0];

  if (action == 'f') {
    return writeFileContents(res, value, false);
  } else if (action == 'f.') {
    return writeFileContents(res, './', true);
  } else if (action == 'favicon.ico') {
    return writeFileContents(res, './favicon.png', false);
  } else if (action == 'i') {
    return writeFileInfo(res, value);
  } else if (action == 'i.') {
    return writeFileInfo(res, '.');
  } else if (action == 'd') {
    return writeDirFiles(res, value);
  } else if (action == 'd.') {
    return writeDirFiles(res, '.');
  } else {
    let body = `<h1><a href="/">${APP_NAME}</a></h1>`;
    if (action == '') {
      body += '<h2>Browse files:</h2><dl>'
        + '<dt><code>/f</code><dd><a href="/f">Root DIR</a>'
        + '<dt><code>/f.</code><dd><a href="/f.">Current DIR</a>'
        + '<dt><code>/f/&lt;path&gt;/&lt;to&gt;/&lt;file&gt;</code><dd> Current DIR relative file'
        + '<dt><code>/f//&lt;path&gt;/&lt;to&gt;/&lt;file&gt;</code><dd>Root DIR relative file</dl>';
    }
    body += `<h2>Request:</h2><dl><dt>method:<dd>${method}<dt>action:<dd>${action} &nbsp;<dt>value:<dd>${value} &nbsp;</dl></h2>`;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(getHtml(APP_NAME, body));
  }
};

// Write the specified by "path" file's contents into "res"
const fs = require('fs');
const writeFileContents = (res, path, dotCommand) => {
  if (path == '') {
    path = '/';
  }
  try {
    let contents = fs.readFileSync(path);
    res.writeHead(200);
    return res.end(contents);
  } catch (e) {
    if (e.code === 'ENOENT') {
      res.writeHead(404, 'Not Found');
      return res.end('404 Not Found');
    } else if (e.code === 'EACCES') {
      res.writeHead(403, 'Access Denied');
      return res.end('403 Access Denied');
    } else if (e.code === 'EISDIR') {
      return listDirHtml(res, path, dotCommand);
    }
    res.writeHead(400, {'Content-Type': 'text/plain'});
    return res.end(JSON.stringify(e));
  }
}

const writeFileInfo = (res, path) => {
  if (path == '') {
    path = '/';
  }
  try {
    let stats = fs.statSync(path);
    res.writeHead(200);
    return res.end(JSON.stringify(stats));
  } catch (e) {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    return res.end(JSON.stringify(e));
  }
}

const writeDirFiles = (res, path) => {
  if (path == '') {
    path = '/';
  }
  res.writeHead(200, {'Content-Type': 'text/plain'});
  return res.end(JSON.stringify(getDirFiles(path)));
}

const getDirFiles = (path) => {
  let files;
  try {
    files = fs.readdirSync(path);
  } catch (e) {
    return {exists: e.code !== 'ENOENT'};
  }
  let result = {exists: true, files: [], dirs: []};
  for (i in files) {
    let file = files[i];
    let isDir;
    try {
      let fstat = fs.statSync(path + file);
      isDir = fstat.isDirectory();
    } catch (e) {
      isDir = false;
    }
    result[isDir ? 'dirs' : 'files'].push(file);
  }
  return result;
}

// Lists directory as HTML
const listDirHtml = (res, path, dotCommand) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  let body = `<h1>${path}</h1>\n<ul>\n`
  let files = fs.readdirSync(path);
  if (!dotCommand) {
    path += path == '/' ? '' : '/';
  }
  for (i in files) {
    let file = files[i];
    let dir;
    try {
      let fstat = fs.statSync(path + file);
      dir = fstat.isDirectory() ? '[DIR] ' : '';
    } catch (e) {
      dir = '[?] ';
    }
    body += `<li>${dir}<a href="/f/${path}${file}">${file}</a></li>\n`;
  }
  body += '</ul>';
  return res.end(getHtml(path, body));  
};


const startServerFromPrompt = () => {
  let [hostname, port] = getHostPortFromPrompt();
  let server = require('http').createServer(connectionHandler);
  try {
    server.on('error', e => {
      switch (e.code) {
        case 'EADDRINUSE':
          msg = `ERROR: [EADDRINUSE] Address ${hostname}:${port} is already in use!\nIs ${APP_NAME} already running?`;
          break;
        case 'ENOTFOUND':
          msg = `Hostname ${hostname} cannot be used.`;
          break;
        case 'EADDRNOTAVAIL':
          msg = `Address ${hostname}:${port} is not available.`;
          break;
        case 'EACCES':
          msg = `Address ${hostname}:${port} cannot be used.`;
          break;
        default:
          msg = `ERROR: [${e.code}] ${e}`;
      }
      console.log(msg);
      server.close();
    }).on('close', e => { console.log('Server stopped.');
    }).listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/\nHit CTRL+C (or CMD+C) to stop`);
    });
  } catch (e) {
    console.log(e.message);
  }  
};


const exportServerAsModule = () => {
  module.exports = ((hostname, port) => {
    let server;
    let errorCallback = (e) => { console.log(e); };
    let stopCallback = errorCallback;

    let serverModule = {
      start: (hostname, port, startCallback) => {
        try {
          server = require('http').createServer(connectionHandler);
          startCallback = startCallback ? startCallback : () => {};
          server
            .on('error', e => errorCallback(e))
            .on('close', () => stopCallback())
            .listen(port, hostname, () => startCallback(serverModule));
        } catch (e) {
          errorCallback(e);
        }
        return serverModule;
      },
      onError: (fn) => {
        errorCallback = fn;
        return serverModule;
      },
      onStop: (fn) => {
        stopCallback = fn;
        return serverModule;
      },
      stop: () => {
        server.close();
        return serverModule;
      }
    };
    return serverModule;
  })();
};


if (require.main === module) {
  startServerFromPrompt();
} else {
  exportServerAsModule();
}
