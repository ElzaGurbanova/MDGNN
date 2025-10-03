var http = require('http');
var url = require('url');
var fs = require('fs');
const v30 = function (request, response) {
    const v17 = request.url;
    const v18 = url.parse(v17);
    const v19 = v18.pathname;
    var path = '.' + v19;
    const v20 = console.log(path);
    v20;
    const v21 = { 'content-type': 'text/html' };
    const v22 = response.writeHead('200', v21);
    v22;
    const v28 = function (error, file) {
        if (error) {
            const v23 = response.write('<meta charset=utf-8>');
            v23;
            const v24 = response.write('<strong>文件不存在</strong>  ');
            v24;
            const v25 = response.end();
            v25;
        } else {
            const v26 = response.write(file);
            v26;
            const v27 = response.end();
            v27;
        }
    };
    const v29 = fs.readFile(path, v28);
    v29;
};
const v31 = http.createServer(v30);
const v32 = v31.listen(8888);
v32;