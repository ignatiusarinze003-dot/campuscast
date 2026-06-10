// NotFound.jsx — 404 page
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.container} className="page-enter">
      <div style={styles.code}>404</div>
      <h2 style={styles.title}>Page not found</h2>
      <p style={styles.message}>
        This page doesn't exist on CampusCast.
        Maybe the show already ended?
      </p>
      <button style={styles.btn} onClick={() => navigate('/')}>
        ← Back to Home
      </button>
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
    gap: '16px',
    padding: '40px 20px',
    textAlign: 'center',
  },
  code: {
    fontSize: '80px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  message: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    maxWidth: '360px',
    lineHeight: '1.6',
  },
  btn: {
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    padding: '12px 28px',
    borderRadius: 'var(--radius)',
  },
};