var server = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
const serverHandler = function (request, response) {
    const v38 = request.url;
    const v39 = url.parse(v38);
    var uri = v39.pathname;
    const v40 = process.cwd();
    var filename = path.join(v40, uri);
    var stats;
    try {
        stats = fs.lstatSync(filename);
    } catch (e) {
        const v41 = { 'Content-Type': 'text/plain' };
        const v42 = response.writeHead(404, v41);
        v42;
        const v43 = path.join('/', uri);
        const v44 = '404 Not Found: ' + v43;
        const v45 = v44 + '\n';
        const v46 = response.write(v45);
        v46;
        const v47 = response.end();
        v47;
        return;
    }
    const v48 = fs.statSync(filename);
    const v49 = v48.isDirectory();
    if (v49) {
        filename += '/index.html';
    }
    var contentType;
    const v50 = filename.indexOf('.html');
    const v51 = -1;
    const v52 = v50 !== v51;
    if (v52) {
        contentType['Content-Type'] = 'text/html';
        contentType = {};
        contentType = {};
    }
    const v61 = function (err, file) {
        if (err) {
            const v53 = { 'Content-Type': 'text/plain' };
            const v54 = response.writeHead(500, v53);
            v54;
            const v55 = err + '\n';
            const v56 = response.write(v55);
            v56;
            const v57 = response.end();
            v57;
            return;
        }
        const v58 = response.writeHead(200, contentType);
        v58;
        const v59 = response.write(file, 'binary');
        v59;
        const v60 = response.end();
        v60;
    };
    const v62 = fs.readFile(filename, 'binary', v61);
    v62;
};
var app = server.createServer(serverHandler);
const v63 = process.env;
const v64 = v63.PORT;
const v65 = v64 || 9001;
const v66 = process.env;
const v67 = v66.IP;
const v68 = v67 || '0.0.0.0';
const v74 = function () {
    var addr = app.address();
    const v69 = addr.address;
    const v70 = v69 + ':';
    const v71 = addr.port;
    const v72 = v70 + v71;
    const v73 = console.log('Server listening at', v72);
    v73;
};
app = app.listen(v65, v68, v74);