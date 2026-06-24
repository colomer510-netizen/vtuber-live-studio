# 🎙️ VTuber Live Studio (Next-Gen Stream Automation)

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Electron](https://img.shields.io/badge/Electron-32.0.0-47848F?logo=electron)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-VRM-black?logo=three.js)

> ⚠️ **Development Note:** This project is currently in the active development phase. Features and APIs may change.

**VTuber Live Studio** is an all-in-one, highly interactive streaming platform designed for VTubers and content creators. It bridges the gap between your audience (TikTok Live & WhatsApp), your computer (PC Macros, Spotify), and a fully autonomous 3D Avatar powered by AI.

---

## 🚀 Features

- 🎭 **3D VTuber Integration (`@pixiv/three-vrm`)**
  Load your own `.vrm` avatar directly into the application. Features automatic idle animations (breathing, blinking) and real-time Lip Sync synchronized with Text-to-Speech (TTS).

- 🧠 **AI Auto-Pilot (Google Gemini 3.5 Flash)**
  Your avatar isn't just a 3D model; it's a co-host. Viewers can ask questions using `@vtuber` or `!ask` in the chat, and the AI will generate friendly responses that the avatar reads out loud automatically.

- 📱 **Multi-Platform Live Chat**
  - **TikTok Live:** Reads comments and triggers alerts/TTS for gifts and likes in real-time.
  - **WhatsApp Web:** Seamlessly connects via an integrated QR scanner to bring WhatsApp messages into your stream event hub.

- ⚙️ **Hardware & PC Automation (Macros)**
  Control your stream and computer directly from the chat:
  - `!play` / `!pause` / `!next`: Controls your local Spotify or media players.
  - `!mute`: Automatically triggers `Ctrl+Shift+M` (or any custom macro) on your PC to mute your microphone.

- 🎮 **Plugin & Mini-Game Canvas**
  A layered HTML5 canvas structure allows you to load interactive overlay games (e.g., drop games) in the background while the VTuber layer remains active in the foreground.

---

## 🛠️ Tech Stack

- **Framework:** Electron + Vite + React
- **3D Graphics:** React Three Fiber (`@react-three/fiber`) + Three.js
- **Avatar Format:** VRM (`@pixiv/three-vrm`)
- **AI Engine:** Google Generative AI (Gemini Flash)
- **Connections:** `tiktok-live-connector`, `whatsapp-web.js`
- **Automation:** `node-key-sender`
- **Styling:** Tailwind CSS

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/vtuber-live-studio.git
   cd vtuber-live-studio/app-core
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Add your Avatar:**
   Place your 3D VTuber model in the `public` folder and rename it to `avatar.vrm`.

4. **Environment Variables & Keys:**
   Open the settings in the UI to configure your **Google Gemini API Key** and your **TikTok Username**.

5. **Start the application:**
   ```bash
   npm run dev
   ```

---

## 🛡️ Security Architecture

This application strictly follows Electron's highest security standards. The frontend (`React`) has absolutely no direct access to Node.js modules. All API calls, system commands, and hardware macros are routed through a strictly typed `contextBridge` IPC interface, eliminating arbitrary code execution risks from malicious chat messages.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
