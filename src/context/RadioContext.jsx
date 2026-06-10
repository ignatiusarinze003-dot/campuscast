// RadioContext.jsx — global state for the entire CampusCast app
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

const RadioContext = createContext(null);

export function RadioProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [userName, setUserName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [hostLeftMessage, setHostLeftMessage] = useState('');
  const [showEnded, setShowEnded] = useState(null);

 const [roomState, setRoomState] = useState({
    host: null,
    listeners: [],
    queue: [],
    currentSong: null,
    shoutouts: [],
    vote: null,
    archive: [],
    questions: [],
  });

  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState([]);

  // Keep isHost accessible inside socket callbacks
  const isHostRef = useRef(false);
  const userNameRef = useRef('');

  useEffect(() => {
   const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  withCredentials: true,
});

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socket.on('reconnect', (attempt) => {
      console.log('Reconnected after', attempt, 'attempts');
      setConnected(true);
      if (userNameRef.current) {
        if (isHostRef.current) {
          socket.emit('host-join', userNameRef.current);
        } else {
          socket.emit('listener-join', userNameRef.current);
        }
      }
    });

    socket.on('host-left', (data) => {
      setHostLeftMessage(data.message);
      setTimeout(() => setHostLeftMessage(''), 5000);
    });

    socket.on('show-ended', (record) => {
      setShowEnded(record);
    });

   socket.on('room-state', (state) => {
      setRoomState({
        host: state.host ?? null,
        listeners: state.listeners ?? [],
        queue: state.queue ?? [],
        currentSong: state.currentSong ?? null,
        shoutouts: state.shoutouts ?? [],
        vote: state.vote ?? null,
        archive: state.archive ?? [],
        questions: state.questions ?? [],
      });
    });
    
    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('reaction', (data) => {
      const key = Date.now();
      setReactions((prev) => [...prev, { ...data, key }]);
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.key !== key));
      }, 3000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ── Actions ──────────────────────────────────────────

  const joinAsHost = (name) => {
    setUserName(name);
    setIsHost(true);
    isHostRef.current = true;
    userNameRef.current = name;
    socketRef.current?.emit('host-join', name);
  };

  const joinAsListener = (name) => {
    setUserName(name);
    setIsHost(false);
    isHostRef.current = false;
    userNameRef.current = name;
    socketRef.current?.emit('listener-join', name);
  };

  const sendMessage = (message) => {
    socketRef.current?.emit('chat-message', { name: userName, message });
  };

  const requestCallIn = () => {
    socketRef.current?.emit('request-callin', userName);
  };

  const removeFromQueue = (id) => {
    socketRef.current?.emit('remove-from-queue', id);
  };

  const updateSong = (song) => {
    socketRef.current?.emit('update-song', song);
  };

  const sendShoutout = (message) => {
    socketRef.current?.emit('send-shoutout', { name: userName, message });
  };

  const sendReaction = (emoji) => {
    socketRef.current?.emit('send-reaction', emoji);
  };

  const startVote = (songs) => {
    socketRef.current?.emit('start-vote', songs);
  };

  const castVote = (songIndex) => {
    socketRef.current?.emit('cast-vote', songIndex);
  };

  const endVote = () => {
    socketRef.current?.emit('end-vote');
  };

  const endShow = () => {
    socketRef.current?.emit('end-show');
  };

  const askQuestion = (question) => {
    socketRef.current?.emit('ask-question', { question });
  };

  const answerQuestion = (id) => {
    socketRef.current?.emit('answer-question', id);
  };

  const value = {
    connected,
    userName,
    isHost,
    roomState,
    messages,
    reactions,
    hostLeftMessage,
    showEnded,
    joinAsHost,
    joinAsListener,
    sendMessage,
    requestCallIn,
    removeFromQueue,
    updateSong,
    sendShoutout,
    sendReaction,
    startVote,
    castVote,
    endVote,
    endShow,
    askQuestion,
    answerQuestion,
  };

  return (
    <RadioContext.Provider value={value}>
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used inside a RadioProvider');
  }
  return context;
}