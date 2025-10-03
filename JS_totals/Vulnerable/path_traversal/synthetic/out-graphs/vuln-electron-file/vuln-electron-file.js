'use strict';
const v28 = require('electron');
const app = v28.app;
const BrowserWindow = v28.BrowserWindow;
const protocol = v28.protocol;
const fs = require('fs');
const path = require('path');
const mime = require('mime');
let win;
const create = function () {
    const v29 = {
        width: 800,
        height: 600
    };
    win = new BrowserWindow(v29);
    const v30 = `file://${ __dirname }/index.html`;
    const v31 = win.loadURL(v30);
    v31;
    const v32 = () => {
        return win = null;
    };
    const v33 = win.on('closed', v32);
    v33;
};
const v50 = () => {
    const v45 = (request, callback) => {
        let file = request.url;
        const v34 = file.startsWith('file://');
        if (v34) {
            const v35 = file.slice(7);
            file = decodeURIComponent(v35);
        }
        const v36 = file.endsWith('/index.html');
        if (v36) {
            file = path.join(__dirname, 'index.html');
        }
        const v43 = (err, data) => {
            if (err) {
                const v37 = -6;
                const v38 = callback(v37);
                return v38;
            }
            const v39 = mime.getType(file);
            const v40 = v39 || 'text/plain';
            const v41 = {
                data,
                mimeType: v40
            };
            const v42 = callback(v41);
            v42;
        };
        const v44 = fs.readFile(file, v43);
        v44;
    };
    const v47 = err => {
        if (err) {
            const v46 = console.error('intercept failed', err);
            v46;
        }
    };
    const v48 = protocol.interceptBufferProtocol('file', v45, v47);
    v48;
    const v49 = create();
    v49;
};
const v51 = app.on('ready', v50);
v51;
const v53 = () => {
    const v52 = app.quit();
    return v52;
};
const v54 = app.on('window-all-closed', v53);
v54;