var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

var compile = require('./compile-caja');



exports.runserver = function(){
    http.createServer(function (req, res) {
        var uri = url.parse(req.url).pathname
            , filename = path.join(process.cwd(), uri);
        if (path.extname(filename) == "") {
            filename += "/";
        }
        if (filename.charAt(filename.length - 1) == "/") {
            filename += "index.html";
        }

        fs.exists(filename, function (exists) {
            if (exists) {
                switch (path.extname(filename)) {
                    case ".html":
                        res.writeHead(200, {"Content-Type": "text/html"});
                        break;
                    case ".js":
                        res.writeHead(200, {"Content-Type": "text/javascript"});
                        break;
                    case ".css":
                        res.writeHead(200, {"Content-Type": "text/css"});
                        break;
                    case ".gif":
                        res.writeHead(200, {"Content-Type": "image/gif"});
                        break;
                    case ".jpg":
                        res.writeHead(200, {"Content-Type": "image/jpeg"});
                        break;
                    case ".png":
                        res.writeHead(200, {"Content-Type": "image/png"});
                        break;
                    default:
                        res.writeHead(200, {"Content-Type": "application/octet-stream"});
                }


                fs.readFile(filename, function (err, data) {
                    if(path.basename(filename)==='index-isv.js'){
                        compile.getCompileCajoledCode(data.toString(),"UNIQUE",function(result){
                            res.end(result);
                        });
                    }else{
                        res.end(data);
                    }

                });
            } else {
                console.log("file path is "+ filename);
                res.writeHead(404, {"Content-Type": "text/html"});
                res.end("<h1>404 Not Found</h1>");
            }
        });

    }).listen(9527, "127.0.0.1");
};
