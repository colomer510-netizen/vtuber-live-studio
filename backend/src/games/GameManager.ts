import { Server } from 'socket.io';

export class GameManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  // En un diseño escalable, GameManager solo rutea los eventos
  // a los juegos específicos o los envía al frontend
  public handleEvent(type: 'chat' | 'gift' | 'like', payload: any) {
    console.log(`[TikTok Event] ${type}:`, payload);
    this.io.emit(`tiktok:${type}`, payload);
  }
}
