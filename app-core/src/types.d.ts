/// <reference types="vite/client" />

interface AppEventData {
  type: 'chat' | 'gift' | 'like' | 'status';
  source: 'tiktok' | 'whatsapp';
  user?: string;
  comment?: string;
  gift?: string;
  amount?: number;
  likes?: number;
  status?: string;
  data?: string; // e.g. QR code
}

interface Window {
  electronAPI: {
    // Store
    storeGet: (key: string) => Promise<any>;
    storeSet: (key: string, val: any) => Promise<void>;
    
    // Stream
    streamStart: (url: string, key: string) => void;
    streamStop: () => void;
    streamSendFrame: (buffer: ArrayBuffer) => void;
    
    // Plugins
    getPlugins: () => Promise<Array<{id: string, name: string, url: string, valid: boolean}>>;

    // Spotify
    spotifyInit: (clientId: string, clientSecret: string, redirectUri: string) => void;
    spotifyPlay: () => void;
    spotifyPause: () => void;
    spotifyNext: () => void;
    spotifyPrev: () => void;

    // AI
    aiAsk: (context: string, msg: string) => Promise<string>;

    // Macros
    triggerMacroCombo: (keys: string[]) => void;

    // Events
    onAppEvent: (callback: (data: AppEventData) => void) => void;
    removeAllAppEventListeners: () => void;
  };
}
