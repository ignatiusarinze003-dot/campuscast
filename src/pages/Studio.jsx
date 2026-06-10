// Studio.jsx — Host view
import { useNavigate } from 'react-router-dom';
import { useRadio } from '../context/RadioContext';
import HostDashboard from '../components/HostDashboard';
import MusicPlayer from '../components/MusicPlayer';
import SongVoting from '../components/SongVoting';
import ShowArchive from '../components/ShowArchive';
import ConnectionBanner from '../components/ConnectionBanner';
import '../styles/global.css';
import AskBox from '../components/AskBox';
import OnlineUsers from '../components/OnlineUsers';


export default function Studio() {
  const navigate = useNavigate();
  const { userName, endShow } = useRadio();

  if (!userName) {
    return (
      <div style={styles.redirect}>
        <p style={styles.redirectText}>
          You need to enter your name first.
        </p>
        <button style={styles.redirectBtn} onClick={() => navigate('/')}>
          ← Go Back Home
        </button>
      </div>
    );
  }

  const handleEndShow = () => {
    const confirm = window.confirm(
      'Are you sure you want to end the show? This will save the session to the archive.'
    );
    if (confirm) {
      endShow();
      navigate('/');
    }
  };

  return (
    <div style={styles.container} className="page-enter">

      {/* Connection banner */}
      <ConnectionBanner />

      {/* Music player */}
      <div style={styles.section}>
        <MusicPlayer isHost={true} />
      </div>

      {/* Action bar */}
<div style={styles.actionBar}>
  <div>
    <h2 style={styles.pageTitle}>Your Studio</h2>
    <p style={styles.pageSubtitle}>
      You're live — make it a great show, {userName}. 🎙️
    </p>
  </div>
  <button style={styles.endShowBtn} onClick={handleEndShow}>
    ⏹ End Show
  </button>
</div>

      {/* Song voting */}
      <div style={styles.section}>
        <SongVoting isHost={true} />
      </div>

      {/* Online users overview */}
<div style={styles.section}>
  <OnlineUsers />
</div>

{/* Host dashboard */}
<HostDashboard />

      {/* Ask box */}
      <div style={styles.section}>
      <AskBox isHost={true} />
      </div>

      {/* Show archive */}
      <div style={styles.section}>
        <ShowArchive />
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
  actionBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
  },
  pageTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  endShowBtn: {
    background: 'var(--danger)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    padding: '8px 16px',
    borderRadius: '8px',
  },
  
  section: {
    padding: '20px 20px 0',
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
  pageSubtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
};