var fs = require('fs');
var http = require('http');
var url = require('url');
const v45 = String.prototype;
const v48 = function (prefix) {
    const v46 = this.indexOf(prefix);
    const v47 = v46 == 0;
    return v47;
};
v45.startsWith = v48;
const v49 = console.log('Starting server on port 8080');
v49;
const v86 = function (req, res) {
    const v50 = req.url;
    var urlObj = url.parse(v50, true);
    const v51 = urlObj.pathname;
    const v52 = v51.search('getcity');
    const v53 = v52 > 0;
    if (v53) {
        const v54 = urlObj.query;
        const v55 = v54['q'];
        var prefix = v55.toLowerCase();
        const v56 = res.writeHead(200);
        v56;
        const v57 = __dirname + '/html/cities.dat.txt';
        const v72 = function (err, data) {
            if (err) {
                const v58 = res.writeHead(404);
                v58;
                const v59 = JSON.stringify(err);
                const v60 = res.end(v59);
                v60;
                return;
            }
            const v61 = res.writeHead(200);
            v61;
            var cities = [];
            const v62 = data.toString();
            const v63 = v62.split('\n');
            const v68 = function (element) {
                const v64 = element.toLowerCase();
                const v65 = v64.startsWith(prefix);
                if (v65) {
                    const v66 = { city: element };
                    const v67 = cities.push(v66);
                    v67;
                }
            };
            const v69 = v63.forEach(v68);
            v69;
            const v70 = JSON.stringify(cities);
            const v71 = res.end(v70);
            v71;
        };
        const v73 = fs.readFile(v57, v72);
        v73;
    } else {
        const v74 = process.argv;
        const v75 = v74[2];
        const v76 = __dirname + '/html';
        var directory = v75 || v76;
        const v77 = urlObj.pathname;
        const v78 = directory + v77;
        const v84 = function (err, data) {
            if (err) {
                const v79 = res.writeHead(404);
                v79;
                const v80 = JSON.stringify(err);
                const v81 = res.end(v80);
                v81;
                return;
            }
            const v82 = res.writeHead(200);
            v82;
            const v83 = res.end(data);
            v83;
        };
        const v85 = fs.readFile(v78, v84);
        v85;
    }
};
const v87 = http.createServer(v86);
const v88 = v87.listen(8080);
v88;