import { useState } from 'react'
import SidebarLeft from './components/SidebarLeft'
import CenterCanvas from './components/CenterCanvas'
import SidebarRight from './components/SidebarRight'
import SettingsModal from './components/SettingsModal'
import TikFinityFeatures from './components/TikFinityFeatures'

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-bg-dark text-white overflow-hidden font-sans">
      <TikFinityFeatures />
      <SidebarLeft onOpenSettings={() => setShowSettings(true)} />
      
      <main className="flex-1 flex items-center justify-center bg-black/50 p-4 relative">
        <CenterCanvas />
      </main>

      <SidebarRight />

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

export default App
