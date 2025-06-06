const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  // Find the first game folder inside 'src/Project Files'
  const projectFilesDir = path.join(__dirname, 'src', 'Project Files');
  if (!fs.existsSync(projectFilesDir)) {
    throw new Error(`Project Files directory not found at: ${projectFilesDir}`);
  }

  const gameFolders = fs.readdirSync(projectFilesDir).filter(f =>
    fs.statSync(path.join(projectFilesDir, f)).isDirectory()
  );

  if (gameFolders.length === 0) {
    throw new Error('No game found in src/Project Files.');
  }

  // Use the first game found
  const gameName = gameFolders[0];
  const gameIndex = path.join(projectFilesDir, gameName, 'www', 'index.html');

  if (!fs.existsSync(gameIndex)) {
    throw new Error(`index.html not found for game: ${gameName}`);
  }

  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: `RPG Maker Launcher - ${gameName}`,
  });

  win.loadFile(gameIndex);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
