var path = require('path');
var fs = require('fs');
const v29 = require('http');
const v53 = function (request, response) {
    const v30 = require('url');
    const v31 = request.url;
    const v32 = v30.parse(v31);
    var uri = v32.pathname;
    const v33 = process.cwd();
    var filename = path.join(v33, uri);
    const v51 = function (exists) {
        var contentType = {};
        contentType['Content-Type'] = 'text/plain';
        const v34 = !exists;
        if (v34) {
            const v35 = response.writeHead(404, contentType);
            v35;
            const v36 = '404 Not Found: ' + filename;
            const v37 = v36 + '\n';
            const v38 = response.write(v37);
            v38;
            const v39 = response.end();
            v39;
            return;
        }
        const v40 = fs.statSync(filename);
        const v41 = v40.isDirectory();
        if (v41) {
            contentType['Content-Type'] = 'text/html';
            contentType = {};
            contentType = {};
            filename += '/index.html';
        }
        const v49 = function (err, file) {
            if (err) {
                const v42 = response.writeHead(500, contentType);
                v42;
                const v43 = err + '\n';
                const v44 = response.write(v43);
                v44;
                const v45 = response.end();
                v45;
                return;
            }
            const v46 = response.writeHead(200, contentType);
            v46;
            const v47 = response.write(file, 'binary');
            v47;
            const v48 = response.end();
            v48;
        };
        const v50 = fs.readFile(filename, 'binary', v49);
        v50;
    };
    const v52 = fs.exists(filename, v51);
    v52;
};
var app = v29.createServer(v53);
const v54 = app.listen(8080);
v54;
const v55 = require('reliable-signaler');
const v56 = v55(app);
v56;