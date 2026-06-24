import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { WebcastPushConnection } = require('tiktok-live-connector');
import { EventEmitter } from 'events';

export const tiktokEvents = new EventEmitter();
let tiktokConnection: WebcastPushConnection | null = null;

export function connectTikTok(username: string) {
  if (tiktokConnection) {
    tiktokConnection.disconnect();
  }

  tiktokConnection = new WebcastPushConnection(username);

  tiktokConnection.connect().then(state => {
    console.log(`Connected to TikTok Live as ${state.roomInfo.owner.display_id}`);
    tiktokEvents.emit('connected', state);
  }).catch(err => {
    console.error('Failed to connect to TikTok Live', err);
    tiktokEvents.emit('error', err);
  });

  tiktokConnection.on('chat', data => {
    tiktokEvents.emit('chat', { user: data.uniqueId, comment: data.comment });
  });

  tiktokConnection.on('gift', data => {
    tiktokEvents.emit('gift', { user: data.uniqueId, gift: data.giftName, amount: data.repeatCount });
  });

  tiktokConnection.on('like', data => {
    tiktokEvents.emit('like', { user: data.uniqueId, likes: data.likeCount });
  });
}

export function disconnectTikTok() {
  if (tiktokConnection) {
    tiktokConnection.disconnect();
    tiktokConnection = null;
    tiktokEvents.emit('disconnected');
  }
}
