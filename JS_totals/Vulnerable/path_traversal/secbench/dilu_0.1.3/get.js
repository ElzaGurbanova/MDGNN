/* 
 * get.js (proceed GET requests)
 *      __      __                  ____
 *     / /     / /         ________|  __|___
 *    / /     / /          \  _____   ______\ 
 *   / /____ / /_____      | | |___| |____|
 *  /_  __  \ \____  \     | |  ___\____/__
 *   | |  | |  _   | |     | | |  __   __  \ 
 *   | |__| | \ \  | |     | | | |__| |__| |
 *   |  __  |  \_\ | |     | | | |__| |__| |
 *   | |  | |   _  | |     | |_|___________|
 *   | |__| |  \ \_/ /     / /\  _   _   _  \
 *   \____  |   \   /     / /_| |_| |_| |_| /_
 *        \_/    \_/     /_/|_________________\
 *        
 * Created by Wu Shu on 2012-04-01
 * Copyright 2012, Wu Shu. All rights reserved.
 */

var url = require("url");
var path = require("path");
var fs = require("fs");
var mimetypes = require('./mimetypes.js');
var dirview = require('./dirview.js');
var error = require('./error.js');

var dilu_conf = null;

exports.tell = function (conf)
{
    dilu_conf = conf;
};

exports.proceed = function (req, res) {
    var eurl = decodeURI(req.url);
    var fpath = {
        "url" : eurl,
        "relative" : url.parse(eurl).pathname,
        "absolute" : path.join(dilu_conf.root, eurl)
    };
    
    fs.lstat(fpath.absolute, function(err, stats) {
        if (!err) {
            if (stats.isFile())
                response_file(fpath, stats, res);
            else if (stats.isDirectory())
                response_directory(fpath, stats, res);
            else
		error.response(res, 500, "Not a regular file!");
        } else {
            error.response(res, 404, "File not found.");
        }
    });
};

function response_file(fpath, stats, res) {
    var stream = fs.createReadStream(fpath.absolute);
    var ext = path.extname(fpath.absolute);
    if (ext == "")
        mime = null;
    else
        //mime = mimetypes.type_of_ext(ext).substr(1); // remove dot
        mime = mimetypes.type_of_ext(ext); // remove dot
    
    if (mime == null)
        mime = "text/plain;charset=utf-8";
    res.writeHeader(200, {
        "Content-Type" : mime,
        "Content-Length" : stats.size,
        "Server" : "Dilu/" + "0.1.2"//version
    });
    stream.pipe(res);
}

function hidden(fname) {
    if (fname.substr(0, 1) == ".")
        return true;
    return false;
}

function response_directory(fpath, stats, res) {
    var base = fpath.url;
    if (base.substr(base.length - 1) != "/")
        base = base + "/";

    fs.readdir(fpath.absolute, function(err, files) {
        if (!err) {
            var dv = new dirview.DirView();
            dv.init(fpath.absolute, base);
            
            for (file in files) {
                if (hidden(files[file]))
                    continue;
                dv.add_item(files[file]);
            }
            
            var html = dv.get_html();  // html is a Buffer object
            res.writeHeader(200, {
                "Content-Type" : "text/html",
                "Content-Length" : html.length,
                "Server" : "Dilu/" + "0.1.2"//version
            });
            res.write(html);
            res.end();
        } else
            error.response(res, 500, "Oops! Directory cannot be listed for unknown reason.");
    });
    return "ok";
}
