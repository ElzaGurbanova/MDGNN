var http = require('http');
var fs = require('fs');
var util = require('util');
var os = require('os');
var path = require('path');
var hostName = os.hostname();
const v26 = process.env;
const v27 = v26.PORT_NUMBER;
var portNumber = v27 || 9000;
var message = util.format('HTTP Server is Available ... http://%s:%d/', hostName, portNumber);
var header = {};
header['Keep-Alive'] = true;
header['Transfer-Encoding'] = 'chunked';
header['Company-Name'] = 'GS';
header['Content-Type'] = 'video/x-ms-wmv';
const v48 = function (request, response) {
    const v28 = request.url;
    const v29 = '.' + v28;
    var fileRequested = path.normalize(v29);
    const v46 = function (status) {
        const v30 = !status;
        if (v30) {
            const v31 = response.writeHead(404);
            v31;
            const v32 = response.end();
            v32;
        } else {
            const v44 = function (error, stats) {
                const v33 = !error;
                if (v33) {
                    const v34 = stats.isDirectory();
                    if (v34) {
                        const v35 = response.writeHead(403);
                        v35;
                        const v36 = response.end();
                        v36;
                    } else {
                        const v37 = { bufferSize: 1024000 };
                        var stream = fs.createReadStream(fileRequested, v37);
                        const v38 = response.writeHead(200, header);
                        v38;
                        const v39 = stream.pipe(response);
                        v39;
                        const v42 = function () {
                            const v40 = response.end();
                            v40;
                            const v41 = console.log('Stream Ended!');
                            v41;
                        };
                        const v43 = stream.on('end', v42);
                        v43;
                    }
                }
            };
            const v45 = fs.stat(fileRequested, v44);
            v45;
        }
    };
    const v47 = fs.exists(fileRequested, v46);
    v47;
};
var server = http.createServer(v48);
const v49 = server.listen(portNumber);
v49;
const v50 = console.log(message);
v50;