import { Client, LocalAuth } from 'whatsapp-web.js';
import { EventEmitter } from 'events';

export const whatsappEvents = new EventEmitter();
let whatsappClient: Client | null = null;

export function initializeWhatsApp() {
  if (whatsappClient) return;

  whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true } // Utiliza puppeteer oculto para whatsapp web
  });

  whatsappClient.on('qr', (qr) => {
    // Emitir QR para que el frontend lo muestre
    whatsappEvents.emit('qr', qr);
  });

  whatsappClient.on('ready', () => {
    console.log('WhatsApp Web Client is ready!');
    whatsappEvents.emit('ready');
  });

  whatsappClient.on('message', message => {
    whatsappEvents.emit('message', {
      from: message.from,
      body: message.body
    });
  });

  whatsappClient.initialize();
}
