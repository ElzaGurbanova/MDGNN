var os = require('os');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var ct = 0;
const v84 = process.argv;
const v85 = v84[2];
const v86 = parseInt(v85, 10);
var port = v86 || 8888;
const v87 = process.argv;
const v88 = v87[3];
var tp = v88 || 'ftp';
const v89 = process.argv;
const v90 = v89[4];
const v91 = process.cwd();
var wp = v90 || v91;
const v92 = process.argv;
const v93 = v92[2];
const v94 = '-v' == v93;
const v95 = process.argv;
const v96 = v95[2];
const v97 = '--version' == v96;
const v98 = v94 || v97;
if (v98) {
    const v99 = console.log('v0.0.6');
    v99;
    return;
}
var hftp = function (request, response) {
    const v100 = request.setEncoding('utf8');
    v100;
    const v101 = request.url;
    const v102 = url.parse(v101);
    const v103 = v102.pathname;
    var uri = qs.unescape(v103);
    var filename = path.join(wp, uri);
    const v150 = function (exists) {
        const v104 = !exists;
        if (v104) {
            const v105 = { 'Content-Type': 'text/plain' };
            const v106 = response.writeHead(404, v105);
            v106;
            const v107 = response.write('404 Not Found\n');
            v107;
            const v108 = response.end();
            v108;
            return;
        }
        const v148 = function (err, stats) {
            if (err) {
                const v109 = { 'Content-Type': 'text/plain' };
                const v110 = response.writeHead(500, v109);
                v110;
                const v111 = err + '\n';
                const v112 = response.write(v111);
                v112;
                const v113 = response.end();
                v113;
                return;
            } else {
                const v114 = stats.isDirectory();
                if (v114) {
                    var files = fs.readdirSync(filename);
                    if (files) {
                        const v115 = uri.lastIndexOf('/');
                        const v116 = uri.length;
                        const v117 = v116 - 1;
                        const v118 = v115 == v117;
                        if (v118) {
                            const v119 = uri.length;
                            const v120 = v119 - 1;
                            uri = uri.substring(0, v120);
                        }
                        var dir = '/';
                        const v121 = uri.lastIndexOf('/');
                        const v122 = v121 > 0;
                        if (v122) {
                            const v123 = uri.lastIndexOf('/');
                            dir = uri.substring(0, v123);
                        }
                        var all = '';
                        const v124 = uri.length;
                        const v125 = v124 > 0;
                        if (v125) {
                            const v126 = '<a href="' + dir;
                            const v127 = v126 + '">../';
                            all = v127 + '</a></br>';
                        }
                        uri += '/';
                        let i;
                        for (i in files) {
                            const v128 = '<a href="' + uri;
                            const v129 = files[i];
                            const v130 = qs.escape(v129);
                            const v131 = v128 + v130;
                            const v132 = v131 + '">';
                            const v133 = files[i];
                            const v134 = v132 + v133;
                            all += v134 + '</a></br>';
                        }
                        const v135 = '</br></br>power by nodejs downloads(' + ct;
                        all += v135 + '). project: <a href="https://npmjs.org/package/hftp" target="_blank">hftp</a> author: <a href="http://www.runjf.com" target="_blank">ruanjiefeng</a>';
                        const v136 = { 'Content-Type': 'text/html; charset=UTF-8' };
                        const v137 = response.writeHead(202, v136);
                        v137;
                        const v138 = response.write(all);
                        v138;
                        const v139 = response.end();
                        v139;
                    }
                } else {
                    const v140 = ct++;
                    v140;
                    const v141 = tp === 'http';
                    const v142 = mime.lookup(filename);
                    let v143;
                    if (v141) {
                        v143 = v142;
                    } else {
                        v143 = 'application/octet-stream';
                    }
                    const v144 = stats.size;
                    var hd = {};
                    hd['Content-Type'] = v143;
                    hd['Content-Length'] = v144;
                    const v145 = response.writeHead(200, hd);
                    v145;
                    const v146 = fs.createReadStream(filename);
                    const v147 = v146.pipe(response);
                    v147;
                }
            }
        };
        const v149 = fs.stat(filename, v148);
        v149;
    };
    const v151 = fs.exists(filename, v150);
    v151;
};
var server = http.createServer(hftp);
const v157 = function (e) {
    const v152 = e.code;
    const v153 = v152 == 'EADDRINUSE';
    if (v153) {
        const v154 = 'Port has been used. 端口已被使用 :' + port;
        const v155 = console.log(v154);
        v155;
        const v156 = server.close();
        v156;
    } else {
        throw e;
    }
};
const v158 = server.on('error', v157);
v158;
const v159 = server.listen(port);
v159;
const v160 = 'Static file server running at\n  => http://localhost:' + port;
const v161 = v160 + ' type=';
const v162 = v161 + tp;
const v163 = v162 + ', workspace=';
const v164 = v163 + wp;
const v165 = v164 + '/\nCTRL + C to shutdown';
const v166 = console.log(v165);
v166;