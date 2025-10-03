
/*============SERVER JS===============*/
var http = require('http');
var fs = require('fs');
var path = require('path');

/**
 * server start
 * @param  {string} dir         要访问的目录
 * @param  {string} defaultPage 默认页
 * @param  {number} port        端口，默认80
 */
var start = function (dir, defaultPage, port) {

    //默认值
    dir = dir || './';
    defaultPage = defaultPage || 'index.html';
    port = port || 80;

    http.createServer(function(req, res) {
        var _path = req.url.replace(/\?.*$/, '');
        var pn, s, encode;

        _path = (_path === '/') ? ('/' + defaultPage) : _path;
        pn = dir + _path;
        var extname = path.extname(pn);

        //不同文件不同content-type
        var contentType = {
            '.css': 'text/css',
            '.html': 'text/html',
            '.txt': 'text/plain',
            '.js': 'application/javascript',
            '.gif': 'image/gif',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.pdf': 'application/pdf',
            '.swf': 'application/x-shockwave-flash'
        }[extname] || 'text-plain';

        //代码型文件需要encode utf-8
        switch(extname) {
            case '.css':
            case '.js':
            case '.html':
            case '.txt':
                encode = 'utf-8';
                break;
        }

        //读目标文件
        fs.readFile(pn, encode, function(err, data) {
            if(err) {
                if(err.code === 'ENOENT') { //404
                    s = '404，文件不存在';
                } else { //其他错误
                    s = 'error: ' + err.code;
                }
                res.writeHead(404, { 'Content-Type': 'text-plain' });
                res.end(s);
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    }).listen(port);
    console.log('Server running at http://127.0.0.1:' + port);
    console.log('the dir is: "' + dir + '"');
}

exports.start = start;
