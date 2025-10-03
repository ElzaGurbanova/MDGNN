var http = require('http');
var fs = require('fs');
const v19 = function (req, res) {
    const v11 = req.url;
    const v12 = v11 != '/favicon.ico';
    if (v12) {
        const v13 = req.url;
        var url = '.' + v13;
        const v17 = function (err, data) {
            if (err) {
                const v14 = res.write('current url is not find');
                v14;
            } else {
                const v15 = res.write(data);
                v15;
            }
            const v16 = res.end();
            v16;
        };
        const v18 = fs.readFile(url, v17);
        v18;
    }
};
const v20 = http.createServer(v19);
var server = v20.listen(10000);