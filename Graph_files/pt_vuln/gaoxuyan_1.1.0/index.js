var http = require('http');
var fs = require('fs');
const v10 = function (request, response) {
    var path = request.url;
    const v8 = function (error, data) {
        const v7 = response.end(data);
        v7;
    };
    const v9 = fs.readFile(path, v8);
    v9;
};
const v11 = http.createServer(v10);
const v12 = v11.listen('8888');
v12;