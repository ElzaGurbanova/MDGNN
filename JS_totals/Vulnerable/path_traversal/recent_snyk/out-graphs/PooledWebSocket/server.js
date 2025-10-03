var fs = require('fs');
const v42 = require('ws');
var WebSocketServer = v42.Server;
const v43 = {
    host: 'localhost',
    port: 8090
};
var wserver = new WebSocketServer(v43);
const v44 = require('http');
const v57 = function (req, res) {
    const v45 = req.url;
    const v46 = console.log('Serving: %s', v45);
    v46;
    const v47 = req.url;
    const v48 = __dirname + v47;
    const v49 = {
        flags: 'r',
        autoClose: true
    };
    var rs = fs.createReadStream(v48, v49);
    const v51 = function () {
        const v50 = rs.pipe(res);
        v50;
    };
    const v52 = rs.on('open', v51);
    v52;
    const v55 = function (e) {
        const v53 = e + '';
        const v54 = res.end(v53);
        v54;
    };
    const v56 = rs.on('error', v55);
    v56;
};
var hserver = v44.createServer(v57);
var clients = [];
const v68 = function (ws) {
    const v58 = clients.push(ws);
    v58;
    const v62 = function (data) {
        const v59 = console.log('Received: %s', data);
        v59;
        const v60 = console.log('Sent: %s', data);
        v60;
        const v61 = ws.send(data);
        v61;
    };
    const v63 = ws.on('message', v62);
    v63;
    const v66 = function () {
        const v64 = clients.indexOf(ws);
        const v65 = clients.splice(v64, 1);
        v65;
    };
    const v67 = ws.on('close', v66);
    v67;
};
const v69 = wserver.on('connection', v68);
v69;
const v70 = hserver.listen(8080);
v70;
const v71 = process.stdin;
const v76 = function (data) {
    const v74 = function (ws) {
        const v72 = console.log('Sent: %s', data);
        v72;
        const v73 = ws.send(data);
        v73;
    };
    const v75 = clients.forEach(v74);
    v75;
};
const v77 = v71.on('data', v76);
v77;
const v81 = function (e) {
    const v78 = console.error(e);
    v78;
    const v79 = e.stack;
    const v80 = console.trace(v79);
    v80;
};
const v82 = process.on('uncaughtException', v81);
v82;