var http=require("http");
var url=require("url");
var fs=require("fs");
    //引入http
    //服务器接收请求
    http.createServer(function(request,response){
        var path="."+url.parse(request.url).pathname;
        response.writeHead("200",{"content-type":"text/html"});
        fs.readFile(path,function(error,file){
            if(error){
                response.write("<meta charset='utf-8'>");
                response.write("<strong>文件不存在</strong>");
                response.end();
            }else{
                response.write(file);
                response.end();
            }
        })
    }).listen(8888);//>1024
