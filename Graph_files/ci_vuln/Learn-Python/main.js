const v32 = require('electron');
const app = v32.app;
const BrowserWindow = v32.BrowserWindow;
const ipcMain = v32.ipcMain;
const path = require('path');
const v33 = require('child_process');
const exec = v33.exec;
const createWindow = function () {
    const v34 = path.join(__dirname, 'preload.js');
    const v35 = {};
    v35.preload = v34;
    v35.contextIsolation = true;
    v35.nodeIntegration = false;
    const v36 = {
        width: 1200,
        height: 800,
        webPreferences: v35
    };
    const win = new BrowserWindow(v36);
    const v37 = win.loadFile('index.html');
    v37;
};
const v46 = (event, code) => {
    const v38 = code.replace(/"/g, '\\"');
    const pythonCommand = `python3 -c "${ v38 }"`;
    const v44 = (error, stdout, stderr) => {
        if (error) {
            const v39 = event.sender;
            const v40 = `Error: ${ stderr }`;
            const v41 = v39.send('code-result', v40);
            v41;
            return;
        }
        const v42 = event.sender;
        const v43 = v42.send('code-result', stdout);
        v43;
    };
    const v45 = exec(pythonCommand, v44);
    v45;
};
const v47 = ipcMain.on('run-code', v46);
v47;
const v48 = app.whenReady();
const v56 = () => {
    const v49 = createWindow();
    v49;
    const v54 = () => {
        const v50 = BrowserWindow.getAllWindows();
        const v51 = v50.length;
        const v52 = v51 === 0;
        if (v52) {
            const v53 = createWindow();
            v53;
        }
    };
    const v55 = app.on('activate', v54);
    v55;
};
const v57 = v48.then(v56);
v57;
const v61 = () => {
    const v58 = process.platform;
    const v59 = v58 !== 'darwin';
    if (v59) {
        const v60 = app.quit();
        v60;
    }
};
const v62 = app.on('window-all-closed', v61);
v62;