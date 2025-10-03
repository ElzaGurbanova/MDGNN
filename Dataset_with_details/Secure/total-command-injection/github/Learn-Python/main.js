const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { execFile } = require('child_process'); // <-- use execFile (no shell)

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

ipcMain.on('run-code', (event, code) => {
  // Guard basic input shape
  if (typeof code !== 'string') {
    event.sender.send('code-result', 'Error: code must be a string');
    return;
  }
  // Optional: cap size and strip NULs (avoid arg truncation on some platforms)
  if (code.length > 10000) {
    event.sender.send('code-result', 'Error: code too long');
    return;
  }
  code = code.replace(/\u0000/g, '');

  // Prefer an absolute interpreter path via env, else fall back to PATH
  const pythonBin = process.env.PYTHON_BIN || 'python3';

  // No shell: pass args array so user content can't affect the command line
  execFile(
    pythonBin,
    ['-c', code],
    { timeout: 10000, maxBuffer: 5 * 1024 * 1024, windowsHide: true }, // modest limits
    (error, stdout, stderr) => {
      if (error) {
        // include stderr or error message
        event.sender.send('code-result', `Error: ${stderr || error.message}`);
        return;
      }
      event.sender.send('code-result', stdout);
    }
  );
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

