import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import AvatarViewer from './components/AvatarViewer';
import TugOfWarGame from './components/TugOfWarGame';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Conectar al backend local
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to local game server');
    });

    newSocket.on('tiktok:chat', (data) => {
      setEvents(prev => [...prev.slice(-4), { type: 'chat', ...data }]);
    });

    newSocket.on('tiktok:gift', (data) => {
      setEvents(prev => [...prev.slice(-4), { type: 'gift', ...data }]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="app-container">
      {/* Visualizador del Avatar 3D en la esquina izquierda */}
      <div className="avatar-container">
        <AvatarViewer />
      </div>

      {/* Contenedor principal del Juego */}
      <div className="game-container">
        <h1 style={{ color: 'var(--primary)', textShadow: '0 0 10px var(--primary)', marginBottom: '40px' }}>
          TIKTOK BATTLE ARENA
        </h1>
        <TugOfWarGame socket={socket} />
      </div>

      {/* Registro de Eventos (Event Log) */}
      <div className="event-log glass-panel">
        <h3 style={{ marginBottom: '10px', fontSize: '14px', color: 'var(--secondary)' }}>Live Feed</h3>
        {events.map((ev, idx) => (
          <div key={idx} className="log-entry">
            <strong>{ev.uniqueId}</strong>: {ev.type === 'chat' ? ev.comment : `Envió ${ev.giftName} x${ev.repeatCount}`}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
