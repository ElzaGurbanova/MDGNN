var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var port = 8000;
var cwd = process.cwd();
var logging = false;
var i = 0;
const v53 = process.argv;
const v54 = v53.length;
let v55 = i < v54;
while (v55) {
    const v57 = process.argv;
    var arg = v57[i];
    switch (arg) {
    case '-port':
    case '-p':
        const v58 = process.argv;
        const v59 = i + 1;
        port = v58[v59];
        break;
    case '-dir':
    case '-d':
        const v60 = process.argv;
        const v61 = i + 1;
        cwd = v60[v61];
        break;
    case '-log':
    case '-l':
        logging = true;
        break;
    default:
        break;
    }
    const v56 = i++;
    v55 = i < v54;
}
const v100 = function (request, response) {
    const v62 = request.url;
    const v63 = url.parse(v62);
    var uri = v63.pathname;
    var filename = path.join(cwd, uri);
    if (logging) {
        const v64 = console.log('Request for', uri);
        v64;
    }
    const v98 = function (exists) {
        const v65 = !exists;
        if (v65) {
            const v66 = { 'Content-Type': 'text/plain' };
            const v67 = response.writeHead(404, v66);
            v67;
            const v68 = response.write('404 Not Found\n');
            v68;
            const v69 = response.end();
            v69;
            return;
        }
        const v70 = fs.statSync(filename);
        const v71 = v70.isDirectory();
        if (v71) {
            var output = '<html><body>';
            var files = fs.readdirSync(filename);
            let f;
            for (f in files) {
                const v72 = uri != '/';
                if (v72) {
                    const v73 = '<a href="' + uri;
                    const v74 = v73 + '/';
                    const v75 = files[f];
                    const v76 = v74 + v75;
                    const v77 = v76 + '">';
                    const v78 = files[f];
                    const v79 = v77 + v78;
                    output += v79 + '</a>';
                } else {
                    const v80 = files[f];
                    const v81 = '<a href="/' + v80;
                    const v82 = v81 + '">';
                    const v83 = files[f];
                    const v84 = v82 + v83;
                    output += v84 + '</a>';
                }
                output += '<br />';
            }
            output += '</body></html>';
            const v85 = response.writeHead(200);
            v85;
            const v86 = response.write(output);
            v86;
            const v87 = response.end();
            v87;
        } else {
            const v96 = function (err, file) {
                if (err) {
                    const v88 = { 'Content-Type': 'text/plain' };
                    const v89 = response.writeHead(500, v88);
                    v89;
                    const v90 = err + '\n';
                    const v91 = response.write(v90);
                    v91;
                    const v92 = response.end();
                    v92;
                    return;
                }
                const v93 = response.writeHead(200);
                v93;
                const v94 = response.write(file, 'binary');
                v94;
                const v95 = response.end();
                v95;
            };
            const v97 = fs.readFile(filename, 'binary', v96);
            v97;
        }
    };
    const v99 = fs.exists(filename, v98);
    v99;
};
const v101 = http.createServer(v100);
const v102 = parseInt(port, 10);
const v103 = v101.listen(v102);
v103;
const v104 = console.log('Listening on port', port, 'serving folder', cwd);
v104;