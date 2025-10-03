var http = require('http');
var url = require('url');
var fs = require('fs');
const v28 = function (request, response) {
    const v16 = request.url;
    const v17 = url.parse(v16);
    const v18 = v17.pathname;
    var path = '.' + v18;
    const v19 = { 'content-type': 'text/html' };
    const v20 = response.writeHead('200', v19);
    v20;
    const v21 = response.write('<meta charset=\'utf-8\'>');
    v21;
    const v26 = function (error, file) {
        if (error) {
            const v22 = response.write('<strong>文件不存在</strong>');
            v22;
            const v23 = response.end();
            v23;
        } else {
            const v24 = response.write(file);
            v24;
            const v25 = response.end();
            v25;
        }
    };
    const v27 = fs.readFile(path, v26);
    v27;
};
const v29 = http.createServer(v28);
const v30 = v29.listen(8888);
v30;