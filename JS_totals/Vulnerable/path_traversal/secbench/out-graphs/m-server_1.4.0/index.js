var http = require('http');
var fs = require('fs');
var rootPath = process.cwd();
var path = require('path');
var utils = require('./utils');
const HttpServer = function (option) {
    const v104 = function (req, res) {
        const v71 = req.url;
        var targetPath = path.join(rootPath, v71);
        const v72 = fs.existsSync(targetPath);
        if (v72) {
            var targetType = fs.lstatSync(targetPath);
            const v73 = targetType.isFile();
            if (v73) {
                const v74 = fs.readFileSync(targetPath);
                const v75 = res.end(v74);
                v75;
            } else {
                const v76 = targetType.isDirectory();
                if (v76) {
                    const v92 = function (error, list) {
                        if (error) {
                            const v77 = console.log(error);
                            v77;
                            const v78 = error.toString();
                            const v79 = res.end(v78);
                            v79;
                        }
                        var dirs = [];
                        var files = [];
                        const v85 = function (val) {
                            const v80 = path.join(targetPath, val);
                            var file = fs.lstatSync(v80);
                            const v81 = file.isFile();
                            if (v81) {
                                const v82 = files.push(val);
                                v82;
                            } else {
                                const v83 = file.isDirectory();
                                if (v83) {
                                    const v84 = dirs.push(val);
                                    v84;
                                }
                            }
                        };
                        const v86 = list.forEach(v85);
                        v86;
                        const v87 = res.writeHead(200);
                        v87;
                        const v88 = req.url;
                        const v89 = utils.render(v88, dirs, files);
                        const v90 = res.write(v89);
                        v90;
                        const v91 = res.end();
                        v91;
                    };
                    const v93 = fs.readdir(targetPath, v92);
                    v93;
                } else {
                    const v94 = res.end('error');
                    v94;
                }
            }
        } else {
            const v95 = { 'Content-Type': 'text/plain' };
            const v96 = res.writeHead(404, v95);
            v96;
            const v97 = res.end('not found');
            v97;
        }
        const v99 = function (e) {
            const v98 = console.log(e);
            v98;
        };
        const v100 = req.on('error', v99);
        v100;
        const v102 = function (e) {
            const v101 = console.log(e);
            v101;
        };
        const v103 = res.on('error', v102);
        v103;
    };
    var server = http.createServer(v104);
    const v105 = option.port;
    const v132 = function () {
        var print = [];
        const v106 = print.push('-------------------------------------------------------------');
        v106;
        const v107 = option.port;
        const v108 = 'Mini http server running on port ' + v107;
        const v109 = v108 + ' !';
        const v110 = print.push(v109);
        v110;
        const v111 = print.push('You can open the floowing urls to view files.');
        v111;
        const v112 = utils.getIP();
        const v119 = function (val) {
            const v113 = '\x1B[32m' + val;
            const v114 = v113 + ':';
            const v115 = option.port;
            const v116 = v114 + v115;
            const v117 = v116 + '\x1B[0m';
            const v118 = print.push(v117);
            v118;
        };
        const v120 = v112.forEach(v119);
        v120;
        const v121 = print.push('Have fun ^_^');
        v121;
        const v122 = print.push('-------------------------------------------------------------');
        v122;
        var prev = '\t';
        var length = print.length;
        const v130 = function (val, ind) {
            const v123 = ind === 0;
            const v124 = length - 1;
            const v125 = ind === v124;
            const v126 = v123 || v125;
            if (v126) {
                const v127 = console.log(val);
                v127;
            } else {
                const v128 = prev + val;
                const v129 = console.log(v128);
                v129;
            }
        };
        const v131 = print.forEach(v130);
        v131;
    };
    const v133 = server.listen(v105, v132);
    v133;
    const v135 = function (e) {
        const v134 = console.log(e);
        v134;
    };
    const v136 = server.on('error', v135);
    v136;
    return server;
};
const v140 = function (option) {
    var defaultOption = {};
    defaultOption.port = 7000;
    var envOption = {};
    const v137 = utils.parseArg(envOption);
    v137;
    const v138 = {};
    var httpOption = utils.assign(v138, defaultOption, envOption, option);
    const v139 = new HttpServer(httpOption);
    return v139;
};
exports.createServer = v140;
exports.HttpServer = HttpServer;