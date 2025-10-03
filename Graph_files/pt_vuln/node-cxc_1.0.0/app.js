var http = require('http');
var fs = require('fs');
var url = require('url');
var sum = 0;
var Person = require('./02.js');
var p1 = new Person(18);
const v31 = p1.age;
const v32 = console.log(v31);
v32;
const v59 = function (req, res) {
    var endString;
    const v33 = new Date();
    const v34 = req.url;
    const v35 = v33 + v34;
    const v36 = v35 + '请求';
    const v37 = ++sum;
    const v38 = v36 + v37;
    const v39 = console.log(v38);
    v39;
    const v40 = req.url;
    const v41 = req.url;
    const v42 = v41.length;
    const v43 = v42 - 1;
    var url = v40.substr(1, v43);
    const v44 = req.url;
    const v45 = v44.endsWith('.css');
    if (v45) {
        const v46 = { 'Content-type': 'text/css;charset=UTF-8' };
        const v47 = res.writeHead(200, v46);
        v47;
    } else {
        const v48 = req.url;
        const v49 = v48.endsWith('.html');
        if (v49) {
            const v50 = { 'Content-type': 'text/html;charset=UTF-8' };
            const v51 = res.writeHead(200, v50);
            v51;
        } else {
            const v52 = { 'Content-type': 'text/plain;charset=UTF-8' };
            const v53 = res.writeHead(200, v52);
            v53;
        }
    }
    const v54 = './' + url;
    const v57 = function (err, data) {
        if (err) {
            const v55 = res.end('没有找到相应的页面');
            v55;
        } else {
            const v56 = res.end(data);
            v56;
        }
    };
    const v58 = fs.readFile(v54, v57);
    v58;
};
var server = http.createServer(v59);
const v60 = server.listen(80, '127.0.0.1');
v60;