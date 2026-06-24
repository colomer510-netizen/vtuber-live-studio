import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { TikTokConnection } from './tiktok/TikTokConnection';
import { GameManager } from './games/GameManager';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const gameManager = new GameManager(io);
const tiktokConnection = new TikTokConnection(gameManager);

app.get('/api/connect/:username', (req, res) => {
  const username = req.params.username;
  console.log(`Request to connect to ${username}`);
  tiktokConnection.connect(username)
    .then(() => {
      res.json({ success: true, message: `Connected to ${username}` });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
