var fs;
var gfmSrv;
var mdExts;
var path;
var pkg;
var render;
var srv;
var url;
var _;
fs = require('fs');
url = require('url');
path = require('path');
srv = require('node-srv');
_ = require('underscore');
render = require('./renderer');
pkg = require('../package.json');
mdExts = [
    '.md',
    '.markdown'
];
const v75 = pkg.name;
const v76 = pkg.version;
const v82 = function (options) {
    const v77 = options.template;
    const v78 = options && v77;
    if (v78) {
        const v79 = options.template;
        const v80 = this.loadTemplate(v79);
        v80;
    }
    const v81 = srv.apply(this, arguments);
    return v81;
};
const v119 = function (req, res) {
    var reqObj;
    const v83 = _.random(0, 10000000);
    const v84 = new Date();
    const v85 = req.url;
    const v86 = url.parse(v85);
    const v87 = v86.pathname;
    const v88 = v87.replace(/^\//, '');
    const v89 = this.options;
    const v90 = v89.index;
    const v91 = '/' + v90;
    const v92 = v88.replace(/\/$/, v91);
    reqObj.request = req;
    reqObj.response = res;
    reqObj.uid = v83;
    reqObj.startTime = v84;
    reqObj.uri = v92;
    reqObj.body = '';
    reqObj = {};
    reqObj = {};
    const v93 = reqObj.uri;
    const v94 = v93.length;
    const v95 = v94 === 0;
    if (v95) {
        const v96 = this.options;
        const v97 = v96.index;
        reqObj.uri = v97;
    }
    const v98 = reqObj.uri;
    const v99 = v98.split('/');
    const v100 = _.compact(v99);
    const v101 = v100[0];
    const v102 = v101 === 'static';
    if (v102) {
        const v103 = process.cwd();
        const v104 = this.options;
        const v105 = v104['static'];
        const v106 = v105 || '';
        const v107 = reqObj.uri;
        const v108 = path.resolve(v103, v106, v107);
        reqObj.filename = v108;
    } else {
        const v109 = process.cwd();
        const v110 = this.options;
        const v111 = v110.root;
        const v112 = v111 || '';
        const v113 = reqObj.uri;
        const v114 = path.resolve(v109, v112, v113);
        reqObj.filename = v114;
    }
    const v115 = this.stack;
    const v116 = v115.push(reqObj);
    v116;
    const v117 = this.ev;
    const v118 = v117.emit('request');
    return v118;
};
const v122 = function (templatePath) {
    const v120 = fs.readFileSync(templatePath);
    const v121 = v120.toString();
    return this._tmpl = v121;
};
const v123 = {
    name: v75,
    version: v76,
    constructor: v82,
    addRequest: v119,
    loadTemplate: v122
};
gfmSrv = srv.extend(v123);
const v146 = function (reqObj, callback) {
    var err;
    var fileName;
    var filePath;
    err = null;
    filePath = reqObj.filename;
    const v124 = path.extname(filePath);
    fileName = path.basename(filePath, v124);
    const v125 = {};
    v125['Content-Type'] = 'text/html';
    reqObj.mime = v125;
    reqObj.status = 200;
    const v126 = { encoding: 'utf-8' };
    const v143 = function (_this) {
        const v142 = function (err, file) {
            var e;
            var html;
            var readyFile;
            var template;
            if (err) {
                const v127 = _this.response500(err, callback);
                v127;
                const v128 = JSON.stringify(err);
                const v129 = 'Error 500: ' + v128;
                const v130 = _this.errorLog(reqObj, v129);
                v130;
                return false;
            }
            try {
                readyFile = render(file);
                const v131 = _this._tmpl;
                template = _.template(v131);
                const v132 = fileName.slice(0, 1);
                const v133 = v132.toUpperCase();
                const v134 = fileName.slice(1);
                const v135 = v134.replace('_', ' ');
                const v136 = v133 + v135;
                const v137 = readyFile.html;
                const v138 = readyFile.navigation;
                const v139 = {
                    title: v136,
                    content: v137,
                    navigation: v138
                };
                html = template(v139);
                reqObj.body = html;
            } catch (_error) {
                e = _error;
                err = e;
                const v140 = console.error(e);
                v140;
            }
            const v141 = callback(err, reqObj);
            return v141;
        };
        return v142;
    };
    const v144 = v143(this);
    const v145 = fs.readFile(filePath, v126, v144);
    return v145;
};
const v147 = {
    extnames: mdExts,
    method: v146
};
const v148 = gfmSrv.extendHandlers(v147);
v148;
module.exports = gfmSrv;