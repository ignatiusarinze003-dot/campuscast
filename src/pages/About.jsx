// About.jsx — platform info page
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

export default function About() {
  const navigate = useNavigate();

  const features = [
    { icon: '🎙️', title: 'Live Hosting', desc: 'Any student can become a host and run their own live show for the campus.' },
    { icon: '🎵', title: 'Music Control', desc: 'The host controls the music — update the now playing song in real time.' },
    { icon: '📞', title: 'Call-In Queue', desc: 'Listeners can request to call in and join the host on air.' },
    { icon: '💬', title: 'Live Chat', desc: 'A real-time chat window keeps the audience engaged throughout the show.' },
    { icon: '🗳️', title: 'Song Voting', desc: 'Host proposes three songs — listeners vote and the winner plays next.' },
    { icon: '📢', title: 'Shoutouts', desc: 'Send live dedications and shoutouts that scroll across the screen.' },
    { icon: '❓', title: 'Ask Box', desc: 'Listeners submit anonymous questions for the host to address on air.' },
    { icon: '📼', title: 'Show Archive', desc: 'Every completed show is saved with its stats for future reference.' },
  ];

  return (
    <div style={styles.container} className="page-enter">

      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>

      <div style={styles.header}>
        <h1 style={styles.logo}>CampusCast</h1>
        <p style={styles.tagline}>
          The live radio station built for students, by students.
        </p>
      </div>

      <div style={styles.missionCard}>
        <h2 style={styles.missionTitle}>🎯 Our Mission</h2>
        <p style={styles.missionText}>
          CampusCast was built to solve a real problem in student life —
          loneliness, stress, and the lack of a genuine communal space that
          feels spontaneous and human. We believe every campus deserves a
          live voice. CampusCast gives students that voice.
        </p>
      </div>

      <div style={styles.featuresGrid}>
        {features.map((f) => (
          <div key={f.title} style={styles.featureCard}>
            <span style={styles.featureIcon}>{f.icon}</span>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      <div style={styles.techCard}>
        <h2 style={styles.techTitle}>⚙️ Built With</h2>
        <div style={styles.techList}>
          {['React', 'Node.js', 'Express', 'Socket.io', 'Vite'].map((t) => (
            <span key={t} style={styles.techTag}>{t}</span>
          ))}
        </div>
      </div>

      <button style={styles.ctaBtn} onClick={() => navigate('/')}>
        🎙️ Start Listening
      </button>

     <div style={styles.footerSection}>
  <p style={styles.footer}>
    CampusCast 2026 · Made for students everywhere
  </p>
  <div style={styles.techBadges}>
    <span style={styles.badge}>⚡ Real-time</span>
    <span style={styles.badge}>🔒 No login required</span>
    <span style={styles.badge}>🎓 Student built</span>
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
    alignItems: 'center',
    padding: '20px',
    gap: '28px',
  },
  topBar: {
    width: '100%',
    maxWidth: '720px',
  },
  backBtn: {
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid var(--border)',
  },
  header: {
    textAlign: 'center',
  },
  logo: {
    fontSize: '42px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px',
  },
  tagline: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
  },
  missionCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '24px',
    maxWidth: '720px',
    width: '100%',
  },
  missionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '12px',
  },
  missionText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
  },
  featuresGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px',
    maxWidth: '720px',
    width: '100%',
    justifyContent: 'center',
  },
  featureCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '18px',
    width: '160px',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '26px',
    display: 'block',
    marginBottom: '8px',
  },
  featureTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  featureDesc: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
  techCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    maxWidth: '720px',
    width: '100%',
  },
  techTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '12px',
  },
  techList: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  techTag: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  ctaBtn: {
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '700',
    padding: '14px 32px',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
  },
  footer: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    paddingBottom: '20px',
  },

  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '20px',
  },
  techBadges: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
};