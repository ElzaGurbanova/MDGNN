var options = require('../config/options');
var fs = require('fs');
var path = require('path');
const v72 = fs.existsSync;
const v73 = path.existsSync;
var _existsSync = v72 || v73;
var nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/;
var nameCountFunc = function (s, index, ext) {
    const v74 = parseInt(index, 10);
    const v75 = v74 || 0;
    const v76 = v75 + 1;
    const v77 = ' (' + v76;
    const v78 = v77 + ')';
    const v79 = ext || '';
    const v80 = v78 + v79;
    return v80;
};
const FileInfo = function (file) {
    const v81 = file.name;
    this.name = v81;
    const v82 = file.size;
    this.size = v82;
    const v83 = file.type;
    this.type = v83;
    this.deleteType = 'DELETE';
};
const v84 = FileInfo.prototype;
const v112 = function (req) {
    const v85 = this.error;
    const v86 = !v85;
    if (v86) {
        var that = this;
        const v87 = options.ssl;
        let v88;
        if (v87) {
            v88 = 'https:';
        } else {
            v88 = 'http:';
        }
        const v89 = v88 + '//';
        const v90 = req.headers;
        const v91 = v90.host;
        const v92 = v89 + v91;
        const v93 = options.uploadUrl;
        var baseUrl = v92 + v93;
        const v94 = this.name;
        const v95 = encodeURIComponent(v94);
        this.url = this.deleteUrl = baseUrl + v95;
        const v96 = options.imageVersions;
        const v97 = Object.keys(v96);
        const v110 = function (version) {
            const v98 = options.uploadDir;
            const v99 = v98 + '/';
            const v100 = v99 + version;
            const v101 = v100 + '/';
            const v102 = that.name;
            const v103 = v101 + v102;
            const v104 = _existsSync(v103);
            if (v104) {
                const v105 = version + 'Url';
                const v106 = baseUrl + version;
                const v107 = v106 + '/';
                const v108 = that.name;
                const v109 = encodeURIComponent(v108);
                that[v105] = v107 + v109;
            }
        };
        const v111 = v97.forEach(v110);
        v111;
    }
};
v84.initUrl = v112;
const v113 = FileInfo.prototype;
const v124 = function () {
    const v114 = this.name;
    const v115 = path.basename(v114);
    const v116 = v115.replace(/^\.+/, '');
    this.name = v116;
    const v117 = options.uploadDir;
    const v118 = v117 + '/';
    const v119 = this.name;
    const v120 = v118 + v119;
    let v121 = _existsSync(v120);
    while (v121) {
        const v122 = this.name;
        const v123 = v122.replace(nameCountRegexp, nameCountFunc);
        this.name = v123;
        v121 = _existsSync(v120);
    }
};
v113.safeName = v124;
const v125 = FileInfo.prototype;
const v142 = function () {
    const v126 = options.minFileSize;
    const v127 = options.minFileSize;
    const v128 = this.size;
    const v129 = v127 > v128;
    const v130 = v126 && v129;
    if (v130) {
        this.error = 'File is too small';
    }
    const v131 = options.maxFileSize;
    const v132 = options.maxFileSize;
    const v133 = this.size;
    const v134 = v132 < v133;
    const v135 = v131 && v134;
    if (v135) {
        this.error = 'File is too big';
    }
    const v136 = options.acceptFileTypes;
    const v137 = this.type;
    const v138 = v136.test(v137);
    const v139 = !v138;
    if (v139) {
        this.error = 'File type not wrong';
    }
    const v140 = this.error;
    const v141 = !v140;
    return v141;
};
v125.validate = v142;
exports = FileInfo;
module.exports = exports;