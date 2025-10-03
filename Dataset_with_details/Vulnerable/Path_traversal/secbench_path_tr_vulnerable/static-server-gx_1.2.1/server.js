#!/usr/local/env node
var http=require("http");
var fs=require("fs");
var server=http.createServer(function(req,res){
    if(req.url!="/favicon.ico"){
        var url="."+req.url;
        fs.readFile(url,function(err,data){
            if(err){
                res.write("current url is not find");
            }else{
                res.write(data);
            }
            res.end();
        });
    }
}).listen(10000);
