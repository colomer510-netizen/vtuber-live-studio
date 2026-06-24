import { Settings, Play, Video, Bot, Gamepad2 } from 'lucide-react';

interface Props {
  onOpenSettings: () => void;
}

export default function SidebarLeft({ onOpenSettings }: Props) {
  return (
    <aside className="w-72 bg-bg-panel border-r border-white/5 flex flex-col h-full shadow-xl z-10">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">VTuber Core</h1>
        <button onClick={onOpenSettings} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
          <Settings size={20} />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-8">
        {/* Stream Control */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Broadcast</h2>
          <button 
            onClick={() => {
              if (window.electronAPI) {
                window.electronAPI.streamStart('rtmp://your.rtmp.server/live', 'YOUR_STREAM_KEY');
                alert('Iniciando FFmpeg Stream...');
              }
            }}
            className="w-full bg-accent hover:bg-purple-500 text-white font-medium py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(170,59,255,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play fill="currentColor" size={18} />
            <span>Go Live (Multi-RTMP)</span>
          </button>
        </section>

        {/* Modules */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Modules</h2>
          <div className="space-y-2">
            <ModuleToggle icon={<Video size={18} />} title="Webcam (Mediapipe)" active={true} />
            <ModuleToggle icon={<Bot size={18} />} title="AI Auto-Pilot" active={false} />
          </div>
        </section>

        {/* Plugins */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Active Game</h2>
          <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
              <Gamepad2 size={24} />
            </div>
            <div>
              <p className="font-medium text-sm">Drop Game</p>
              <p className="text-xs text-gray-400">Plugin loaded</p>
            </div>
          </div>
        </section>
        {/* Controls */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => window.electronAPI?.spotifyPlay()}
              className="bg-black/30 hover:bg-white/10 border border-white/5 py-2 rounded-lg text-sm transition-colors text-gray-300"
            >
              ▶ Play
            </button>
            <button 
              onClick={() => window.electronAPI?.spotifyPause()}
              className="bg-black/30 hover:bg-white/10 border border-white/5 py-2 rounded-lg text-sm transition-colors text-gray-300"
            >
              ⏸ Pause
            </button>
            <button 
              onClick={() => window.electronAPI?.spotifyNext()}
              className="bg-black/30 hover:bg-white/10 border border-white/5 py-2 rounded-lg text-sm transition-colors text-gray-300"
            >
              ⏭ Next
            </button>
            <button 
              onClick={() => window.electronAPI?.triggerMacroCombo(['control', 'shift', 'm'])}
              className="bg-black/30 hover:bg-white/10 border border-white/5 py-2 rounded-lg text-sm transition-colors text-gray-300 flex items-center justify-center gap-1"
            >
              🎤 Mute
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
}

function ModuleToggle({ icon, title, active }: { icon: React.ReactNode, title: string, active: boolean }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${active ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-accent' : 'bg-gray-700'}`}>
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${active ? 'translate-x-4' : ''}`} />
      </div>
    </div>
  );
}
