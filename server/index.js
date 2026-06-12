// index.js — CampusCast backend server
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  addListener,
  removeUser,
  addToQueue,
  removeFromQueue,
  setCurrentSong,
  getRoomState,
} from "./rooms.js";

const app = express();
const server = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL, "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.send("CampusCast server is live");
});

app.get("/health", (req, res) => {
  const room = getRoomState();
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    connections: {
      host: room.host ? room.host.name : null,
      listeners: room.listeners.length,
      queue: room.queue.length,
    },
  });
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit("room-state", getRoomState());

  socket.on("host-join", (name) => {
    const room = getRoomState();
    room.host = { id: socket.id, name };
    console.log(`Host joined: ${name}`);
    io.emit("room-state", getRoomState());
  });

  socket.on("listener-join", (name) => {
    addListener(socket.id, name);
    console.log(`Listener joined: ${name}`);
    io.emit("room-state", getRoomState());
  });

  socket.on("chat-message", (data) => {
    io.emit("chat-message", {
      id: socket.id,
      name: data.name,
      message: data.message,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("request-callin", (name) => {
    addToQueue(socket.id, name);
    io.emit("room-state", getRoomState());
  });

  socket.on("remove-from-queue", (id) => {
    removeFromQueue(id);
    io.emit("room-state", getRoomState());
  });

  socket.on("update-song", (song) => {
    setCurrentSong(song);
    io.emit("room-state", getRoomState());
  });

  socket.on("send-shoutout", (data) => {
    const room = getRoomState();
    room.shoutouts.unshift({
      name: data.name,
      message: data.message,
      time: new Date().toLocaleTimeString(),
    });
    io.emit("room-state", getRoomState());
  });

  socket.on("send-reaction", (emoji) => {
    io.emit("reaction", { emoji, id: socket.id });
  });

  socket.on("start-vote", (songs) => {
    const room = getRoomState();
    room.vote = {
      songs,
      votes: {},
      active: true,
    };
    console.log("Vote started:", songs);
    io.emit("room-state", getRoomState());
  });

  socket.on("cast-vote", (songIndex) => {
    const room = getRoomState();
    if (!room.vote || !room.vote.active) return;
    room.vote.votes[socket.id] = songIndex;
    io.emit("room-state", getRoomState());
  });

  socket.on("end-vote", () => {
    const room = getRoomState();
    if (!room.vote) return;

    const tally = {};
    Object.values(room.vote.votes).forEach((idx) => {
      tally[idx] = (tally[idx] || 0) + 1;
    });

    let winner = 0;
    let max = 0;
    Object.entries(tally).forEach(([idx, count]) => {
      if (count > max) {
        max = count;
        winner = parseInt(idx);
      }
    });

    const winnerSong = room.vote.songs[winner];
    room.currentSong = winnerSong;
    room.vote.active = false;
    room.vote.winner = winnerSong;

    console.log("Vote ended. Winner:", winnerSong);
    io.emit("room-state", getRoomState());
  });

  socket.on("end-show", () => {
    const room = getRoomState();
    const showRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      host: room.host?.name || 'Unknown',
      listenerCount: room.listeners.length,
      songsPlayed: room.currentSong ? [room.currentSong] : [],
      shoutouts: [...room.shoutouts],
      duration: 'Live session ended',
    };
    room.archive.unshift(showRecord);
    room.host = null;
    room.listeners = [];
    room.queue = [];
    room.currentSong = null;
    room.shoutouts = [];
    room.vote = null;
    room.questions = [];

    console.log("Show ended. Archive saved:", showRecord.date);
    console.log("Archive length:", room.archive.length);
    io.emit("show-ended", showRecord);
    io.emit("room-state", getRoomState());
  });

  socket.on("ask-question", (data) => {
    const room = getRoomState();
    if (!room.questions) room.questions = [];
    room.questions.unshift({
      id: Date.now(),
      question: data.question,
      answered: false,
      time: new Date().toLocaleTimeString(),
    });
    console.log("Question asked:", data.question);
    io.emit("room-state", getRoomState());
  });

  socket.on("answer-question", (data) => {
  const room = getRoomState();
  if (!room.questions) return;
  const q = room.questions.find((q) => q.id === data.id);
  if (q) {
    q.answered = true;
    q.reply = data.reply;
    q.repliedAt = new Date().toLocaleTimeString();
  }
  io.emit("room-state", getRoomState());
});

// Host starts voice broadcast
  socket.on("voice-start", () => {
    const room = getRoomState();
    room.voiceLive = true;
    console.log("Voice broadcast started");
    socket.broadcast.emit("host-voice-start", { hostId: socket.id });
    io.emit("room-state", getRoomState());
  });

  // Host stops voice broadcast
  socket.on("voice-stop", () => {
    const room = getRoomState();
    room.voiceLive = false;
    console.log("Voice broadcast stopped");
    io.emit("host-voice-stop");
    io.emit("room-state", getRoomState());
  });

  // WebRTC signaling — offer from host to listener
  socket.on("voice-offer", (data) => {
    io.to(data.targetId).emit("voice-offer", {
      offer: data.offer,
      hostId: socket.id,
    });
  });

  // WebRTC signaling — answer from listener to host
  socket.on("voice-answer", (data) => {
    io.to(data.hostId).emit("voice-answer", {
      answer: data.answer,
      listenerId: socket.id,
    });
  });

  // WebRTC signaling — ICE candidates
  socket.on("ice-candidate", (data) => {
    io.to(data.targetId).emit("ice-candidate", {
      candidate: data.candidate,
      fromId: socket.id,
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id} — reason: ${reason}`);
    removeUser(socket.id);
    const room = getRoomState();
    if (!room.host) {
      io.emit("host-left", { message: "The host has left the show." });
    }
    io.emit("room-state", getRoomState());
  });

}); // ← closes io.on("connection")

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`CampusCast server running on http://localhost:${PORT}`);
});