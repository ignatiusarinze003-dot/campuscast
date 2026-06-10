// HostDashboard.jsx — host control panel
import { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import ListenerQueue from './ListenerQueue';
import Toast from './Toast';

export default function HostDashboard() {
  const {
    userName,
    roomState,
    connected,
    updateSong,
    sendShoutout,
    sendReaction,
  } = useRadio();

  const [songInput, setSongInput] = useState('');
  const [shoutoutInput, setShoutoutInput] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSongUpdate = () => {
    if (!songInput.trim()) return;
    updateSong(songInput.trim());
    setSongInput('');
    showToast('🎵 Now playing updated!');
  };

  const handleShoutout = () => {
    if (!shoutoutInput.trim()) return;
    sendShoutout(shoutoutInput.trim());
    setShoutoutInput('');
    showToast('📢 Shoutout sent!');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/listen');
    setShowCopied(true);
    showToast('🔗 Link copied!');
    setTimeout(() => setShowCopied(false), 2000);
  };

  const emojis = ['🔥', '❤️', '😂', '🎵', '👏', '💜'];

  return (
    <div style={styles.container}>

      {/* Top status bar */}
      <div style={styles.statusBar}>
        <div style={styles.hostInfo}>
          <div style={styles.avatar}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={styles.hostName}>{userName}</p>
            <p style={styles.hostRole}>Host · DJ</p>
          </div>
        </div>
        <div style={styles.statusRight}>
          <div style={styles.listenerPill}>
            👥 {roomState.listeners.length} listening
          </div>
          <div style={styles.onAirTag}>● ON AIR</div>
          <div style={styles.connStatus}>
            {connected ? '🟢 Live' : '🔴 Offline'}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={styles.grid}>

        {/* Left column */}
        <div style={styles.leftCol}>

          {/* Current song */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🎵 Now Playing</h3>
            <div style={styles.nowPlaying}>
              {roomState.currentSong ? (
                <p style={styles.songName}>{roomState.currentSong}</p>
              ) : (
                <p style={styles.empty}>No song set yet</p>
              )}
            </div>
            <div style={styles.inputRow}>
              <input
                style={styles.input}
                type="text"
                placeholder="Song name or link..."
                value={songInput}
                onChange={(e) => setSongInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSongUpdate()}
              />
              <button style={styles.btnPrimary} onClick={handleSongUpdate}>
                Update
              </button>
            </div>
          </div>

          {/* Shoutouts */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📢 Send Shoutout</h3>
            <div style={styles.inputRow}>
              <input
                style={styles.input}
                type="text"
                placeholder="Shoutout message..."
                value={shoutoutInput}
                onChange={(e) => setShoutoutInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleShoutout()}
              />
              <button style={styles.btnPrimary} onClick={handleShoutout}>
                Send
              </button>
            </div>
            <div style={styles.shoutoutList}>
              {roomState.shoutouts.slice(0, 3).map((s, i) => (
                <div key={i} style={styles.shoutoutItem}>
                  <span style={styles.shoutoutName}>{s.name}:</span>
                  <span style={styles.shoutoutMsg}>{s.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reactions */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>⚡ Send Reaction</h3>
            <div style={styles.emojiRow}>
              {emojis.map((e) => (
                <button
                  key={e}
                  style={styles.emojiBtn}
                  onClick={() => sendReaction(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Share link */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🔗 Share Show</h3>
            <p style={styles.shareDesc}>
              Invite students to tune in at:
            </p>
            <p style={styles.shareLink}>
              {window.location.origin}/listen
            </p>
            <button style={styles.btnShare} onClick={copyLink}>
              {showCopied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>

        </div>

        {/* Right column — queue */}
        <div style={styles.rightCol}>
          <ListenerQueue />
        </div>

      </div>

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
  },
  statusBar: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hostInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '800',
    color: '#fff',
  },
  hostName: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  hostRole: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  statusRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  listenerPill: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  onAirTag: {
    background: 'var(--danger)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    padding: '6px 14px',
    borderRadius: '20px',
    letterSpacing: '2px',
  },
  connStatus: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  grid: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  leftCol: {
    flex: '1',
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  rightCol: {
    width: '300px',
    minWidth: '260px',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '18px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '12px',
  },
  nowPlaying: {
    background: 'var(--bg-secondary)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
  },
  songName: {
    fontSize: '14px',
    color: 'var(--accent)',
    fontWeight: '600',
  },
  empty: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '13px',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    padding: '10px 16px',
    borderRadius: '8px',
    flexShrink: 0,
  },
  shoutoutList: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  shoutoutItem: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    background: 'var(--bg-secondary)',
    padding: '8px 12px',
    borderRadius: '8px',
  },
  shoutoutName: {
    color: 'var(--accent)',
    fontWeight: '700',
    marginRight: '6px',
  },
  shoutoutMsg: {
    color: 'var(--text-secondary)',
  },
  emojiRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  emojiBtn: {
    fontSize: '24px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '8px 12px',
    cursor: 'pointer',
    transition: 'transform 0.1s',
  },
  shareDesc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  shareLink: {
    fontSize: '13px',
    color: 'var(--accent)',
    background: 'var(--bg-secondary)',
    padding: '8px 12px',
    borderRadius: '8px',
    marginBottom: '10px',
    wordBreak: 'break-all',
  },
  btnShare: {
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
    fontSize: '13px',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '8px',
    width: '100%',
  },
};