var url = require('url');
var fs = require('fs');
const url2parse = function (url_str) {
    var urlObj = url.parse(url_str);
    var path = urlObj.path;
    return path;
};
const v14 = function (parent_path) {
    const v13 = function (req, res, next) {
        const v8 = req.url;
        var path = url2parse(v8);
        const callback = function (err, data) {
            if (err) {
                res.status = 404;
            } else {
                const v9 = res.write(data);
                v9;
            }
            const v10 = res.end();
            v10;
        };
        const v11 = parent_path + path;
        const v12 = fs.readFile(v11, callback);
        v12;
    };
    return v13;
};
module.exports = v14;