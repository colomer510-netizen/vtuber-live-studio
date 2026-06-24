import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import Store from 'electron-store'
import { startFfmpegStream, stopFfmpegStream, writeFrameToFfmpeg } from './ffmpegStream'

const store = new Store();

// Configurar manejadores IPC para el store local de forma segura
ipcMain.handle('electron-store-get', async (event, val) => {
  return store.get(val);
});
ipcMain.handle('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

// IPC para Streaming de FFmpeg
ipcMain.on('start-stream', (event, rtmpUrl, streamKey) => {
  startFfmpegStream(rtmpUrl, streamKey);
});

ipcMain.on('stop-stream', () => {
  stopFfmpegStream();
});

ipcMain.on('stream-frame', (event, buffer) => {
  writeFrameToFfmpeg(buffer);
});

const __dirname = dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - SystemJS only
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

import { setupEventBus } from './services/eventBus'
import { setupPluginsManager } from './services/plugins'

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: join(process.env.VITE_PUBLIC, 'favicon.svg'),
    webPreferences: {
      preload: join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true, // Fortificado para seguridad
    },
  })

  // Configurar el Bus de Eventos unificado y el gestor de plugins
  setupEventBus(win, store);
  setupPluginsManager();

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.whenReady().then(createWindow)
