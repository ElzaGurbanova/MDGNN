
// var math=require("./math.js");
// var math=require("math.js");   /*当把模块放在node_modules文件夹下时，node_modules文件夹相当于包，默认就会去这个文件夹下找*/
//     math.math(1,3);
//     console.log(math.aa);


    var http=require("http");
    var url=require("url");
    var fs=require("fs");

    http.createServer(function (request,response) {
        // console.log(request.url);
        // response.end("aabbcc");   /*结束请求时输出*/

        var path="."+url.parse(request.url).pathname;
        console.log(path);        /*输出路径*/

        response.writeHead("200",{"content-type":"text/html"});
        // response.write("<meta charset=utf-8>");  /*这两句诗设置解析的方法*/
        // response.write("<em>斜体标签</em>");   /*输出*/

        fs.readFile(path,function (error,file) {          /*查找文件*/
            if(error){
                response.write("<meta charset=utf-8>");
                response.write("<strong>不存在粗体</strong>");
                response.end();
            }else{
                response.write(file);
                response.end();
            }
        })

        // response.end();     /*结束请求*/
    }).listen(8888);
