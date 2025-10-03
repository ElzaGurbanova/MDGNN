const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const accesslog = require('access-log');
const uuidv4 = require('uuid/v4');
const datadir = './data';
const url_base = 'http://localhost:8080';
const construct_path = function (filename) {
    const v69 = datadir + '/';
    const v70 = v69 + filename;
    const v71 = path.resolve(v70);
    var fn = path.normalize(v71);
    const v72 = path.resolve(datadir);
    const v73 = fn.startsWith(v72);
    if (v73) {
        return fn;
    } else {
        return false;
    }
};
const absurl = function (path) {
    const v74 = path.startsWith('/');
    const v75 = !v74;
    if (v75) {
        path = '/' + path;
    }
    const v76 = url_base + path;
    return v76;
};
const list_files = function (req, res, next) {
    const v77 = fs.readdirSync('./data');
    const v80 = obj => {
        const v78 = 'files/' + obj;
        const v79 = absurl(v78);
        return v79;
    };
    const v81 = v77.map(v80);
    const v82 = { files: v81 };
    const v83 = res.json(v82);
    v83;
};
const get_file = function (req, res, next) {
    const v84 = req.params;
    const v85 = v84['id'];
    var filename = construct_path(v85);
    const v86 = fs.existsSync(filename);
    const v87 = filename && v86;
    if (v87) {
        const v97 = function (err, data) {
            if (err) {
                const v88 = next(err);
                return v88;
            }
            const v89 = req.params;
            const v90 = v89['id'];
            const v91 = req.params;
            const v92 = v91['id'];
            const v93 = 'files/' + v92;
            const v94 = absurl(v93);
            const v95 = {
                id: v90,
                url: v94,
                content: data
            };
            const v96 = res.json(v95);
            v96;
        };
        const v98 = fs.readFile(filename, 'utf8', v97);
        v98;
    } else {
        const v99 = res.sendStatus(404);
        v99;
    }
};
const put_file = function (req, res, next) {
    const v100 = req.params;
    const v101 = v100['id'];
    const v102 = v101 || undefined;
    var filename = construct_path(v102);
    const v103 = req.body;
    const v104 = v103.content;
    if (v104) {
        const v105 = req.body;
        const v106 = v105.content;
        const v109 = function (err, data) {
            if (err) {
                const v107 = next(err);
                return v107;
            }
            const v108 = res.sendStatus(204);
            v108;
        };
        const v110 = fs.writeFile(filename, v106, v109);
        v110;
    } else {
        const v111 = res.sendStatus(400);
        v111;
    }
};
var app = express();
const v112 = { extended: true };
const v113 = bodyParser.urlencoded(v112);
const v114 = app.use(v113);
v114;
const v117 = function (req, res, next) {
    const v115 = accesslog(req, res);
    v115;
    const v116 = next();
    v116;
};
const v118 = app.use(v117);
v118;
const v123 = function (err, req, res, next) {
    const v119 = err.stack;
    const v120 = console.error(v119);
    v120;
    const v121 = res.status(500);
    const v122 = v121.send('Something broke!');
    v122;
};
const v124 = app.use(v123);
v124;
const v125 = express.static('static');
const v126 = app.use('/static', v125);
v126;
const v129 = function (req, res, next) {
    const v127 = ['http://localhost:8080/files'];
    const v128 = res.json(v127);
    v128;
};
const v130 = app.get('/', v129);
v130;
const v131 = app.get('/files', list_files);
v131;
const v132 = app.get('/files/:id([0-9A-Za-z-]+)', get_file);
v132;
const v133 = app.put('/files/:id([0-9A-Za-z-]+)', put_file);
v133;
const v135 = function () {
    const v134 = console.log('File rest app listening on http://localhost:8080/');
    v134;
};
const v136 = app.listen(8080, v135);
v136;