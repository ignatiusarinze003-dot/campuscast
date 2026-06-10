// Home.jsx — CampusCast landing page
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRadio } from '../context/RadioContext';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/global.css';

export default function Home() {
  const navigate = useNavigate();
  const { joinAsHost, joinAsListener, connected } = useRadio();
  const [name, setName] = useState('');
  const [showAnyway, setShowAnyway] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnyway(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!connected && !showAnyway) return <LoadingScreen />;

  const handleHost = () => {
    if (!name.trim()) return alert('Please enter your name first');
    joinAsHost(name.trim());
    navigate('/studio');
  };

  const handleListen = () => {
    if (!name.trim()) return alert('Please enter your name first');
    joinAsListener(name.trim());
    navigate('/listen');
  };

  return (
    <div style={styles.container} className="page-enter">

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.liveTag}>● LIVE</div>
        <h1 style={styles.logo}>CampusCast</h1>
        <p style={styles.tagline}>
          Your campus radio station — live, loud, and yours.
        </p>
        <p style={styles.connectionStatus}>
          {connected ? '🟢 Server connected' : '🔴 Server offline'}
        </p>
      </div>

    
{/* Description */}
<div style={styles.card}>
  <p style={styles.description}>
    CampusCast is where students come alive. Tune in to a live show,
    call in to talk, request music, send shoutouts, and feel the energy
    of your campus — all in real time.
  </p>
  <div style={styles.statRow}>
    <div style={styles.stat}>
      <span style={styles.statNum}>8</span>
      <span style={styles.statLabel}>Live Features</span>
    </div>
    <div style={styles.statDivider} />
    <div style={styles.stat}>
      <span style={styles.statNum}>∞</span>
      <span style={styles.statLabel}>Students Welcome</span>
    </div>
    <div style={styles.statDivider} />
    <div style={styles.stat}>
      <span style={styles.statNum}>1</span>
      <span style={styles.statLabel}>Campus Voice</span>
    </div>
  </div>
</div>

      {/* Name input */}
      <div style={styles.inputWrapper}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter your name to join..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleListen()}
          maxLength={30}
        />
      </div>

      {/* Features */}
      <div style={styles.features}>
        {[
          { icon: '🎙️', title: 'Go Live', desc: 'Host your own show' },
          { icon: '🎵', title: 'Music', desc: 'Request & play songs' },
          { icon: '📞', title: 'Call In', desc: 'Join the conversation' },
          { icon: '💬', title: 'Live Chat', desc: 'React in real time' },
        ].map((f) => (
          <div key={f.title} style={styles.featureCard}>
            <span style={styles.featureIcon}>{f.icon}</span>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={styles.buttons}>
        <button style={styles.btnPrimary} onClick={handleHost}>
          🎙️ Start Hosting
        </button>
        <button style={styles.btnSecondary} onClick={handleListen}>
          🎧 Tune In
        </button>
      </div>

      {/* Footer */}
      <div style={styles.footerRow}>
        <p style={styles.footer}>
          Made for students, by students · CampusCast 2026
        </p>
        <button style={styles.aboutLink} onClick={() => navigate('/about')}>
          About CampusCast →
        </button>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    gap: '32px',
  },
  header: { textAlign: 'center' },
  liveTag: {
    display: 'inline-block',
    background: 'var(--danger)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '4px 12px',
    borderRadius: '20px',
    marginBottom: '16px',
    letterSpacing: '2px',
  },
  logo: {
    fontSize: '52px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
  },
  tagline: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  connectionStatus: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '24px 32px',
    maxWidth: '560px',
    textAlign: 'center',
  },
  description: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
  },
  inputWrapper: {
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '14px 20px',
    background: 'var(--bg-card)',
    border: '2px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-primary)',
    fontSize: '15px',
    textAlign: 'center',
  },
  features: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '680px',
  },
  featureCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    width: '140px',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '28px',
    display: 'block',
    marginBottom: '8px',
  },
  featureTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  featureDesc: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  buttons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    padding: '14px 32px',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
  },
  btnSecondary: {
    background: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '16px',
    fontWeight: '700',
    padding: '14px 32px',
    borderRadius: 'var(--radius)',
    border: '2px solid var(--border)',
  },
  footerRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  footer: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  aboutLink: {
    background: 'none',
    color: 'var(--accent)',
    fontSize: '13px',
    fontWeight: '600',
    textDecoration: 'underline',
    cursor: 'pointer',
  },

  statRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid var(--border)',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statNum: {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  statDivider: {
    width: '1px',
    height: '32px',
    background: 'var(--border)',
  },statRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid var(--border)',
  },
 statRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid var(--border)',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statNum: {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  statDivider: {
    width: '1px',
    height: '32px',
    background: 'var(--border)',
  },
};