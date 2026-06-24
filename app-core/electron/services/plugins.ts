import fs from 'node:fs';
import path from 'node:path';
import { app, ipcMain } from 'electron';

export function setupPluginsManager() {
  const pluginsDir = app.isPackaged 
    ? path.join(process.resourcesPath, 'plugins')
    : path.join(__dirname, '../../plugins'); // Proyecto raíz
  
  // Crear carpeta de plugins si no existe
  if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true });
  }

  ipcMain.handle('get-plugins', async () => {
    try {
      const directories = fs.readdirSync(pluginsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
          const pluginPath = path.join(pluginsDir, dirent.name);
          const hasIndex = fs.existsSync(path.join(pluginPath, 'index.html'));
          return {
            id: dirent.name,
            name: dirent.name.replace(/-/g, ' ').toUpperCase(),
            url: `file:///${path.join(pluginPath, 'index.html').replace(/\\/g, '/')}`,
            valid: hasIndex
          };
        });
      
      return directories.filter(d => d.valid);
    } catch (e) {
      console.error('Error reading plugins:', e);
      return [];
    }
  });
}
