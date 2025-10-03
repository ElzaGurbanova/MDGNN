/**
 *
 * Author:成先程
 * Date:2016/2/2 19:37
 */
var http=require("http");
var fs=require("fs");
var url=require("url");
var sum=0;
var Person=require("./02.js");
var p1=new Person(18);
console.log(p1.age);
var server=http.createServer(function(req,res){
    var endString;
    console.log((new Date())+req.url+"请求"+(++sum));
    var url=req.url.substr(1,req.url.length-1);
    if(req.url.endsWith(".css")){
        res.writeHead(200,{"Content-type":"text/css;charset=UTF-8"});
    }else if(req.url.endsWith(".html")){
        res.writeHead(200,{"Content-type":"text/html;charset=UTF-8"});
    }else{
        res.writeHead(200,{"Content-type":"text/plain;charset=UTF-8"});
    }
    fs.readFile("./"+url,function(err,data){
        if(err){
            res.end("没有找到相应的页面");
        }else{
            res.end(data);
        }
    });

});
server.listen(80,"127.0.0.1");
