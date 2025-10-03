const v104 = require('events');
var EE = v104.EventEmitter;
const v105 = require('url');
var parse = v105.parse;
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
    const v106 = EE.call(this);
    v106;
    const v107 = {};
    const v108 = options || v107;
    options = xtend(defaults, v108);
    const v109 = options.port;
    this.port = v109;
    const v110 = options.hideindex;
    this.hideindex = v110;
    const v111 = options.indices;
    this.indices = v111;
    const v112 = options.dir;
    const v113 = path.normalize(v112);
    this.dir = v113;
    const v114 = options.nodot;
    this.nodot = v114;
    return this;
};
const v115 = EE.prototype;
const v116 = Object.create(v115);
Glance.prototype = v116;
const v117 = Glance.prototype;
const Glance$start = function () {
    var self = this;
    const v119 = function (req, res) {
        const v118 = self.serveRequest(req, res);
        v118;
    };
    const v120 = http.createServer(v119);
    self.server = v120;
    const v121 = self.server;
    const v122 = self.port;
    const v123 = v121.listen(v122, emitStarted);
    v123;
    const v124 = self.server;
    const v126 = function (con) {
        const v125 = con.setTimeout(500);
        v125;
    };
    const v127 = v124.addListener('connection', v126);
    v127;
    const v128 = self.on('error', showError);
    v128;
    const emitStarted = function () {
        const v129 = self.server;
        const v130 = self.emit('started', v129);
        v130;
    };
};
v117.start = Glance$start;
const v131 = Glance.prototype;
const Glance$stop = function () {
    const v132 = this.server;
    if (v132) {
        const v133 = this.server;
        const v134 = v133.close();
        v134;
    }
};
v131.stop = Glance$stop;
const v135 = Glance.prototype;
const Glance$serveRequest = function (req, res) {
    var request = {};
    var self = this;
    const v136 = self.dir;
    const v137 = req.url;
    const v138 = parse(v137);
    const v139 = v138.pathname;
    const v140 = decodeURIComponent(v139);
    const v141 = path.join(v136, v140);
    request.fullPath = v141;
    const v142 = req.socket;
    const v143 = v142.remoteAddress;
    request.ip = v143;
    const v144 = req.method;
    const v145 = v144.toLowerCase();
    request.method = v145;
    request.response = res;
    const v146 = request.fullPath;
    const v147 = self.dir;
    const v148 = v147.length;
    const v149 = v146.slice(0, v148);
    const v150 = self.dir;
    const v151 = v149 !== v150;
    if (v151) {
        const v152 = self.emit('error', 403, request, res);
        return v152;
    }
    const v153 = request.method;
    const v154 = v153 !== 'get';
    if (v154) {
        const v155 = self.emit('error', 405, request, res);
        return v155;
    }
    const v156 = self.nodot;
    const v157 = request.fullPath;
    const v158 = path.basename(v157);
    const v159 = /^\./.test(v158);
    const v160 = v156 && v159;
    if (v160) {
        const v161 = self.emit('error', 404, request, res);
        return v161;
    }
    const v162 = request.fullPath;
    const v163 = fs.stat(v162, statFile);
    v163;
    const statFile = function (err, stat) {
        if (err) {
            const v164 = self.emit('error', 404, request, res);
            return v164;
        }
        const v165 = stat.isDirectory();
        const v166 = !v165;
        if (v166) {
            const v167 = self.emit('read', request);
            v167;
            const v168 = request.fullPath;
            const v169 = filed(v168);
            const v170 = v169.pipe(res);
            return v170;
        }
        const v171 = self.hideindex;
        if (v171) {
            const v172 = self.emit('error', 403, request, res);
            return v172;
        }
        const v173 = self.indices;
        const v174 = !v173;
        const v175 = self.indices;
        const v176 = v175.length;
        const v177 = !v176;
        const v178 = v174 || v177;
        if (v178) {
            const v179 = listFiles();
            return v179;
        }
        const v180 = self.indices;
        var indices = v180.slice();
        const v181 = indices.shift();
        const v182 = findIndex(v181);
        v182;
        const findIndex = function (indexTest) {
            const v183 = request.fullPath;
            const v184 = path.join(v183, indexTest);
            const v185 = fileExists(v184, check);
            v185;
            const check = function (hasIndex) {
                if (hasIndex) {
                    const v186 = req.url;
                    const v187 = v186 + '/';
                    req.url = v187 + indexTest;
                    const v188 = self.serveRequest(req, res);
                    return v188;
                }
                const v189 = indices.length;
                const v190 = !v189;
                if (v190) {
                    const v191 = listFiles();
                    return v191;
                }
                const v192 = indices.shift();
                const v193 = findIndex(v192);
                v193;
            };
        };
        const listFiles = function () {
            const v194 = request.fullPath;
            var listPath = v194.replace(/\/$/, '');
            const v195 = res.writeHead(200, RESPONSE_HEADERS);
            v195;
            const v196 = self.nodot;
            const v197 = { hideDot: v196 };
            const v198 = htmlls(listPath, v197);
            const v199 = v198.pipe(res);
            v199;
            const v200 = self.emit('read', request);
            return v200;
        };
    };
};
v135.serveRequest = Glance$serveRequest;
const showError = function (errorCode, req, res) {
    const v201 = res.writeHead(errorCode, RESPONSE_HEADERS);
    v201;
    const v202 = errorCode + '.html';
    const v203 = path.join(__dirname, 'errors', v202);
    const v204 = fs.createReadStream(v203);
    const v205 = v204.pipe(res);
    v205;
};
const createGlance = function (options) {
    const v206 = new Glance(options);
    return v206;
};