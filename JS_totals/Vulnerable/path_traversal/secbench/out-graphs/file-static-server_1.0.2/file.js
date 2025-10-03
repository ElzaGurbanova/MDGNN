var mime = require('mime');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
const File = function (req, res) {
    this.req = req;
    this.res = res;
    this.charset = 'utf-8';
    const v70 = this.init();
    v70;
};
const v73 = function () {
    const v71 = this.getFilePath();
    this.filePath = v71;
    const v72 = this.getMime();
    this.mime = v72;
};
const v76 = function () {
    const v74 = this.filePath;
    const v75 = mime.lookup(v74);
    return v75;
};
const v86 = function () {
    const v77 = this.filePath;
    if (v77) {
        const v78 = this.filePath;
        return v78;
    }
    const v79 = this.req;
    var url = v79.url;
    const v80 = process.argv;
    var len = v80.length;
    const v81 = process.argv;
    const v82 = len - 1;
    const v83 = v81[v82];
    const v84 = path.join(v83, url);
    this.filePath = v84;
    const v85 = this.filePath;
    return v85;
};
const v98 = function (callback) {
    const v87 = this.pathType;
    if (v87) {
        const v88 = this.pathType;
        const v89 = callback(null, v88);
        return v89;
    }
    const v90 = this.filePath;
    const v96 = function (err, stat) {
        if (err) {
            const v91 = callback(err);
            return v91;
        }
        const v92 = stat.isFile();
        if (v92) {
            this.pathType = 'file';
        } else {
            const v93 = stat.isDirectory();
            if (v93) {
                this.pathType = 'directory';
            } else {
                this.pathType = 'other';
            }
        }
        const v94 = this.pathType;
        const v95 = callback(null, v94);
        v95;
    };
    const v97 = fs.stat(v90, v96);
    v97;
};
const v109 = function (callback) {
    const v99 = this.size;
    if (v99) {
        const v100 = this.hash;
        const v101 = callback(null, v100);
        return v101;
    }
    const v102 = this.filePath;
    const v107 = function (err, result) {
        if (err) {
            const v103 = callback(err);
            return v103;
        }
        const v104 = result.size;
        this.size = v104;
        const v105 = this.size;
        const v106 = callback(null, v105);
        v106;
    };
    const v108 = fs.stat(v102, v107);
    v108;
};
const v122 = function (callback) {
    const v110 = this.hash;
    if (v110) {
        const v111 = this.hash;
        const v112 = callback(null, v111);
        return v112;
    }
    const v113 = this.filePath;
    const v120 = function (err, result) {
        if (err) {
            const v114 = callback(err);
            return v114;
        }
        const v115 = crypto.createHash('sha1');
        const v116 = v115.update(result);
        const v117 = v116.digest('hex');
        this.hash = v117;
        const v118 = this.hash;
        const v119 = callback(null, v118);
        v119;
    };
    const v121 = fs.readFile(v113, 'utf8', v120);
    v121;
};
const v134 = function (callback) {
    const v123 = this.mime;
    const v124 = v123 !== 'text/html';
    if (v124) {
        const v125 = this.charset;
        const v126 = callback(null, v125);
        return v126;
    }
    const v127 = this.filePath;
    const v132 = function (err, result) {
        if (err) {
            const v128 = callback(err);
            return v128;
        }
        var matches = result.match(/<meta[ ]+charset="([\w- ]+)">/i);
        if (matches) {
            const v129 = matches[1];
            this.charset = v129;
        }
        const v130 = this.charset;
        const v131 = callback(null, v130);
        v131;
    };
    const v133 = fs.readFile(v127, 'utf8', v132);
    v133;
};
const v137 = function () {
    const v135 = this.filePath;
    const v136 = fs.createReadStream(v135);
    return v136;
};
const v138 = {};
v138.init = v73;
v138.getMime = v76;
v138.getFilePath = v86;
v138.getPathType = v98;
v138.getSize = v109;
v138.getHash = v122;
v138.getCharset = v134;
v138.getStream = v137;
File.prototype = v138;
module.exports = File;