import { useEffect, useState } from 'react';
import { MessageSquare, Heart, Gift } from 'lucide-react';

export default function SidebarRight() {
  const [events, setEvents] = useState<any[]>([]);
  const [whatsappQr, setWhatsappQr] = useState<string | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<string>('Desconectado');

  useEffect(() => {
    const handleAppEvent = (data: any) => {
      if (data.type === 'status' && data.source === 'whatsapp') {
        if (data.status === 'qr') {
          setWhatsappQr(data.data);
          setWhatsappStatus('Escanea el QR');
        } else if (data.status === 'connected') {
          setWhatsappQr(null);
          setWhatsappStatus('Conectado');
        }
      } else if (['chat', 'gift', 'like'].includes(data.type)) {
        setEvents(prev => [{...data, id: Date.now() + Math.random()}, ...prev].slice(0, 50));
      }
    };

    if (window.electronAPI) {
      window.electronAPI.onAppEvent(handleAppEvent);
    }
  }, []);

  return (
    <aside className="w-80 bg-bg-panel border-l border-white/5 flex flex-col h-full shadow-xl z-10">
      <div className="p-6 border-b border-white/5">
        <h2 className="font-semibold flex items-center gap-2">
          <MessageSquare size={18} className="text-accent" />
          Event Hub
        </h2>
      </div>

      {/* Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {events.length === 0 && <p className="text-gray-500 text-sm text-center">No hay eventos aún</p>}
        {events.map((ev) => (
          <EventItem 
            key={ev.id} 
            type={ev.type} 
            user={ev.user} 
            message={ev.comment || `Envió ${ev.amount || ''} ${ev.gift || 'likes'}`} 
            highlight={ev.type === 'gift'} 
          />
        ))}
      </div>

      {/* Connections Status */}
      <div className="p-4 border-t border-white/5 space-y-3">
        {whatsappQr && (
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(whatsappQr)}`} 
              alt="WhatsApp QR" 
              className="w-32 h-32"
            />
            <p className="text-xs text-black mt-2 text-center font-semibold">Escanea con WhatsApp</p>
          </div>
        )}
        <div className="flex justify-between items-center text-xs p-2 bg-green-500/10 text-green-400 rounded">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> TikTok Live</span>
          <span>Esperando...</span>
        </div>
        <div className={`flex justify-between items-center text-xs p-2 rounded ${whatsappStatus === 'Conectado' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
          <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${whatsappStatus === 'Conectado' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} /> WhatsApp</span>
          <span>{whatsappStatus}</span>
        </div>
      </div>
    </aside>
  );
}

function EventItem({ type, user, message, highlight }: { type: 'chat'|'like'|'gift', user: string, message: string, highlight?: boolean }) {
  const icons = {
    chat: <MessageSquare size={14} />,
    like: <Heart size={14} className="text-red-400" />,
    gift: <Gift size={14} className="text-accent" />
  };

  return (
    <div className={`p-3 rounded-lg text-sm border ${highlight ? 'bg-accent/10 border-accent/30' : 'bg-black/20 border-white/5'}`}>
      <div className="flex items-center gap-2 mb-1">
        {icons[type]}
        <span className="font-medium text-gray-200">{user}</span>
      </div>
      <p className="text-gray-400 text-xs">{message}</p>
    </div>
  );
}
