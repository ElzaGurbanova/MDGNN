const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const commander = require('commander');
const app = express();
const v69 = commander.version('1.0.0');
const v70 = v69.usage('[options] [dir]');
const v71 = v70.option('-i, --auto-index', 'Automatically searches for index.html in directory');
const v72 = process.argv;
const v73 = v71.parse(v72);
v73;
let dir = process.cwd();
const v74 = commander.args;
const v75 = v74.length;
if (v75) {
    const v76 = commander.args;
    dir = v76[0];
}
const v77 = commander.autoIndex;
const autoIndex = v77 || false;
const showDirOrErr = function (filePath, res) {
    const v78 = res.set('Content-Type', 'text/html');
    v78;
    const v97 = (err, stats) => {
        const v79 = !err;
        const v80 = stats.isDirectory();
        const v81 = v79 && v80;
        if (v81) {
            const v91 = (err, files) => {
                if (err) {
                    const v82 = res.status(500);
                    v82;
                    const v83 = `
                        <html>
                            <head>
                            </head>
                            <body>
                            I'm going to be completely honest with you here.
                            Something went wrong, I don't exactly know what, but... it's probably your fault.
                            </body>
                        </html>
                        `;
                    const v84 = res.send(v83);
                    v84;
                } else {
                    const v86 = f => {
                        const v85 = `<li><a href="${ f }">${ f }</a></li>`;
                        return v85;
                    };
                    const v87 = files.map(v86);
                    const v88 = v87.join('\n');
                    const v89 = `
                        <html>
                            <head>
                            </head>
                            <body>
                                This is a directory... and here's what's in it...
                                <ul>
                                    ${ v88 }
                                </ul>
                            </body>
                        </html>
                        `;
                    const v90 = res.send(v89);
                    v90;
                }
            };
            const v92 = fs.readdir(filePath, v91);
            v92;
        } else {
            const v93 = res.status(404);
            v93;
            const v94 = path.resolve(filePath);
            const v95 = `
                <html>
                    <head>
                    </head>
                    <body>
                    Could not find: ${ v94 }
                    </body>

                </html>
            `;
            const v96 = res.send(v95);
            v96;
        }
    };
    const v98 = fs.stat(filePath, v97);
    v98;
};
const processFile = function (filePath, req, res) {
    const v118 = (err, data) => {
        if (err) {
            const v99 = path.extname(filePath);
            const v100 = v99 === '';
            const v101 = autoIndex && v100;
            if (v101) {
                const v102 = path.join(filePath, 'index.html');
                const v109 = (err, stats) => {
                    const v103 = !err;
                    const v104 = stats.isFile();
                    const v105 = v103 && v104;
                    if (v105) {
                        const v106 = path.join(filePath, 'index.html');
                        const v107 = processFile(v106, req, res);
                        v107;
                    } else {
                        const v108 = showDirOrErr(filePath, res);
                        v108;
                    }
                };
                const v110 = fs.stat(v102, v109);
                v110;
            } else {
                const v111 = showDirOrErr(filePath, res);
                v111;
            }
        } else {
            const v112 = path.extname(filePath);
            switch (v112) {
            case '.html':
                const v113 = res.set('Content-Type', 'text/html');
                v113;
                break;
            case '.css':
                const v114 = res.set('Content-Type', 'text/css');
                v114;
                break;
            case '.js':
                const v115 = res.set('Content-Type', 'text/javascript');
                v115;
                break;
            case '.json':
                const v116 = res.set('Content-Type', 'application/json');
                v116;
                break;
            default:
            }
            const v117 = res.send(data);
            v117;
        }
    };
    const v119 = fs.readFile(filePath, v118);
    v119;
};
const v122 = (req, res) => {
    const v120 = req.path;
    const fullPath = path.join(dir, v120);
    const v121 = processFile(fullPath, req, res);
    v121;
};
const v123 = app.use('/', v122);
v123;
const server = http.createServer(app);
const v127 = () => {
    const v124 = server.port;
    const v125 = `Connected on ${ v124 }`;
    const v126 = console.log(v125);
    v126;
};
const v128 = server.once('listening', v127);
v128;
const findPort = function (port) {
    const v133 = err => {
        const v129 = err.code;
        const v130 = v129 === 'EADDRINUSE';
        if (v130) {
            const v131 = port + 1;
            const v132 = findPort(v131);
            return v132;
        } else {
            throw err;
        }
    };
    const v134 = server.once('error', v133);
    v134;
    server.port = port;
    const v135 = server.listen(port);
    v135;
};
const v136 = findPort(8080);
v136;