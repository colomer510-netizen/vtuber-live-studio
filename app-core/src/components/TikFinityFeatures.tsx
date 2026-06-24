import { useEffect, useState, useRef } from 'react';

export default function TikFinityFeatures() {
  const [ttsEnabled] = useState(true);
  const queueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  // Sistema de Cola (Queue) para que los TTS no se solapen
  const processTTSQueue = () => {
    if (isSpeakingRef.current || queueRef.current.length === 0 || !ttsEnabled) return;

    isSpeakingRef.current = true;
    window.dispatchEvent(new CustomEvent('vrm-speaking', { detail: true }));
    const text = queueRef.current.shift()!;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES'; // Podría ser configurable
    utterance.rate = 1.1;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      window.dispatchEvent(new CustomEvent('vrm-speaking', { detail: false }));
      processTTSQueue();
    };

    utterance.onerror = (e) => {
      console.error("TTS Error", e);
      isSpeakingRef.current = false;
      window.dispatchEvent(new CustomEvent('vrm-speaking', { detail: false }));
      processTTSQueue();
    };

    window.speechSynthesis.speak(utterance);
  };

  const playTTS = (text: string) => {
    queueRef.current.push(text);
    processTTSQueue();
  };

  const playSoundAlert = () => {
    // Para simplificar, generamos un sonido beep agradable usando AudioContext nativo 
    // en lugar de depender de archivos externos, asegurando que funcione de inmediato.
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.5); // C6
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => {
    // Escuchar eventos globales del EventBus (Main Process)
    const handleAppEvent = (data: AppEventData) => {
      if (data.type === 'chat' && data.source === 'tiktok' && data.comment) {
        const comment = data.comment.trim();
        
        // Chat Commands Parsing
        if (comment.startsWith('!')) {
          const command = comment.toLowerCase();
          if (command === '!play') {
            window.electronAPI?.spotifyPlay();
            playTTS(`Reproduciendo Spotify`);
            return;
          } else if (command === '!pause') {
            window.electronAPI?.spotifyPause();
            playTTS(`Pausando Spotify`);
            return;
          } else if (command === '!next') {
            window.electronAPI?.spotifyNext();
            playTTS(`Siguiente canción`);
            return;
          } else if (command === '!mute') {
            window.electronAPI?.triggerMacroCombo(['control', 'shift', 'm']);
            playTTS(`Mutando micrófono`);
            return;
          } else if (command.startsWith('!ask ') || command.startsWith('@vtuber ')) {
            const question = comment.replace(/^(!ask|@vtuber)\s+/i, '');
            if (question) {
              window.electronAPI?.aiAsk('Stream de TikTok de Joaquin', question).then(respuesta => {
                playTTS(respuesta);
              });
              return;
            }
          }
        }

        // TTS para el chat (solo si no es comando)
        playTTS(`${data.user} dice: ${data.comment}`);
      } else if (data.type === 'gift' && data.source === 'tiktok') {
        // Sound Alert + TTS para regalos
        playSoundAlert();
        setTimeout(() => {
          playTTS(`¡Gracias ${data.user} por enviar ${data.amount} ${data.gift}!`);
        }, 600); // Esperar a que pase el sonido
      }
    };

    if (window.electronAPI) {
      window.electronAPI.onAppEvent(handleAppEvent);
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeAllAppEventListeners();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ttsEnabled]);

  return null; // Componente lógico, sin UI visible
}
