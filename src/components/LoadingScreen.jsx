// LoadingScreen.jsx — shown while connecting to server
export default function LoadingScreen() {
  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <div style={styles.spinner} />
        <h2 style={styles.title}>CampusCast</h2>
        <p style={styles.sub}>Connecting to the station...</p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.4s ease',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '3px solid var(--border)',
    borderTopColor: 'var(--accent)',
    animation: 'spin 0.8s linear infinite',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sub: {
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
};