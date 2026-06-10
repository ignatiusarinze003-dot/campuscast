# 🎙️ CampusCast

> A live, interactive campus radio station — built for students, by students.

CampusCast is a real-time web application that lets one student host a live radio show while others tune in as an audience. Listeners can chat, vote on songs, call in, send shoutouts, submit anonymous questions, and react with emojis — all live and in real time.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Installation

**1. Clone or download the project**
```bash
cd campuscast
```

**2. Install all dependencies**
```bash
npm install
```

**3. Start the backend server**
```bash
node server/index.js
```

**4. In a second terminal, start the frontend**
```bash
npm run dev
```

**5. Open the app**
```
http://localhost:5173
```

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🎙️ Live Hosting | Host your own show as a DJ |
| 🎵 Music Player | Display and update the currently playing song |
| 💬 Live Chat | Real-time audience chat |
| 📞 Call-In Queue | Listeners request to join the host on air |
| 🗳️ Song Voting | Host proposes 3 songs — audience votes |
| 📢 Shoutouts | Scrolling dedication ticker |
| ❓ Anonymous Ask Box | Listeners submit questions without identity |
| 📼 Show Archive | Completed sessions saved automatically |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router DOM, Vite |
| Backend | Node.js, Express |
| Real-time | Socket.io |
| Styling | CSS Custom Properties (no framework) |

---

## 📁 Project Structure

```
campuscast/
├── server/
│   ├── index.js        # Express + Socket.io server
│   └── rooms.js        # Room state management
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # RadioContext global state
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── styles/         # CSS theme and global styles
│   └── utils/          # Helper utility functions
└── public/             # Static assets
```

---

## 🔌 Server Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Server health confirmation |
| `/health` | GET | Live room statistics JSON |

---

## ⚡ Socket.io Events

### Client → Server
| Event | Payload | Description |
|---|---|---|
| `host-join` | name | Register as the show host |
| `listener-join` | name | Join as an audience member |
| `chat-message` | { name, message } | Send a chat message |
| `request-callin` | name | Request to call in |
| `update-song` | song | Update the current song |
| `send-shoutout` | { name, message } | Send a shoutout |
| `send-reaction` | emoji | Send an emoji reaction |
| `start-vote` | [song1, song2, song3] | Start a song vote |
| `cast-vote` | songIndex | Cast a vote |
| `end-vote` | — | End vote and set winner |
| `ask-question` | { question } | Submit anonymous question |
| `answer-question` | id | Mark question as answered |
| `end-show` | — | End the show and save archive |

### Server → Client
| Event | Payload | Description |
|---|---|---|
| `room-state` | roomObject | Full live room state |
| `chat-message` | messageObject | New chat message |
| `reaction` | { emoji, id } | Emoji reaction |
| `host-left` | { message } | Host disconnected |
| `show-ended` | showRecord | Show ended confirmation |

---

## 🎓 Built As
A student project demonstrating full-stack real-time web development using React, Node.js, Express, and Socket.io.

---

## 📄 Known Limitations
- Audio streaming requires third-party API integration (Spotify/SoundCloud)
- Show archive resets when the server restarts (no persistent database)
- Designed for local network use during the current development phase

---

*CampusCast 2026 · Made for students everywhere*