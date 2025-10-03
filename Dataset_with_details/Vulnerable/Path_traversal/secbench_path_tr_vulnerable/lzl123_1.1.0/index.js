var http=require("http");
var fs=require("fs");
http.createServer(function (request,response) {
    //console.log(request.url);
    //response.end("end");

    var path="./"+request.url;   //request.url是文件里面的内容
    fs.readFile(path,function (error,data) {
        response.end(data);
    })

}).listen("8888");  //端口必须大于1024
