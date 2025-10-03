const v51 = require('debug');
var debug = v51('lib/help');
var path = require('path');
var fs = require('fs');
var marked = require('marked');
const help = function (system) {
    var self = this;
    const getDocumentationFile = function (markdownFilename) {
        markdownFilename = markdownFilename.replace(/(\.\.|\/)/g, '');
        const v52 = require('app-root-path');
        const v53 = v52 + '/documentation/';
        var path = v53 + markdownFilename;
        const v54 = fs.existsSync(path);
        if (v54) {
            try {
                var help = fs.readFileSync(path);
                const v55 = help.toString();
                const v56 = {
                    baseUrl: '/int/documentation/',
                    headerPrefix: 'header-'
                };
                help = marked(v55, v56);
                return help;
            } catch (e) {
                const v57 = 'Error loading help ' + path;
                const v58 = debug(v57);
                v58;
                const v59 = debug(e);
                v59;
            }
        }
        return null;
    };
    const v72 = function (req, res, done) {
        var match;
        const v60 = req.url;
        if (match = v60.match(/^\/documentation\/(.+?)(\?.+)?$/)) {
            const v61 = require('app-root-path');
            var path = v61 + '/documentation';
            const v62 = match[1];
            var file = v62.replace(/\.\.+/g, '');
            const v63 = file.match(/\.(jpe?g|gif|png|pdf)$/);
            const v64 = path + '/';
            const v65 = v64 + file;
            const v66 = fs.existsSync(v65);
            const v67 = v63 && v66;
            if (v67) {
                const v68 = done();
                v68;
                const v69 = path + '/';
                const v70 = v69 + file;
                const v71 = res.sendFile(v70);
                v71;
            }
        }
    };
    const v73 = system.on('http_req', v72);
    v73;
    const v99 = function (client) {
        const v81 = function (req) {
            const v74 = req.file;
            var resp = {};
            resp.error = true;
            resp.file = v74;
            resp.html = '';
            const v75 = req.file;
            const v76 = v75 !== undefined;
            if (v76) {
                var html;
                const v77 = req.file;
                const v78 = (html = getDocumentationFile(v77)) !== null;
                if (v78) {
                    resp.error = false;
                    resp.html = html;
                }
            } else {
                const v79 = debug('Invalid get_help request');
                v79;
            }
            const v80 = client.emit('get_help:result', resp);
            v80;
        };
        const v82 = client.on('get_help', v81);
        v82;
        const v97 = function (req, answer) {
            const v83 = req.file;
            var resp = {};
            resp.error = true;
            resp.file = v83;
            resp.markdown = '';
            const v84 = req.file;
            const v85 = v84 !== undefined;
            if (v85) {
                const v86 = req.file;
                const markdownFilename = v86.replace(/(\.\.|\/)/g, '');
                const v87 = require('app-root-path');
                const v88 = v87 + '/documentation/';
                const path = v88 + markdownFilename;
                const v89 = fs.existsSync(path);
                if (v89) {
                    try {
                        const v90 = fs.readFileSync(path);
                        const v91 = v90.toString();
                        resp.markdown = v91;
                        resp.baseUrl = '/int/documentation/';
                        resp.error = false;
                    } catch (e) {
                        const v92 = 'Error loading help ' + path;
                        const v93 = debug(v92);
                        v93;
                        const v94 = debug(e);
                        v94;
                    }
                }
            } else {
                const v95 = debug('Invalid get_help request');
                v95;
            }
            const v96 = answer(resp);
            v96;
        };
        const v98 = client.on('get_help_md', v97);
        v98;
    };
    const v100 = system.on('io_connect', v99);
    v100;
};
module.exports = help;