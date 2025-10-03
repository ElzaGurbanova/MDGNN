var http = require('http');
var url = require('url');
var fs = require('fs');
const v36 = function (request, response) {
    const v20 = request.url;
    const v21 = url.parse(v20);
    const v22 = v21.pathname;
    var path = '.' + v22;
    const v23 = { 'content-type': 'text/html' };
    const v24 = response.writeHead('200', v23);
    v24;
    const v25 = response.write('<meta charset=utf-8>');
    v25;
    const v26 = '<em>' + path;
    const v27 = v26 + '</em>';
    const v28 = response.write(v27);
    v28;
    const v34 = function (error, file) {
        if (error) {
            const v29 = response.write('<mata charset=utf-8>');
            v29;
            const v30 = response.write('<strong>文件不存在</strong>');
            v30;
            const v31 = response.end();
            v31;
        } else {
            const v32 = response.write(file);
            v32;
            const v33 = response.end();
            v33;
        }
    };
    const v35 = fs.readFile(path, v34);
    v35;
};
const v37 = http.createServer(v36);
const v38 = v37.listen(8888);
v38;