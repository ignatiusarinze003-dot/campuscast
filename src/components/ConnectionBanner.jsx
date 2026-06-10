// ConnectionBanner.jsx — shows connection status at top of page
import { useRadio } from '../context/RadioContext';

export default function ConnectionBanner() {
  const { connected } = useRadio();

  if (connected) return null;

  return (
    <div style={styles.banner}>
      <span style={styles.icon}>⚠️</span>
      <span style={styles.text}>
        Connection lost — attempting to reconnect...
      </span>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  banner: {
    background: 'var(--warning)',
    color: '#000',
    padding: '10px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    fontWeight: '600',
    animation: 'blink 1.5s ease infinite',
  },
  icon: {
    fontSize: '16px',
  },
  text: {
    flex: 1,
  },
};