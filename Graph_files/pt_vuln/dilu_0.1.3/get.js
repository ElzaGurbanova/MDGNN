var url = require('url');
var path = require('path');
var fs = require('fs');
var mimetypes = require('./mimetypes.js');
var dirview = require('./dirview.js');
var error = require('./error.js');
var dilu_conf = null;
const v50 = function (conf) {
    dilu_conf = conf;
};
exports.tell = v50;
const v66 = function (req, res) {
    const v51 = req.url;
    var eurl = decodeURI(v51);
    const v52 = url.parse(eurl);
    const v53 = v52.pathname;
    const v54 = dilu_conf.root;
    const v55 = path.join(v54, eurl);
    var fpath = {};
    fpath['url'] = eurl;
    fpath['relative'] = v53;
    fpath['absolute'] = v55;
    const v56 = fpath.absolute;
    const v64 = function (err, stats) {
        const v57 = !err;
        if (v57) {
            const v58 = stats.isFile();
            if (v58) {
                const v59 = response_file(fpath, stats, res);
                v59;
            } else {
                const v60 = stats.isDirectory();
                if (v60) {
                    const v61 = response_directory(fpath, stats, res);
                    v61;
                } else {
                    const v62 = error.response(res, 500, 'Not a regular file!');
                    v62;
                }
            }
        } else {
            const v63 = error.response(res, 404, 'File not found.');
            v63;
        }
    };
    const v65 = fs.lstat(v56, v64);
    v65;
};
exports.proceed = v66;
const response_file = function (fpath, stats, res) {
    const v67 = fpath.absolute;
    var stream = fs.createReadStream(v67);
    const v68 = fpath.absolute;
    var ext = path.extname(v68);
    const v69 = ext == '';
    if (v69) {
        mime = null;
    } else {
        mime = mimetypes.type_of_ext(ext);
    }
    const v70 = mime == null;
    if (v70) {
        mime = 'text/plain;charset=utf-8';
    }
    const v71 = stats.size;
    const v72 = 'Dilu/' + '0.1.2';
    const v73 = {
        'Content-Type': mime,
        'Content-Length': v71,
        'Server': v72
    };
    const v74 = res.writeHeader(200, v73);
    v74;
    const v75 = stream.pipe(res);
    v75;
};
const hidden = function (fname) {
    const v76 = fname.substr(0, 1);
    const v77 = v76 == '.';
    if (v77) {
        return true;
    }
    return false;
};
const response_directory = function (fpath, stats, res) {
    var base = fpath.url;
    const v78 = base.length;
    const v79 = v78 - 1;
    const v80 = base.substr(v79);
    const v81 = v80 != '/';
    if (v81) {
        base = base + '/';
    }
    const v82 = fpath.absolute;
    const v97 = function (err, files) {
        const v83 = !err;
        if (v83) {
            var dv = new dirview.DirView();
            const v84 = fpath.absolute;
            const v85 = dv.init(v84, base);
            v85;
            for (file in files) {
                const v86 = files[file];
                const v87 = hidden(v86);
                if (v87) {
                    continue;
                }
                const v88 = files[file];
                const v89 = dv.add_item(v88);
                v89;
            }
            var html = dv.get_html();
            const v90 = html.length;
            const v91 = 'Dilu/' + '0.1.2';
            const v92 = {
                'Content-Type': 'text/html',
                'Content-Length': v90,
                'Server': v91
            };
            const v93 = res.writeHeader(200, v92);
            v93;
            const v94 = res.write(html);
            v94;
            const v95 = res.end();
            v95;
        } else {
            const v96 = error.response(res, 500, 'Oops! Directory cannot be listed for unknown reason.');
            v96;
        }
    };
    const v98 = fs.readdir(v82, v97);
    v98;
    return 'ok';
};