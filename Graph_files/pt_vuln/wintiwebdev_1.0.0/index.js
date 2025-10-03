var express = require('express');
var app = express();
var fs = require('fs');
const v18 = function (req, res, next) {
    const v16 = console.log('hallo welt');
    v16;
    const v17 = next();
    v17;
};
const v19 = app.use(v18);
v19;
const v28 = function (req, res, next) {
    const v20 = req.url;
    const v21 = v20 == '/favicon.ico';
    if (v21) {
        const v22 = res.end();
        return v22;
    }
    const v23 = process.cwd();
    const v24 = req.url;
    var path = v23 + v24;
    const v25 = console.log('hallo nochmals', path);
    v25;
    const v26 = fs.createReadStream(path);
    const v27 = v26.pipe(res);
    v27;
};
const v29 = app.use(v28);
v29;
const v30 = app.listen(8000);
v30;