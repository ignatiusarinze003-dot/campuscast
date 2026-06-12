// VoiceBroadcast.jsx — host microphone broadcasting
import { useState, useRef, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';
import { io } from 'socket.io-client';

const SERVER_URL = 'https://campuscast-server.onrender.com';

export default function VoiceBroadcast() {
  const { roomState, userName } = useRadio();
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState('');
  const [speakingTime, setSpeakingTime] = useState(0);
  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const peersRef = useRef({});
  const timerRef = useRef(null);

  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    // When a new listener joins while host is live — send them an offer
    socket.on('listener-join', async (name) => {
      if (!isLive || !streamRef.current) return;
      const listeners = roomState.listeners;
      const listener = listeners[listeners.length - 1];
      if (listener) await createOffer(listener.id);
    });

    // Receive answer from listener
    socket.on('voice-answer', async ({ answer, listenerId }) => {
      const peer = peersRef.current[listenerId];
      if (peer) {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Receive ICE candidate
    socket.on('ice-candidate', async ({ candidate, fromId }) => {
      const peer = peersRef.current[fromId];
      if (peer && candidate) {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => socket.disconnect();
  }, [isLive]);

  const createOffer = async (listenerId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peersRef.current[listenerId] = peer;

    // Add microphone stream to peer
    streamRef.current.getTracks().forEach((track) => {
      peer.addTrack(track, streamRef.current);
    });

    // Send ICE candidates to listener
    peer.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socketRef.current.emit('ice-candidate', {
          targetId: listenerId,
          candidate,
        });
      }
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socketRef.current.emit('voice-offer', {
      targetId: listenerId,
      offer,
    });
  };

  const startBroadcast = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      socketRef.current.emit('voice-start');

      // Create offers for all current listeners
      for (const listener of roomState.listeners) {
        await createOffer(listener.id);
      }

      setIsLive(true);

      // Start speaking timer
      timerRef.current = setInterval(() => {
        setSpeakingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      setError('Microphone access denied. Please allow microphone permission.');
    }
  };

  const stopBroadcast = () => {
    // Stop microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // Close all peer connections
    Object.values(peersRef.current).forEach((peer) => peer.close());
    peersRef.current = {};

    socketRef.current.emit('voice-stop');
    setIsLive(false);
    setSpeakingTime(0);
    clearInterval(timerRef.current);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🎙️ Voice Broadcast</h3>

      {error && <p style={styles.error}>{error}</p>}

      {isLive ? (
        <div style={styles.liveState}>
          <div style={styles.liveIndicator}>
            <span style={styles.liveDot}>●</span>
            <span style={styles.liveText}>YOU ARE ON AIR</span>
            <span style={styles.timer}>{formatTime(speakingTime)}</span>
          </div>
          <p style={styles.liveDesc}>
            {roomState.listeners.length} listener{roomState.listeners.length !== 1 ? 's' : ''} can hear you
          </p>
          <button style={styles.stopBtn} onClick={stopBroadcast}>
            ⏹ End Voice Broadcast
          </button>
        </div>
      ) : (
        <div style={styles.offState}>
          <p style={styles.desc}>
            Go live with your microphone. Listeners will hear your voice in real time.
          </p>
          <button style={styles.startBtn} onClick={startBroadcast}>
            🎙️ Go Live — Start Speaking
          </button>
        </div>
      )}

      <style>{`
        @keyframes voicePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  error: {
    fontSize: '12px',
    color: 'var(--danger)',
    background: 'rgba(255,101,132,0.1)',
    padding: '8px 12px',
    borderRadius: '8px',
  },
  offState: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  desc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  startBtn: {
    background: 'linear-gradient(135deg, var(--danger), #ff8c00)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    padding: '12px 20px',
    borderRadius: 'var(--radius)',
    width: '100%',
  },
  liveState: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,101,132,0.1)',
    border: '1px solid var(--danger)',
    borderRadius: '8px',
    padding: '10px 14px',
  },
  liveDot: {
    color: 'var(--danger)',
    fontSize: '16px',
    animation: 'voicePulse 1s ease infinite',
  },
  liveText: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--danger)',
    letterSpacing: '1px',
    flex: 1,
  },
  timer: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    fontFamily: 'monospace',
  },
  liveDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  stopBtn: {
    background: 'var(--bg-secondary)',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
    fontSize: '13px',
    fontWeight: '700',
    padding: '10px 16px',
    borderRadius: '8px',
    width: '100%',
  },
};