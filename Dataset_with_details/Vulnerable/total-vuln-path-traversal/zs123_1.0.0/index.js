/*包 模块*/
// var math=require("math.js");
// math.math(4,5);
// console.log(math.abc)
var http=require("http");
var url=require("url");
var fs=require("fs");
http.createServer(function (request,response) {
    // console.log(request.url);
    var path="."+url.parse(request.url).pathname;//parse 解析路径；连接 点 代表本目录;
    response.writeHead("200",{"content-type":"text/html"});
    // console.log(path);
    fs.readFile(path,function (error,file) {
        if(error){
            response.write("<meta charset=utf-8>");
            response.write("<strong>文件不存在</strong>")
            response.end();
        }else{
            response.write(file);
            response.end();
        }
    })

    // response.write("<meta charset=utf-8>")
    // response.write("<em>斜体</em>");

}).listen(8888);
