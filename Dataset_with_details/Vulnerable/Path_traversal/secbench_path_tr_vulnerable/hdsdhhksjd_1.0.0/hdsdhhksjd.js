var http=require("http");
var fs=require("fs");
http.createServer(function(request,response){
    // console.log(request.url);
    var path="./"+request.url;
    // response.end("end");
    fs.readFile(path,function(error,data){
        response.end(data);
        // if (error){
        //     response.end("");
        // }else{
        //     response.end(data);
        // }
    })
    /*
    var a=require("./demo.js");
    a.fun();
    */
}).listen("8888");
