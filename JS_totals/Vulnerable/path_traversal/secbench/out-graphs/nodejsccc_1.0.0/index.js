var http = require('http');
var url = require('url');
var fs = require('fs');
const v32 = function (request, response) {
    const v18 = request.url;
    const v19 = console.log(v18);
    v19;
    const v20 = { 'content-type': 'text/html' };
    const v21 = response.writeHead('200', v20);
    v21;
    const v22 = request.url;
    const v23 = url.parse(v22);
    const v24 = v23.pathname;
    var path = '.' + v24;
    const v30 = function (error, file) {
        if (error) {
            const v25 = response.write('<meta charset=utf-8>');
            v25;
            const v26 = response.write('<strong>文件不存在</strong>');
            v26;
            const v27 = response.end();
            v27;
        } else {
            const v28 = response.write(file);
            v28;
            const v29 = response.end();
            v29;
        }
    };
    const v31 = fs.readFile(path, v30);
    v31;
};
const v33 = http.createServer(v32);
const v34 = v33.listen(8888);
v34;