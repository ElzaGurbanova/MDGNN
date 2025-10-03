// static file server
var http = require("http");

http.createServer(function (req, res) {
    var fs = require('fs');
    console.log(req.url);
    file = req.url.slice(1);
    fs.readFile(file, 'utf-8', function(err, data) {
        if(err || file === "") {
            file = file || "./";
            fs.readdir(file, function(err, data) {
                if (err) {
                    res.writeHead(404);
                    res.write("file not found.");
                    res.end();
                } else {
                    var html = "";
                    html += '<ul>';
                    for (var i = data.length - 1; i >= 0; i--) {
                        html += '<li><a href="' + (req.url === '/' ? '' : req.url) + '/' + data[i] + '">' + data[i] + '</a></li>';
                    };
                    html += '</ul>';
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.end(html);
                }
            });
        } else {
            res.writeHead(200);
            res.write(data.toString());
            res.end();
        }
    });
}).listen(3000);

console.log("http server is listening at port 3000");
