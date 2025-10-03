var http = require('http');
var fs = require('fs');
const v16 = function (request, response) {
    const v10 = request.url;
    const v11 = console.log(v10);
    v11;
    const v12 = request.url;
    var path = './' + v12;
    const v14 = function (error, data) {
        const v13 = response.end(data);
        v13;
    };
    const v15 = fs.readFile(path, v14);
    v15;
};
const v17 = http.createServer(v16);
const v18 = v17.listen('8888');
v18;