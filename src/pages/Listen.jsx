// Listen.jsx — full listener lounge
import { useNavigate } from 'react-router-dom';
import { useRadio } from '../context/RadioContext';
import ChatBox from '../components/ChatBox';
import ShoutoutTicker from '../components/ShoutoutTicker';
import ReactionBar from '../components/ReactionBar';
import MusicPlayer from '../components/MusicPlayer';
import ConnectionBanner from '../components/ConnectionBanner';
import SongVoting from '../components/SongVoting';
import '../styles/global.css';
import AskBox from '../components/AskBox';
import OnlineUsers from '../components/OnlineUsers';
import VoiceListener from '../components/VoiceListener';

export default function Listen() {
  const navigate = useNavigate();
  const {
    userName,
    roomState,
    connected,
    requestCallIn,
    hostLeftMessage,
  } = useRadio();

  if (!userName) {
    return (
      <div style={styles.redirect}>
        <p style={styles.redirectText}>
          You need to enter your name first.
        </p>
        <button
          style={styles.redirectBtn}
          onClick={() => navigate('/')}
        >
          ← Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container} className="page-enter">

      {/* Connection banner */}
      <ConnectionBanner />

      {/* Host left message */}
      {hostLeftMessage && (
        <div style={styles.hostLeftBanner}>
          📻 {hostLeftMessage}
        </div>
      )}

      {/* Page header */}
<div style={styles.pageHeader}>
  <div>
    <h2 style={styles.pageTitle}>🎧 Listener Lounge</h2>
    <p style={styles.pageSubtitle}>
      {roomState.host
        ? `🎙️ ${roomState.host.name} is live right now`
        : 'Waiting for the host to go live...'}
    </p>
  </div>
</div>

      {/* Shoutout ticker */}
      <div style={styles.tickerWrapper}>
        <ShoutoutTicker />
      </div>

      {/* Main content */}
      <div style={styles.main}>

        {/* Left — info panels */}
        <div style={styles.leftCol}>

          {/* Music player */}
          <MusicPlayer isHost={false} />

          {/* Voice listener */}
          <VoiceListener />

          {/* Host info */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🎙️ Your Host</h3>
            {roomState.host ? (
              <div style={styles.hostRow}>
                <div style={styles.hostAvatar}>
                  {roomState.host.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={styles.hostName}>
                    {roomState.host.name}
                  </p>
                  <p style={styles.hostRole}>
                    Host · On Air
                  </p>
                </div>
              </div>
            ) : (
              <p style={styles.empty}>
                Host hasn't started yet...
              </p>
            )}
          </div>

          {/* Online users */}
          <OnlineUsers />

          {/* Call in button */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📞 Want to Call In?</h3>
            <p style={styles.callDesc}>
              Join the queue and the host will bring you on air.
            </p>
            {roomState.queue.find((q) => q.name === userName) ? (
              <div style={styles.inQueueMsg}>
                ✓ You're in the queue!{' '}
                <span style={styles.queuePos}>
                  Position #{roomState.queue.findIndex(
                    (q) => q.name === userName
                  ) + 1}
                </span>
              </div>
            ) : (
              <button
                style={styles.callBtn}
                onClick={requestCallIn}
              >
                📞 Request to Call In
              </button>
            )}
          </div>

          {/* Song voting */}
          <SongVoting isHost={false} />

          {/* Ask box */}
          <AskBox isHost={false} />

          {/* Reactions */}
          <ReactionBar />

        </div>

        {/* Right — live chat */}
        <div style={styles.rightCol}>
          <ChatBox />
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
  },
  hostLeftBanner: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderLeft: '4px solid var(--warning)',
    padding: '10px 24px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
  },
  backBtn: {
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid var(--border)',
  },
  pageTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  connStatus: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  tickerWrapper: {
    padding: '12px 24px 0',
  },
  main: {
    display: 'flex',
    gap: '20px',
    padding: '20px 24px',
    flex: 1,
    flexWrap: 'wrap',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: '1',
    minWidth: '260px',
  },
  rightCol: {
    width: '340px',
    minWidth: '280px',
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
  empty: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  hostRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  hostAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '800',
    color: '#fff',
  },
  hostName: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  hostRole: {
    fontSize: '12px',
    color: 'var(--success)',
  },
  listenerCount: {
    fontSize: '36px',
    fontWeight: '800',
    color: 'var(--accent)',
  },
  listenerLabel: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    fontWeight: '400',
  },
  callDesc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  callBtn: {
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    padding: '12px 20px',
    borderRadius: 'var(--radius)',
    width: '100%',
  },
  inQueueMsg: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--accent)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    color: 'var(--text-primary)',
  },
  queuePos: {
    color: 'var(--accent)',
    fontWeight: '700',
  },
  redirect: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  redirectText: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
  },
  redirectBtn: {
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    padding: '12px 24px',
    borderRadius: 'var(--radius)',
  },

pageHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
  },
  pageTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },

  pageSubtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  };