// VoiceListener.jsx — listener receives host voice
import { useState, useRef, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';
import { io } from 'socket.io-client';

const SERVER_URL = 'https://campuscast-server.onrender.com';

export default function VoiceListener() {
  const { roomState } = useRadio();
  const [hostSpeaking, setHostSpeaking] = useState(false);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    // Host started voice broadcast
    socket.on('host-voice-start', ({ hostId }) => {
      setHostSpeaking(true);
    });

    // Host stopped voice broadcast
    socket.on('host-voice-stop', () => {
      setHostSpeaking(false);
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }
    });

    // Receive offer from host
    socket.on('voice-offer', async ({ offer, hostId }) => {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      peerRef.current = peer;

      // When host audio track arrives — play it
      peer.ontrack = (event) => {
        if (audioRef.current) {
          audioRef.current.srcObject = event.streams[0];
          audioRef.current.play().catch(() => {});
        }
      };

      // Send ICE candidates to host
      peer.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit('ice-candidate', {
            targetId: hostId,
            candidate,
          });
        }
      };

      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit('voice-answer', { answer, hostId });
    });

    // Receive ICE candidate from host
    socket.on('ice-candidate', async ({ candidate, fromId }) => {
      if (peerRef.current && candidate) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.disconnect();
      if (peerRef.current) peerRef.current.close();
    };
  }, []);

  return (
    <div style={styles.container}>

      {/* Hidden audio element that plays host voice */}
      <audio ref={audioRef} autoPlay style={{ display: 'none' }} />

      {hostSpeaking ? (
        <div style={styles.speaking}>
          <div style={styles.speakingRow}>
            <span style={styles.speakingDot}>●</span>
            <span style={styles.speakingText}>
              🎙️ {roomState.host?.name || 'Host'} is speaking live
            </span>
          </div>
          <div style={styles.waveRow}>
            {[1,2,3,4,5].map((i) => (
              <div
                key={i}
                style={{
                  ...styles.wave,
                  animationDelay: `${i * 0.1}s`,
                  height: `${10 + Math.random() * 20}px`,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.silent}>
          <span style={styles.silentIcon}>🎙️</span>
          <p style={styles.silentText}>
            {roomState.host
              ? `Waiting for ${roomState.host.name} to speak...`
              : 'No host connected'}
          </p>
        </div>
      )}

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2); }
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
    padding: '16px 18px',
  },
  speaking: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  speakingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  speakingDot: {
    color: 'var(--danger)',
    fontSize: '14px',
    animation: 'voicePulse 1s ease infinite',
  },
  speakingText: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  waveRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    height: '30px',
  },
  wave: {
    width: '4px',
    background: 'var(--accent)',
    borderRadius: '2px',
    animation: 'wave 0.6s ease infinite',
  },
  silent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  silentIcon: {
    fontSize: '20px',
    opacity: 0.4,
  },
  silentText: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
};