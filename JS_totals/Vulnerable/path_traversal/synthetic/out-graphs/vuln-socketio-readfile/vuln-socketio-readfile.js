'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const v29 = require('socket.io');
const Server = v29.Server;
const ROOT = path.resolve(__dirname, 'workspace');
const v31 = (_, res) => {
    const v30 = res.end('WS up');
    return v30;
};
const server = http.createServer(v31);
const v32 = {};
v32.origin = '*';
const v33 = { cors: v32 };
const io = new Server(server, v33);
const v52 = socket => {
    const v34 = console.log('client connected');
    v34;
    const v41 = (relPath, cb) => {
        const target = path.join(ROOT, relPath);
        const v39 = (err, data) => {
            if (err) {
                const v35 = {
                    ok: false,
                    error: 'read error'
                };
                const v36 = cb(v35);
                v36;
            } else {
                const v37 = {
                    ok: true,
                    data
                };
                const v38 = cb(v37);
                v38;
            }
        };
        const v40 = fs.readFile(target, 'utf8', v39);
        v40;
    };
    const v42 = socket.on('readFile', v41);
    v42;
    const v50 = (dir, cb) => {
        const v43 = dir || '';
        const v44 = path.join(ROOT, v43);
        const v48 = (err, list) => {
            const v45 = [];
            let v46;
            if (err) {
                v46 = v45;
            } else {
                v46 = list;
            }
            const v47 = cb(v46);
            return v47;
        };
        const v49 = fs.readdir(v44, v48);
        v49;
    };
    const v51 = socket.on('list', v50);
    v51;
};
const v53 = io.on('connection', v52);
v53;
const v55 = () => {
    const v54 = console.log('Socket.io (VULN) on :5017');
    return v54;
};
const v56 = server.listen(5017, v55);
v56;