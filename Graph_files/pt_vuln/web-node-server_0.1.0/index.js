var http = require('http');
var fs = require('fs');
const v82 = require('./tool/httpHeader');
var header = v82.contentType;
const v83 = require('./router');
var route = v83.response;
var conf = require('./config');
const responseTemp = function (response, head, file) {
    const v84 = response.writeHead(200, head);
    v84;
    const v85 = response.write(file);
    v85;
    const v86 = response.end();
    v86;
};
;
const error = function (response, text) {
    const v87 = { 'Content-Type': 'text/html;charset:utf-8' };
    const v88 = response.writeHead(500, v87);
    v88;
    const v89 = text || 'Can\'t find domain config!';
    const v90 = '<h2>Server Error</h2><p>Error in api or template config about this domain</p><p>' + v89;
    const v91 = v90 + '</p>';
    const v92 = response.write(v91);
    v92;
    const v93 = response.end();
    v93;
};
const start = function (config) {
    const v94 = conf.constant;
    var host = v94.host;
    if (config) {
        conf.serv = config;
    }
    const onRequest = function (request, response) {
        var frontUrl = '';
        const v95 = request.url;
        const v96 = v95 === '/favicon.ico';
        if (v96) {
            return;
        }
        let key;
        const v97 = conf.serv;
        for (key in v97) {
            const v98 = request.headers;
            const v99 = v98.host;
            const v100 = v99.indexOf(key);
            const v101 = -1;
            const v102 = v100 !== v101;
            if (v102) {
                const v103 = conf.serv;
                host = v103[key];
            }
        }
        const v104 = host.frondend;
        const v105 = request.url;
        const v106 = v105.replace('/', '');
        const v107 = host.baseTemp;
        const v108 = v106 || v107;
        var nowTemp = v104 + v108;
        var httpHead = header(nowTemp);
        const v109 = host.backend;
        const v110 = conf.getApp(v109);
        conf.app = v110;
        const v111 = !host;
        if (v111) {
            const v112 = error(response);
            v112;
            return;
        }
        var defaultTemp = function () {
            const v113 = host.frondend;
            const v114 = host.baseTemp;
            const v115 = v113 + v114;
            const v118 = function (err, file) {
                if (err) {
                    const v116 = error(response, err);
                    v116;
                    return;
                }
                const v117 = responseTemp(response, httpHead, file);
                v117;
            };
            const v119 = fs.readFile(v115, v118);
            v119;
        };
        var send = function (res) {
            if (res) {
                const v120 = res === 'error';
                if (v120) {
                    const v121 = error(response, 'Route config error!');
                    v121;
                    return;
                }
                const v122 = res.html;
                if (v122) {
                    const v123 = res.status;
                    const v124 = { 'Content-Type': 'text/html;charset:utf-8' };
                    const v125 = response.writeHead(v123, v124);
                    v125;
                    const v126 = res.html;
                    const v127 = response.write(v126);
                    v127;
                    const v128 = response.end();
                    v128;
                    return;
                } else {
                    const v129 = res.status;
                    const v130 = v129 === 302;
                    if (v130) {
                        const v131 = res.status;
                        const v132 = res.url;
                        const v133 = {
                            'Content-Type': 'text/html;charset:utf-8',
                            'Location': v132
                        };
                        const v134 = response.writeHead(v131, v133);
                        v134;
                        const v135 = response.end();
                        v135;
                        return;
                    } else {
                        const v136 = res.data;
                        if (v136) {
                            const v137 = res.status;
                            const v138 = { 'Content-Type': 'application/json' };
                            const v139 = response.writeHead(v137, v138);
                            v139;
                            const v140 = JSON.stringify(res);
                            const v141 = response.write(v140);
                            v141;
                            const v142 = response.end();
                            v142;
                            return;
                        } else {
                            const v143 = error(response, 'Data type error!');
                            v143;
                        }
                    }
                }
            } else {
                const v150 = function (exists) {
                    const v144 = !exists;
                    if (v144) {
                        const v145 = defaultTemp();
                        v145;
                    } else {
                        const v148 = function (err, file) {
                            if (err) {
                                const v146 = defaultTemp();
                                v146;
                            } else {
                                const v147 = responseTemp(response, httpHead, file);
                                v147;
                            }
                        };
                        const v149 = fs.readFile(nowTemp, v148);
                        v149;
                    }
                };
                const v151 = fs.exists(nowTemp, v150);
                v151;
            }
        };
        const v152 = conf.app;
        const v153 = v152.url;
        const v154 = route(v153, request, send);
        v154;
    };
    const v155 = http.createServer(onRequest);
    const v156 = conf.constant;
    const v157 = v156.port;
    const v158 = v155.listen(v157);
    v158;
    const v159 = conf.constant;
    const v160 = v159.port;
    const v161 = 'server running at ' + v160;
    const v162 = console.log(v161);
    v162;
};
exports.start = start;