const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

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
  // It's crucial to sanitize the input `code` before execution
  // to prevent command injection attacks. For this educational app,
  // we'll assume the user is trusted. In a real-world app,
  // this would need a proper sandboxing solution.
  const pythonCommand = `python3 -c "${code.replace(/"/g, '\\"')}"`;

  exec(pythonCommand, (error, stdout, stderr) => {
    if (error) {
      event.sender.send('code-result', `Error: ${stderr}`);
      return;
    }
    event.sender.send('code-result', stdout);
  });
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
