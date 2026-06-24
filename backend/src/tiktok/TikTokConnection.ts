import { WebcastPushConnection } from 'tiktok-live-connector';
import { GameManager } from '../games/GameManager';

export class TikTokConnection {
  private tiktokLiveConnection: WebcastPushConnection | null = null;
  private gameManager: GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  public async connect(username: string): Promise<void> {
    if (this.tiktokLiveConnection) {
      this.tiktokLiveConnection.disconnect();
    }

    this.tiktokLiveConnection = new WebcastPushConnection(username);

    return new Promise((resolve, reject) => {
      this.tiktokLiveConnection!.connect()
        .then(state => {
          console.info(`Connected to roomId ${state.roomId}`);
          this.setupEvents();
          resolve();
        })
        .catch(err => {
          console.error('Failed to connect', err);
          reject(err);
        });
    });
  }

  private setupEvents() {
    if (!this.tiktokLiveConnection) return;

    this.tiktokLiveConnection.on('chat', data => {
      this.gameManager.handleEvent('chat', {
        uniqueId: data.uniqueId,
        comment: data.comment,
        profilePictureUrl: data.profilePictureUrl
      });
    });

    this.tiktokLiveConnection.on('gift', data => {
      if (data.giftType === 1 && !data.repeatEnd) {
        return; // Streak in progress
      }
      this.gameManager.handleEvent('gift', {
        uniqueId: data.uniqueId,
        giftName: data.giftName,
        giftId: data.giftId,
        repeatCount: data.repeatCount,
        profilePictureUrl: data.profilePictureUrl
      });
    });

    this.tiktokLiveConnection.on('like', data => {
      this.gameManager.handleEvent('like', {
        uniqueId: data.uniqueId,
        likeCount: data.likeCount,
        profilePictureUrl: data.profilePictureUrl
      });
    });
  }
}
