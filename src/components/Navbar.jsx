// Navbar.jsx — consistent top navigation
import { useNavigate, useLocation } from 'react-router-dom';
import { useRadio } from '../context/RadioContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { connected, userName, isHost } = useRadio();

  const isHome = location.pathname === '/';

  return (
    <nav style={styles.nav}>

      {/* Logo */}
      <button style={styles.logo} onClick={() => navigate('/')}>
        🎙️ CampusCast
      </button>

      {/* Center — current page indicator */}
      <div style={styles.center}>
        {location.pathname === '/studio' && (
          <span style={styles.onAirTag}>● ON AIR</span>
        )}
        {location.pathname === '/listen' && (
          <span style={styles.liveTag}>● LIVE</span>
        )}
        {location.pathname === '/about' && (
          <span style={styles.pageLabel}>About</span>
        )}
      </div>

      {/* Right — status */}
      <div style={styles.right}>
        {userName && (
          <div style={styles.userChip}>
            <div style={styles.userAvatar}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span style={styles.userName}>{userName}</span>
          </div>
        )}
        <div style={styles.connDot}
          title={connected ? 'Connected' : 'Disconnected'}>
          {connected ? '🟢' : '🔴'}
        </div>
      </div>

    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  logo: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    background: 'none',
    letterSpacing: '-0.02em',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
  },
  onAirTag: {
    background: 'var(--danger)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '800',
    padding: '4px 12px',
    borderRadius: '20px',
    letterSpacing: '2px',
  },
  liveTag: {
    background: 'var(--success)',
    color: '#000',
    fontSize: '11px',
    fontWeight: '800',
    padding: '4px 12px',
    borderRadius: '20px',
    letterSpacing: '2px',
  },
  pageLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '4px 12px 4px 4px',
  },
  userAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: '#fff',
  },
  userName: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  connDot: {
    fontSize: '14px',
    cursor: 'default',
  },
};