var http = require('http');
var fs = require('fs');
const v85 = require('./tool/httpHeader');
var header = v85.contentType;
const v86 = require('./router');
var route = v86.response;
var conf = require('./config');
const responseTemp = function (response, head, file) {
    const v87 = response.writeHead(200, head);
    v87;
    const v88 = response.write(file);
    v88;
    const v89 = response.end();
    v89;
};
;
const error = function (response, text) {
    const v90 = { 'Content-Type': 'text/html;charset:utf-8' };
    const v91 = response.writeHead(500, v90);
    v91;
    const v92 = text || 'Can\'t find domain config!';
    const v93 = '<h2>Server Error</h2><p>Error in api or template config about this domain</p><p>' + v92;
    const v94 = v93 + '</p>';
    const v95 = response.write(v94);
    v95;
    const v96 = response.end();
    v96;
};
const start = function (config) {
    const v97 = conf.constant;
    var host = v97.host;
    if (config) {
        conf.serv = config;
    }
    const onRequest = function (request, response) {
        let key;
        const v98 = conf.serv;
        for (key in v98) {
            const v99 = request.headers;
            const v100 = v99.host;
            const v101 = v100.indexOf(key);
            const v102 = -1;
            const v103 = v101 !== v102;
            if (v103) {
                const v104 = conf.serv;
                host = v104[key];
            }
        }
        const v105 = host.frondend;
        const v106 = request.url;
        const v107 = v106.replace('/', '');
        const v108 = host.baseTemp;
        const v109 = v107 || v108;
        const v110 = v105 + v109;
        var nowTemp = v110.replace(/(\.\.)/g, '');
        var httpHead = header(nowTemp);
        const v111 = host.backend;
        const v112 = conf.getApp(v111);
        conf.app = v112;
        const v113 = !host;
        if (v113) {
            const v114 = error(response);
            v114;
            return;
        }
        var defaultTemp = function () {
            const v115 = host.frondend;
            const v116 = host.baseTemp;
            const v117 = v115 + v116;
            const v120 = function (err, file) {
                if (err) {
                    const v118 = error(response, err);
                    v118;
                    return;
                }
                const v119 = responseTemp(response, httpHead, file);
                v119;
            };
            const v121 = fs.readFile(v117, v120);
            v121;
        };
        var send = function (res) {
            if (res) {
                const v122 = res === 'error';
                if (v122) {
                    const v123 = error(response, 'Route config error!');
                    v123;
                    return;
                }
                const v124 = res.html;
                if (v124) {
                    const v125 = res.status;
                    const v126 = { 'Content-Type': 'text/html;charset:utf-8' };
                    const v127 = response.writeHead(v125, v126);
                    v127;
                    const v128 = res.html;
                    const v129 = response.write(v128);
                    v129;
                    const v130 = response.end();
                    v130;
                    return;
                } else {
                    const v131 = res.status;
                    const v132 = v131 === 302;
                    if (v132) {
                        const v133 = res.status;
                        const v134 = res.url;
                        const v135 = {
                            'Content-Type': 'text/html;charset:utf-8',
                            'Location': v134
                        };
                        const v136 = response.writeHead(v133, v135);
                        v136;
                        const v137 = response.end();
                        v137;
                        return;
                    } else {
                        const v138 = res.data;
                        if (v138) {
                            const v139 = res.status;
                            const v140 = { 'Content-Type': 'application/json' };
                            const v141 = response.writeHead(v139, v140);
                            v141;
                            const v142 = JSON.stringify(res);
                            const v143 = response.write(v142);
                            v143;
                            const v144 = response.end();
                            v144;
                            return;
                        } else {
                            const v145 = error(response, 'Data type error!');
                            v145;
                        }
                    }
                }
            } else {
                const v156 = function (exists) {
                    const v146 = !exists;
                    if (v146) {
                        const v147 = request.url;
                        const v148 = v147 === '/favicon.ico';
                        if (v148) {
                            const v149 = response.writeHead(404);
                            v149;
                            const v150 = response.end();
                            return v150;
                        }
                        const v151 = defaultTemp();
                        v151;
                    } else {
                        const v154 = function (err, file) {
                            if (err) {
                                const v152 = defaultTemp();
                                v152;
                            } else {
                                const v153 = responseTemp(response, httpHead, file);
                                v153;
                            }
                        };
                        const v155 = fs.readFile(nowTemp, v154);
                        v155;
                    }
                };
                const v157 = fs.exists(nowTemp, v156);
                v157;
            }
        };
        const v158 = conf.app;
        const v159 = v158.url;
        const v160 = route(v159, request, send);
        v160;
    };
    const v161 = http.createServer(onRequest);
    const v162 = conf.constant;
    const v163 = v162.port;
    const v164 = v161.listen(v163);
    v164;
    const v165 = conf.constant;
    const v166 = v165.port;
    const v167 = 'server running at ' + v166;
    const v168 = console.log(v167);
    v168;
};
exports.start = start;