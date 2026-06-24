import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process securely ---------

contextBridge.exposeInMainWorld('electronAPI', {
  // Store
  storeGet: (key: string) => ipcRenderer.invoke('electron-store-get', key),
  storeSet: (key: string, val: any) => ipcRenderer.invoke('electron-store-set', key, val),
  
  // Stream
  streamStart: (url: string, key: string) => ipcRenderer.send('start-stream', url, key),
  streamStop: () => ipcRenderer.send('stop-stream'),
  streamSendFrame: (buffer: ArrayBuffer) => ipcRenderer.send('stream-frame', Buffer.from(buffer)),
  
  // Plugins
  getPlugins: () => ipcRenderer.invoke('get-plugins'),

  // Spotify
  spotifyInit: (clientId: string, clientSecret: string, redirectUri: string) => ipcRenderer.send('spotify-init', clientId, clientSecret, redirectUri),
  spotifyPlay: () => ipcRenderer.send('spotify-play'),
  spotifyPause: () => ipcRenderer.send('spotify-pause'),
  spotifyNext: () => ipcRenderer.send('spotify-next'),
  spotifyPrev: () => ipcRenderer.send('spotify-prev'),

  // AI
  aiAsk: (context: string, msg: string) => ipcRenderer.invoke('ai-ask', context, msg),

  // Macros
  triggerMacroCombo: (keys: string[]) => ipcRenderer.send('trigger-macro-combo', keys),

  // Events
  onAppEvent: (callback: (data: any) => void) => {
    ipcRenderer.on('app-event', (_event, data) => callback(data));
  },
  removeAllAppEventListeners: () => {
    ipcRenderer.removeAllListeners('app-event');
  }
});

