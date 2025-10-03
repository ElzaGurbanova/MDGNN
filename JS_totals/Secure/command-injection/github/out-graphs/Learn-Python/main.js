const v47 = require('electron');
const app = v47.app;
const BrowserWindow = v47.BrowserWindow;
const ipcMain = v47.ipcMain;
const path = require('path');
const v48 = require('child_process');
const execFile = v48.execFile;
const createWindow = function () {
    const v49 = path.join(__dirname, 'preload.js');
    const v50 = {};
    v50.preload = v49;
    v50.contextIsolation = true;
    v50.nodeIntegration = false;
    const v51 = {
        width: 1200,
        height: 800,
        webPreferences: v50
    };
    const win = new BrowserWindow(v51);
    const v52 = win.loadFile('index.html');
    v52;
};
const v76 = (event, code) => {
    const v53 = typeof code;
    const v54 = v53 !== 'string';
    if (v54) {
        const v55 = event.sender;
        const v56 = v55.send('code-result', 'Error: code must be a string');
        v56;
        return;
    }
    const v57 = code.length;
    const v58 = v57 > 10000;
    if (v58) {
        const v59 = event.sender;
        const v60 = v59.send('code-result', 'Error: code too long');
        v60;
        return;
    }
    code = code.replace(/\u0000/g, '');
    const v61 = process.env;
    const v62 = v61.PYTHON_BIN;
    const pythonBin = v62 || 'python3';
    const v63 = [
        '-c',
        code
    ];
    const v64 = 5 * 1024;
    const v65 = v64 * 1024;
    const v66 = {
        timeout: 10000,
        maxBuffer: v65,
        windowsHide: true
    };
    const v74 = (error, stdout, stderr) => {
        if (error) {
            const v67 = event.sender;
            const v68 = error.message;
            const v69 = stderr || v68;
            const v70 = `Error: ${ v69 }`;
            const v71 = v67.send('code-result', v70);
            v71;
            return;
        }
        const v72 = event.sender;
        const v73 = v72.send('code-result', stdout);
        v73;
    };
    const v75 = execFile(pythonBin, v63, v66, v74);
    v75;
};
const v77 = ipcMain.on('run-code', v76);
v77;
const v78 = app.whenReady();
const v86 = () => {
    const v79 = createWindow();
    v79;
    const v84 = () => {
        const v80 = BrowserWindow.getAllWindows();
        const v81 = v80.length;
        const v82 = v81 === 0;
        if (v82) {
            const v83 = createWindow();
            v83;
        }
    };
    const v85 = app.on('activate', v84);
    v85;
};
const v87 = v78.then(v86);
v87;
const v91 = () => {
    const v88 = process.platform;
    const v89 = v88 !== 'darwin';
    if (v89) {
        const v90 = app.quit();
        v90;
    }
};
const v92 = app.on('window-all-closed', v91);
v92;