#!/usr/bin/env node

/*
 * noPach
 * git://github.com/Neablis/nopach
 *
 * Copyright (c) 2013 Mitchell
 * Licensed under the MIT license.
 */

var http = require('http'),
  https = require('https'),
  url = require('url'),
  path = require('path'),
  fs = require('fs'),
  open = require('open'),
  portfinder = require('portfinder');

var argv = require('optimist')
    .usage('Usage: nopach --https [bool] --dir [string] --port [num] --priv [string] --root [bool] ')
    .default('root', 0)
    .alias('r', 'root')
    .describe('root', 'allows a routing system to always reload root on 404s of directories')
  	.default('port', 0)
  	.alias('p', 'port')
    .describe('port', 'specify port to use, if no port specified use first open port from 8000+')
    .default('priv', 'privatekey.pem')
    .describe('priv', 'Private key if HTTPS specified')
    .default('pub', 'certificate.pem')
    .describe('pub', 'Public key if HTTPS specified')
    .default('https', false)
    .describe('https', 'Turn on https with --https 1')
    .default('dir', '')
    .describe('dir', 'Specify a directory to monitor, defaults to current')
    .alias('d', 'dir')
    .argv;

var dirs_in = [],
  files_in = [],
  projectDir = argv.dir,
  backbone_routing = argv.root,
  options = {},
  openURL = '';

var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "swf": "application/x-shockwave-flash",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css",
  "json": "application/json"
};



portfinder.getPort(function (err, port) {
  if( argv.h ){
    process.exit(1);
  }

	if( argv.port != 0 ){
		port = argv.port;
	}

  //todo: Check if privatekey/publickey exists
	if( argv.https ){
    try{
      options.key = fs.readFileSync(argv.priv).toString();
      options.cert = fs.readFileSync(argv.pub).toString();
    }catch(e){
      console.log("Public/Private key non existant");
      process.exit(1);
    }

		https.createServer(options, server).listen(port);
		console.log("HTTPS Server created on port: " + port + " based in " + projectDir);
    openURL = 'https://localhost';
	}else{
		http.createServer(server).listen(port);
		console.log("HTTP Server created on port: " + port + " based in " + projectDir);
    openURL = 'http://localhost';
	}

  openURL += ":" + port;

  console.log("Opening webpage " + openURL);
  open(openURL);

});
/*
portfinder.getPort(function (err, port) {
  console.log("HTTP Server created on port: " + port + " based in " + projectDir[0])
  http.createServer(server).listen(port);
});
*/

function server(req, res) {
  var uri = url.parse(req.url).pathname;
  serveFile(uri, res);
}

function printDirectory(uri, res){
  var filename = path.join(process.cwd(), projectDir, uri);

  fs.readdir(filename + "/", function(err, files){
    if (err) {
      throw err;
    }

    dirs_in = [];
    files_in = [];
    
    res.writeHead(200, {'Content-Type': mimeTypes['html']});
    res.write("<HTML><HEAD><title>Directory Listing</title></HEAD><BODY><h1>Directory Listing for " + filename + "</h1>");
    res.write("<ul>");
    for( var x = 0; x < files.length; x++ ){
      res.write("<li><a href='" + files[x] + "'>" + files[x] + "</a>" );
      if( fs.statSync( path.join(filename + "/" + files[x]) ).isDirectory() ){
        res.write(" is a <b style='color:blue'>dir</b>");
      } else {
       res.write(" is a <b style='color:green'>file</b>");
      }
      res.write("</li>");
    }
    res.write("</ul>");
    res.write("</BODY></HTML>");
    res.end();
  });
}


function serveFile(uri, res) {
  var stats;
  var filename = path.join(process.cwd(), projectDir, uri);
  var root = path.join(process.cwd(), projectDir, "/index.html");

  try {
    stats = fs.lstatSync(filename); // throws if path doesn't exist
  } catch (e) {
    if( backbone_routing ){
      console.log("Serving up the root");
      res.writeHead(200, {'Content-Type': "text/html"});
      var fileStream = fs.createReadStream(root);
      fileStream.pipe(res);
    }else{
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('404 Directory Not Found\n');
      res.end();
    }
    //console.log("404", filename);
    return;
  }

  if (stats.isFile()) {
    var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
    res.writeHead(200, {'Content-Type': mimeType});
    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);
    //console.log("200", filename);
  } else if (stats.isDirectory()) {
    //If index exists use index.html
    fs.exists(path.join(filename, "index.html"), function (exists) {
      if( exists ){
        serveFile(path.join(uri, "index.html"), res);
      }else{
        printDirectory(uri, res);
      }
    });

  } else {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write('500 Internal server error\n');
    res.end();
    //console.log("500", filename);
  }
}
