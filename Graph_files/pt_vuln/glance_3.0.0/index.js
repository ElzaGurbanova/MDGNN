const v97 = require('events');
var EE = v97.EventEmitter;
const v98 = require('url');
var parse = v98.parse;
var http = require('http');
var path = require('path');
var fs = require('fs');
var fileExists = require('utils-fs-exists');
var htmlls = require('html-ls');
var filed = require('filed');
var xtend = require('xtend');
var defaults = require('./lib/config');
var RESPONSE_HEADERS = {};
RESPONSE_HEADERS['content-type'] = 'text/html;charset=utf-8';
module.exports = createGlance;
const Glance = function (options) {
    const v99 = EE.call(this);
    v99;
    const v100 = {};
    const v101 = options || v100;
    options = xtend(defaults, v101);
    const v102 = options.port;
    this.port = v102;
    const v103 = options.hideindex;
    this.hideindex = v103;
    const v104 = options.indices;
    this.indices = v104;
    const v105 = options.dir;
    const v106 = path.normalize(v105);
    this.dir = v106;
    const v107 = options.nodot;
    this.nodot = v107;
    return this;
};
const v108 = EE.prototype;
const v109 = Object.create(v108);
Glance.prototype = v109;
const v110 = Glance.prototype;
const Glance$start = function () {
    var self = this;
    const v112 = function (req, res) {
        const v111 = self.serveRequest(req, res);
        v111;
    };
    const v113 = http.createServer(v112);
    self.server = v113;
    const v114 = self.server;
    const v115 = self.port;
    const v116 = v114.listen(v115, emitStarted);
    v116;
    const v117 = self.server;
    const v119 = function (con) {
        const v118 = con.setTimeout(500);
        v118;
    };
    const v120 = v117.addListener('connection', v119);
    v120;
    const v121 = self.on('error', showError);
    v121;
    const emitStarted = function () {
        const v122 = self.server;
        const v123 = self.emit('started', v122);
        v123;
    };
};
v110.start = Glance$start;
const v124 = Glance.prototype;
const Glance$stop = function () {
    const v125 = this.server;
    if (v125) {
        const v126 = this.server;
        const v127 = v126.close();
        v127;
    }
};
v124.stop = Glance$stop;
const v128 = Glance.prototype;
const Glance$serveRequest = function (req, res) {
    var request = {};
    var self = this;
    const v129 = self.dir;
    const v130 = req.url;
    const v131 = parse(v130);
    const v132 = v131.pathname;
    const v133 = decodeURIComponent(v132);
    const v134 = path.join(v129, v133);
    request.fullPath = v134;
    const v135 = req.socket;
    const v136 = v135.remoteAddress;
    request.ip = v136;
    const v137 = req.method;
    const v138 = v137.toLowerCase();
    request.method = v138;
    request.response = res;
    const v139 = request.method;
    const v140 = v139 !== 'get';
    if (v140) {
        const v141 = self.emit('error', 405, request, res);
        return v141;
    }
    const v142 = self.nodot;
    const v143 = request.fullPath;
    const v144 = path.basename(v143);
    const v145 = /^\./.test(v144);
    const v146 = v142 && v145;
    if (v146) {
        const v147 = self.emit('error', 404, request, res);
        return v147;
    }
    const v148 = request.fullPath;
    const v149 = fs.stat(v148, statFile);
    v149;
    const statFile = function (err, stat) {
        if (err) {
            const v150 = self.emit('error', 404, request, res);
            return v150;
        }
        const v151 = stat.isDirectory();
        const v152 = !v151;
        if (v152) {
            const v153 = self.emit('read', request);
            v153;
            const v154 = request.fullPath;
            const v155 = filed(v154);
            const v156 = v155.pipe(res);
            return v156;
        }
        const v157 = self.hideindex;
        if (v157) {
            const v158 = self.emit('error', 403, request, res);
            return v158;
        }
        const v159 = self.indices;
        const v160 = !v159;
        const v161 = self.indices;
        const v162 = v161.length;
        const v163 = !v162;
        const v164 = v160 || v163;
        if (v164) {
            const v165 = listFiles();
            return v165;
        }
        const v166 = self.indices;
        var indices = v166.slice();
        const v167 = indices.shift();
        const v168 = findIndex(v167);
        v168;
        const findIndex = function (indexTest) {
            const v169 = request.fullPath;
            const v170 = path.join(v169, indexTest);
            const v171 = fileExists(v170, check);
            v171;
            const check = function (hasIndex) {
                if (hasIndex) {
                    const v172 = req.url;
                    const v173 = v172 + '/';
                    req.url = v173 + indexTest;
                    const v174 = self.serveRequest(req, res);
                    return v174;
                }
                const v175 = indices.length;
                const v176 = !v175;
                if (v176) {
                    const v177 = listFiles();
                    return v177;
                }
                const v178 = indices.shift();
                const v179 = findIndex(v178);
                v179;
            };
        };
        const listFiles = function () {
            const v180 = request.fullPath;
            var listPath = v180.replace(/\/$/, '');
            const v181 = res.writeHead(200, RESPONSE_HEADERS);
            v181;
            const v182 = self.nodot;
            const v183 = { hideDot: v182 };
            const v184 = htmlls(listPath, v183);
            const v185 = v184.pipe(res);
            v185;
            const v186 = self.emit('read', request);
            return v186;
        };
    };
};
v128.serveRequest = Glance$serveRequest;
const showError = function (errorCode, req, res) {
    const v187 = res.writeHead(errorCode, RESPONSE_HEADERS);
    v187;
    const v188 = errorCode + '.html';
    const v189 = path.join(__dirname, 'errors', v188);
    const v190 = fs.createReadStream(v189);
    const v191 = v190.pipe(res);
    v191;
};
const createGlance = function (options) {
    const v192 = new Glance(options);
    return v192;
};