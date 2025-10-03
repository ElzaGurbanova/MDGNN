var fs = require('fs');
var path = require('path');
const v44 = require('ws');
var WebSocketServer = v44.Server;
const v45 = {
    host: 'localhost',
    port: 8090
};
var wserver = new WebSocketServer(v45);
const v46 = require('http');
const v61 = function (req, res) {
    const v47 = req.url;
    const v48 = console.log('Serving: %s', v47);
    v48;
    const v49 = req.url;
    const v50 = path.normalize(v49);
    const v51 = v50.replace(/^(\.\.[\/\\])+/, '');
    const v52 = __dirname + v51;
    const v53 = {
        flags: 'r',
        autoClose: true
    };
    var rs = fs.createReadStream(v52, v53);
    const v55 = function () {
        const v54 = rs.pipe(res);
        v54;
    };
    const v56 = rs.on('open', v55);
    v56;
    const v59 = function (e) {
        const v57 = e + '';
        const v58 = res.end(v57);
        v58;
    };
    const v60 = rs.on('error', v59);
    v60;
};
var hserver = v46.createServer(v61);
var clients = [];
const v72 = function (ws) {
    const v62 = clients.push(ws);
    v62;
    const v66 = function (data) {
        const v63 = console.log('Received: %s', data);
        v63;
        const v64 = console.log('Sent: %s', data);
        v64;
        const v65 = ws.send(data);
        v65;
    };
    const v67 = ws.on('message', v66);
    v67;
    const v70 = function () {
        const v68 = clients.indexOf(ws);
        const v69 = clients.splice(v68, 1);
        v69;
    };
    const v71 = ws.on('close', v70);
    v71;
};
const v73 = wserver.on('connection', v72);
v73;
const v74 = hserver.listen(8080);
v74;
const v75 = process.stdin;
const v80 = function (data) {
    const v78 = function (ws) {
        const v76 = console.log('Sent: %s', data);
        v76;
        const v77 = ws.send(data);
        v77;
    };
    const v79 = clients.forEach(v78);
    v79;
};
const v81 = v75.on('data', v80);
v81;
const v85 = function (e) {
    const v82 = console.error(e);
    v82;
    const v83 = e.stack;
    const v84 = console.trace(v83);
    v84;
};
const v86 = process.on('uncaughtException', v85);
v86;