'use strict';
const Fs = require('fs');
const Path = require('path');
const Util = require('util');
const Utility = require('../utility');
const PathStat = require('../path/stat');
const Server = function (options) {
    const v74 = {};
    options = options || v74;
    const v75 = options.port;
    this.port = v75 || 0;
    const v76 = options.spa;
    this.spa = v76 || false;
    const v77 = options.cors;
    this.cors = v77 || false;
    const v78 = options.cache;
    this.cache = v78 || false;
    const v79 = options.secure;
    this.secure = v79 || false;
    const v80 = options.host;
    this.host = v80 || '0.0.0.0';
    const v81 = options.file;
    this.file = v81 || 'index.html';
    const v82 = options.hostname;
    this.hostname = v82 || 'localhost';
    const v83 = options.folder;
    const v84 = v83 || 'public';
    const v85 = Path.resolve(v84);
    this.folder = v85;
};
const v86 = Server.prototype;
const v101 = async function (request, response) {
    const self = this;
    const v87 = this.cors;
    const v88 = this.cache;
    const data = {};
    data.path = '/';
    data.code = 200;
    data.cors = v87;
    data.cache = v88;
    try {
        const v89 = this.spa;
        const v90 = this.file;
        const v91 = request.url;
        const v92 = this.folder;
        const v93 = {
            spa: v89,
            file: v90,
            url: v91,
            folder: v92
        };
        const stat = await PathStat(v93);
        const v94 = stat.path;
        const v95 = data.path;
        data.path = v94 || v95;
        const v96 = stat.code;
        const v97 = data.code;
        data.code = v96 || v97;
        await self.request(request, response, data);
    } catch (error) {
        const header = Utility.createHeader(data);
        const result = Utility.statusString(500);
        const v98 = response.writeHead(500, header);
        v98;
        const v99 = response.end(result);
        v99;
        const v100 = self.emit('error', error);
        v100;
    }
};
v86.setup = v101;
const v102 = Server.prototype;
const v125 = async function (request, response, data) {
    const self = this;
    const v103 = data.code;
    const v104 = v103 === 200;
    if (v104) {
        const v105 = data.path;
        const stream = Fs.createReadStream(v105);
        const v109 = function (error) {
            const header = Utility.createHeader(data);
            const result = Utility.statusString(500);
            const v106 = response.writeHead(500, header);
            v106;
            const v107 = response.end(result);
            v107;
            const v108 = self.emit('error', error);
            v108;
        };
        const v110 = stream.on('error', v109);
        v110;
        const v112 = function () {
            const header = Utility.createHeader(data);
            const v111 = response.writeHead(200, header);
            v111;
        };
        const v113 = stream.on('open', v112);
        v113;
        const v115 = function () {
            const v114 = response.end();
            v114;
        };
        const v116 = stream.on('close', v115);
        v116;
        const v117 = stream.pipe(response);
        v117;
    } else {
        const header = Utility.createHeader(data);
        const v118 = data.code;
        const v119 = v118 === 301;
        if (v119) {
            const v120 = data.path;
            header.Location = v120;
        }
        const v121 = data.code;
        const result = Utility.statusString(v121);
        const v122 = data.code;
        const v123 = response.writeHead(v122, header);
        v123;
        const v124 = response.end(result);
        v124;
    }
};
v102.request = v125;
const v126 = Server.prototype;
const v138 = function () {
    const self = this;
    const v136 = function (resolve, reject) {
        const v127 = self.port;
        const v128 = self.host;
        const v129 = {
            port: v127,
            host: v128
        };
        const v134 = function () {
            const address = self.address();
            const v130 = address.port;
            self.port = v130;
            const v131 = address.host;
            self.host = v131;
            const v132 = resolve();
            v132;
            const v133 = self.emit('open');
            v133;
        };
        const v135 = self.listen(v129, v134);
        return v135;
    };
    const v137 = new Promise(v136);
    return v137;
};
v126.open = v138;
const v139 = Server.prototype;
const v146 = function () {
    const self = this;
    const v144 = function (resolve, reject) {
        const v142 = function () {
            const v140 = resolve();
            v140;
            const v141 = self.emit('close');
            v141;
        };
        const v143 = self.close(v142);
        return v143;
    };
    const v145 = new Promise(v144);
    return v145;
};
v139.close = v146;
module.exports = Server;