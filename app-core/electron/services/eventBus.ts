import { ipcMain, BrowserWindow } from 'electron';
import { tiktokEvents, connectTikTok, disconnectTikTok } from './tiktok';
import { whatsappEvents, initializeWhatsApp } from './whatsapp';
import { initializeAI, generateAutoPilotResponse } from './ai';
import { sendKeystroke, sendCombination } from './macros';
import { initializeSpotify, setSpotifyTokens, spotifyPlay, spotifyPause, spotifyNext, spotifyPrev } from './spotify';
import Store from 'electron-store';

export function setupEventBus(window: BrowserWindow, store: Store) {
  // TikTok IPC
  ipcMain.on('tiktok-connect', async () => {
    const username = store.get('tiktok_username') as string;
    if (username) {
      connectTikTok(username);
    }
  });
  
  ipcMain.on('tiktok-disconnect', () => disconnectTikTok());

  tiktokEvents.on('chat', (data) => window.webContents.send('app-event', { type: 'chat', source: 'tiktok', ...data }));
  tiktokEvents.on('gift', (data) => window.webContents.send('app-event', { type: 'gift', source: 'tiktok', ...data }));
  tiktokEvents.on('like', (data) => window.webContents.send('app-event', { type: 'like', source: 'tiktok', ...data }));
  tiktokEvents.on('connected', () => window.webContents.send('app-event', { type: 'status', source: 'tiktok', status: 'connected' }));

  // WhatsApp IPC
  ipcMain.on('whatsapp-init', () => initializeWhatsApp());
  whatsappEvents.on('qr', (qr) => window.webContents.send('app-event', { type: 'status', source: 'whatsapp', status: 'qr', data: qr }));
  whatsappEvents.on('ready', () => window.webContents.send('app-event', { type: 'status', source: 'whatsapp', status: 'connected' }));
  whatsappEvents.on('message', (data) => window.webContents.send('app-event', { type: 'chat', source: 'whatsapp', ...data }));

  // AI IPC
  ipcMain.on('ai-init', () => {
    const key = store.get('gemini_api_key') as string;
    if (key) initializeAI(key);
  });
  
  ipcMain.handle('ai-ask', async (event, context, msg) => {
    return await generateAutoPilotResponse(context, msg);
  });

  // Macros IPC
  ipcMain.on('trigger-macro', async (event, key) => {
    await sendKeystroke(key);
  });

  ipcMain.on('trigger-macro-combo', async (event, keys) => {
    await sendCombination(keys);
  });

  // Spotify IPC
  ipcMain.on('spotify-init', (event, clientId, clientSecret, redirectUri) => {
    initializeSpotify(clientId, clientSecret, redirectUri);
  });

  ipcMain.on('spotify-set-tokens', (event, accessToken, refreshToken) => {
    setSpotifyTokens(accessToken, refreshToken);
  });

  ipcMain.on('spotify-play', () => spotifyPlay());
  ipcMain.on('spotify-pause', () => spotifyPause());
  ipcMain.on('spotify-next', () => spotifyNext());
  ipcMain.on('spotify-prev', () => spotifyPrev());
}
