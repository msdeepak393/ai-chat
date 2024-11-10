const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  askQuestion: (question) => ipcRenderer.send('ask-question', question),
  onResponse: (callback) => ipcRenderer.on('response', callback)
});
