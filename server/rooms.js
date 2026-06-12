// rooms.js — manages the live show room state

const room = {
  host: null,
  listeners: [],
  queue: [],
  currentSong: null,
  shoutouts: [],
  reactions: [],
  vote: null,
  archive: [],
  questions: [],
  voiceLive: false,
};

export function addListener(id, name) {
  room.listeners.push({ id, name });
}

export function removeUser(id) {
  room.listeners = room.listeners.filter((l) => l.id !== id);
  room.queue = room.queue.filter((q) => q.id !== id);
  if (room.host && room.host.id === id) {
    room.host = null;
  }
}

export function addToQueue(id, name) {
  const alreadyInQueue = room.queue.find((q) => q.id === id);
  if (!alreadyInQueue) {
    room.queue.push({ id, name });
  }
}

export function removeFromQueue(id) {
  room.queue = room.queue.filter((q) => q.id !== id);
}

export function setCurrentSong(song) {
  room.currentSong = song;
}

export function getRoomState() {
  return room;
}