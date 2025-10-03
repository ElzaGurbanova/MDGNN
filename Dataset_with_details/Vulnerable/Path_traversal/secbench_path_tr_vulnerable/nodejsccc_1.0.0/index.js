/*包 模块*/
/*调理 轻松*/
/*模块  文件  ------内含各种功能*/
/*包  文件夹  含有各种模块*/

/*模块 功能发射-------*/
// var math=require("math.js");
// math.math(1,2);
// console.log(math.abc);
var http=require("http");
var url=require("url");
var fs=require("fs");
http.createServer(function(request,response){
    console.log(request.url);/*控制台输出*/
    response.writeHead("200",{"content-type":"text/html"});/*做出响应的头信息*/
    // response.write("<meta charset='utf-8'>");/*解析的编码方式*/
    // response.write("<em>斜体</em>");/*做出相应的内容*/
    // response.end();//结束请求，做出回应
    var path="."+url.parse(request.url).pathname;//前面加个“.”表示在本目录下寻找----否则回去node_modules中去找；
    //
    // response.write(path);
    fs.readFile(path,function(error,file){
        if(error){
            response.write("<meta charset=utf-8>");
            response.write("<strong>文件不存在</strong>");
            response.end();
        }else{
            response.write(file);
            response.end();
        }
    })
    // response.end();
}).listen(8888);
/*不要创建1024以下的端口 有安全问题*/
/*请求  输出*/
/*只有先创建并运行了这个服务，才能在浏览器打开*/

/*uri url uri代表资源  url代表查找资源的地址  狭义上的意思一样*/

/*npm adduser*/
/*npm install  下载*/
/*npm init 初始化*/
/*npm publish 上传*/
