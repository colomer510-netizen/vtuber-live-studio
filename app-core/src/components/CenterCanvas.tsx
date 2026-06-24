import VTuberLayer from './VTuberLayer';
import { useEffect, useState } from 'react';

export default function CenterCanvas() {
  const [activePluginUrl, setActivePluginUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlugins() {
      if (window.electronAPI) {
        const plugins = await window.electronAPI.getPlugins();
        if (plugins.length > 0) {
          setActivePluginUrl(plugins[0].url); // Carga el primer plugin disponible (ej. drop-game)
        }
      }
    }
    loadPlugins();
  }, []);

  return (
    <div className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden relative flex flex-col items-center justify-center group">
      {/* Game Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 flex items-center justify-center overflow-hidden">
        {activePluginUrl ? (
          <iframe 
            src={activePluginUrl} 
            className="w-full h-full border-none"
            title="Active Game Plugin"
          />
        ) : (
          <span className="text-white/20 font-mono tracking-widest uppercase text-sm">No Plugin Loaded</span>
        )}
      </div>
      
      {/* VTuber Layer */}
      <div className="absolute bottom-0 w-[250px] h-[350px] bg-transparent border border-white/10 rounded-t-3xl backdrop-blur-sm overflow-hidden flex items-center justify-center cursor-move transition-colors hover:bg-white/5">
        <VTuberLayer />
      </div>
      
      <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Live Preview
      </div>
    </div>
  );
}
