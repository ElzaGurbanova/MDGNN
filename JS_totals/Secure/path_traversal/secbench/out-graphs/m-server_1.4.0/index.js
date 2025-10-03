var http = require('http');
var fs = require('fs');
var rootPath = process.cwd();
var path = require('path');
var utils = require('./utils');
const HttpServer = function (option) {
    const v108 = function (req, res) {
        const v73 = req.url;
        var requestPath = path.join(rootPath, v73);
        var targetPath;
        const v74 = utils.allowPath(requestPath, rootPath);
        const v75 = !v74;
        if (v75) {
            targetPath = rootPath;
            req.url = '/';
        } else {
            targetPath = requestPath;
        }
        const v76 = fs.existsSync(targetPath);
        if (v76) {
            var targetType = fs.lstatSync(targetPath);
            const v77 = targetType.isFile();
            if (v77) {
                const v78 = fs.readFileSync(targetPath);
                const v79 = res.end(v78);
                v79;
            } else {
                const v80 = targetType.isDirectory();
                if (v80) {
                    const v96 = function (error, list) {
                        if (error) {
                            const v81 = console.log(error);
                            v81;
                            const v82 = error.toString();
                            const v83 = res.end(v82);
                            v83;
                        }
                        var dirs = [];
                        var files = [];
                        const v89 = function (val) {
                            const v84 = path.join(targetPath, val);
                            var file = fs.lstatSync(v84);
                            const v85 = file.isFile();
                            if (v85) {
                                const v86 = files.push(val);
                                v86;
                            } else {
                                const v87 = file.isDirectory();
                                if (v87) {
                                    const v88 = dirs.push(val);
                                    v88;
                                }
                            }
                        };
                        const v90 = list.forEach(v89);
                        v90;
                        const v91 = res.writeHead(200);
                        v91;
                        const v92 = req.url;
                        const v93 = utils.render(v92, dirs, files);
                        const v94 = res.write(v93);
                        v94;
                        const v95 = res.end();
                        v95;
                    };
                    const v97 = fs.readdir(targetPath, v96);
                    v97;
                } else {
                    const v98 = res.end('error');
                    v98;
                }
            }
        } else {
            const v99 = { 'Content-Type': 'text/plain' };
            const v100 = res.writeHead(404, v99);
            v100;
            const v101 = res.end('not found');
            v101;
        }
        const v103 = function (e) {
            const v102 = console.log(e);
            v102;
        };
        const v104 = req.on('error', v103);
        v104;
        const v106 = function (e) {
            const v105 = console.log(e);
            v105;
        };
        const v107 = res.on('error', v106);
        v107;
    };
    var server = http.createServer(v108);
    const v109 = option.port;
    const v136 = function () {
        var print = [];
        const v110 = print.push('-------------------------------------------------------------');
        v110;
        const v111 = option.port;
        const v112 = 'Mini http server running on port ' + v111;
        const v113 = v112 + ' !';
        const v114 = print.push(v113);
        v114;
        const v115 = print.push('You can open the floowing urls to view files.');
        v115;
        const v116 = utils.getIP();
        const v123 = function (val) {
            const v117 = '\x1B[32m' + val;
            const v118 = v117 + ':';
            const v119 = option.port;
            const v120 = v118 + v119;
            const v121 = v120 + '\x1B[0m';
            const v122 = print.push(v121);
            v122;
        };
        const v124 = v116.forEach(v123);
        v124;
        const v125 = print.push('Have fun ^_^');
        v125;
        const v126 = print.push('-------------------------------------------------------------');
        v126;
        var prev = '\t';
        var length = print.length;
        const v134 = function (val, ind) {
            const v127 = ind === 0;
            const v128 = length - 1;
            const v129 = ind === v128;
            const v130 = v127 || v129;
            if (v130) {
                const v131 = console.log(val);
                v131;
            } else {
                const v132 = prev + val;
                const v133 = console.log(v132);
                v133;
            }
        };
        const v135 = print.forEach(v134);
        v135;
    };
    const v137 = server.listen(v109, v136);
    v137;
    const v139 = function (e) {
        const v138 = console.log(e);
        v138;
    };
    const v140 = server.on('error', v139);
    v140;
    return server;
};
const v144 = function (option) {
    var defaultOption = {};
    defaultOption.port = 7000;
    var envOption = {};
    const v141 = utils.parseArg(envOption);
    v141;
    const v142 = {};
    var httpOption = utils.assign(v142, defaultOption, envOption, option);
    const v143 = new HttpServer(httpOption);
    return v143;
};
exports.createServer = v144;
exports.HttpServer = HttpServer;