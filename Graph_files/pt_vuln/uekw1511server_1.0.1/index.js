var http = require('http');
var path = require('path');
var fs = require('fs');
const v22 = function (request, response) {
    const v13 = request.url;
    var relpath = path.join('html', v13);
    const v20 = function (error) {
        const v14 = !error;
        if (v14) {
            const v15 = response.end('this file is not find');
            v15;
        } else {
            const v18 = function (err, file) {
                const v16 = response.write(file);
                v16;
                const v17 = response.end();
                v17;
            };
            const v19 = fs.readFile(relpath, v18);
            v19;
        }
    };
    const v21 = fs.exists(relpath, v20);
    v21;
};
const v23 = http.createServer(v22);
const v24 = v23.listen('8888');
v24;