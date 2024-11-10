const { app, BrowserWindow, ipcMain, Tray } = require('electron');
const path = require('path');
const axios = require('axios'); // For API requests

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  mainWindow.loadFile('index.html');

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
}

app.on('ready', () => {
  createWindow();

  const iconPath = path.join(__dirname, 'images', 'icon', 'ai-assistant.png');
  const tray = new Tray(iconPath);
  tray.setToolTip('Quick Answer');

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

// Handle search queries and fetch results from DuckDuckGo
ipcMain.on('ask-question', async (event, question) => {
  const query = encodeURIComponent(question);
  const searchUrl = `https://api.duckduckgo.com/?q=${query}&format=json`;

  try {
    const response = await axios.get(searchUrl);
    const resultSnippet = response.data.AbstractText || 'No result found.';

    event.reply('response', resultSnippet);
  } catch (error) {
    event.reply('response', 'Error fetching results. Please try again.');
  }
});
