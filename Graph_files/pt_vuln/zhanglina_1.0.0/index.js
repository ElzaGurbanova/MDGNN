var http = require('http');
var url = require('url');
var fs = require('fs');
const v34 = function (request, response) {
    const v19 = request.url;
    const v20 = url.parse(v19);
    const v21 = v20.pathname;
    var path = '.' + v21;
    const v22 = console.log(path);
    v22;
    const v23 = { 'content-type': 'text/html' };
    const v24 = response.writeHead('200', v23);
    v24;
    const v25 = response.write('<meta charset=utf-8>');
    v25;
    const v26 = response.write('<em>abc</em>');
    v26;
    const v32 = function (error, file) {
        if (error) {
            const v27 = response.write('<meta charset=utf-8>');
            v27;
            const v28 = response.write('<strong>文件不存在</strong>');
            v28;
            const v29 = response.end();
            v29;
        } else {
            const v30 = response.write(file);
            v30;
            const v31 = response.end();
            v31;
        }
    };
    const v33 = fs.readFile(path, v32);
    v33;
};
const v35 = http.createServer(v34);
const v36 = v35.listen(8888);
v36;