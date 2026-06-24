import { useState, useEffect } from 'react';
import { X, Key, Save } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const [geminiKey, setGeminiKey] = useState('');
  const [tiktokUser, setTiktokUser] = useState('');
  const [spotifyClientId, setSpotifyClientId] = useState('');
  const [spotifyClientSecret, setSpotifyClientSecret] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load from electron-store
    async function load() {
      if (window.electronAPI) {
        const key = await window.electronAPI.storeGet('gemini_api_key');
        const user = await window.electronAPI.storeGet('tiktok_username');
        const sId = await window.electronAPI.storeGet('spotify_client_id');
        const sSecret = await window.electronAPI.storeGet('spotify_client_secret');
        if (key) setGeminiKey(key);
        if (user) setTiktokUser(user);
        if (sId) setSpotifyClientId(sId);
        if (sSecret) setSpotifyClientSecret(sSecret);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (window.electronAPI) {
      await window.electronAPI.storeSet('gemini_api_key', geminiKey);
      await window.electronAPI.storeSet('tiktok_username', tiktokUser);
      await window.electronAPI.storeSet('spotify_client_id', spotifyClientId);
      await window.electronAPI.storeSet('spotify_client_secret', spotifyClientSecret);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      
      // Initialize spotify with new credentials
      if (spotifyClientId && spotifyClientSecret) {
        window.electronAPI.spotifyInit(spotifyClientId, spotifyClientSecret, 'http://localhost:8888/callback');
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-bg-panel w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-bg-panel z-10">
          <h2 className="font-bold flex items-center gap-2">
            <Key size={18} className="text-accent" />
            Configuraciones de Integración
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-white/10 cursor-pointer">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 flex-1">
          {/* Gemini & TikTok */}
          <div className="space-y-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <label className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Gemini API Key</label>
              <input 
                type="password" 
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <p className="text-[11px] text-gray-500">Usada para el módulo Auto-Piloto (TTS e interactividad Autónoma).</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase text-gray-400 font-semibold tracking-wider">TikTok Username</label>
              <input 
                type="text" 
                value={tiktokUser}
                onChange={(e) => setTiktokUser(e.target.value)}
                placeholder="@username"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <p className="text-[11px] text-gray-500">El usuario a rastrear para recibir comentarios y regalos (No requiere contraseña).</p>
            </div>
          </div>

          {/* Spotify */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/80">Spotify API (Control de Reproducción)</h3>
            <p className="text-xs text-gray-400">Crea una app en <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer" className="text-accent hover:underline">Spotify Developer</a> y establece la Redirect URI a <code>http://localhost:8888/callback</code></p>
            
            <div className="space-y-2">
              <label className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Client ID</label>
              <input 
                type="text" 
                value={spotifyClientId}
                onChange={(e) => setSpotifyClientId(e.target.value)}
                placeholder="Tu Client ID..."
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Client Secret</label>
              <input 
                type="password" 
                value={spotifyClientSecret}
                onChange={(e) => setSpotifyClientSecret(e.target.value)}
                placeholder="Tu Client Secret..."
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-black/20 border-t border-white/10 flex justify-end items-center gap-4 sticky bottom-0">
          {saved && <span className="text-green-400 text-xs animate-pulse">Guardado localmente</span>}
          <button onClick={onClose} className="text-sm font-medium text-gray-400 hover:text-white cursor-pointer">Cancelar</button>
          <button onClick={handleSave} className="bg-accent hover:bg-purple-500 text-white text-sm font-medium px-6 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
            <Save size={16} />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
