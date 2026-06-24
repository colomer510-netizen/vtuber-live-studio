import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
}

const TugOfWarGame: React.FC<Props> = ({ socket }) => {
  const [redScore, setRedScore] = useState(50);
  const [blueScore, setBlueScore] = useState(50);

  useEffect(() => {
    if (!socket) return;

    const handleChat = (data: any) => {
      const msg = data.comment.toLowerCase();
      if (msg.includes('rojo') || msg.includes('red')) {
        setRedScore(prev => Math.min(95, prev + 1));
        setBlueScore(prev => Math.max(5, prev - 1));
      } else if (msg.includes('azul') || msg.includes('blue')) {
        setBlueScore(prev => Math.min(95, prev + 1));
        setRedScore(prev => Math.max(5, prev - 1));
      }
    };

    const handleGift = (data: any) => {
      // Regalos dan un empujón más fuerte (aleatorio por ahora para el demo)
      const isRed = Math.random() > 0.5;
      const power = data.repeatCount * 5;
      if (isRed) {
        setRedScore(prev => Math.min(95, prev + power));
        setBlueScore(prev => Math.max(5, prev - power));
      } else {
        setBlueScore(prev => Math.min(95, prev + power));
        setRedScore(prev => Math.max(5, prev - power));
      }
    };

    socket.on('tiktok:chat', handleChat);
    socket.on('tiktok:gift', handleGift);

    return () => {
      socket.off('tiktok:chat', handleChat);
      socket.off('tiktok:gift', handleGift);
    };
  }, [socket]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginBottom: '10px' }}>
        <h2 style={{ color: '#ff0055', textShadow: '0 0 10px #ff0055' }}>EQUIPO ROJO</h2>
        <h2 style={{ color: '#00f3ff', textShadow: '0 0 10px #00f3ff' }}>EQUIPO AZUL</h2>
      </div>
      <div className="tug-of-war">
        <div className="team-red" style={{ width: `${redScore}%` }}>{redScore}%</div>
        <div className="team-blue" style={{ width: `${blueScore}%` }}>{blueScore}%</div>
        <div className="center-marker"></div>
      </div>
      <p style={{ marginTop: '20px', color: '#ccc' }}>Escribe "Rojo" o "Azul" en el chat para empujar.</p>
    </div>
  );
};

export default TugOfWarGame;
