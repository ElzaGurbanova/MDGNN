'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// check for arguments
if (process.argv.length < 3) {
				// user must specify entry html page
				console.log('\nUsage: \n\t$ node gamebutler.js path/to/index.html\n');
				process.exit();
}

// store const entrypoint
var ENTRY = _path2.default.resolve(process.argv[2]);
var BASE = _path2.default.dirname(ENTRY);
var PORT = 8080;

// create server
var server = _http2.default.createServer(function (request, response) {
				var uri = _url2.default.parse(request.url).pathname.replace("%20", " ");
				var filename = _path2.default.join(BASE, uri);
				_fs2.default.stat(filename, function (err, status) {
								if (err != null) {
												response.writeHead(200, { 'Content-Type': 'text/plain' });
												response.write('404');
												response.end();
								} else {
												// if we are on the root directory, serve entrypoint
												if (status.isDirectory()) {
																filename = ENTRY;
												}
												// get file extension
												var ext = _path2.default.extname(filename).split(".")[1];
												var mimeType = "";
												switch (ext) {
																case "html":
																				mimeType = "text/html";
																				break;
																case "jpg":
																case "jpeg":
																				mimeType = "image/jpeg";
																				break;
																case "png":
																				mimeType = "image/png";
																				break;
																case "js":
																				mimeType = "text/javascript";
																				break;
																case "css":
																				mimeType = "text/css";
																				break;
												}
												response.writeHead(200, { 'Content-Type': mimeType });
												var fileStream = _fs2.default.createReadStream(filename);
												fileStream.pipe(response);

												console.log("- %s", filename);
								}
				});
}).listen(PORT, function () {
				console.log("GameButler listening on: http://localhost:%s", PORT);
});
