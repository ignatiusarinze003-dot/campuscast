// ShoutoutTicker.jsx — scrolling shoutout banner
import { useRadio } from '../context/RadioContext';

export default function ShoutoutTicker() {
  const { roomState } = useRadio();
  const { shoutouts } = roomState;

  if (shoutouts.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.label}>📢 SHOUTOUTS</div>
      <div style={styles.tickerTrack}>
        <div style={styles.tickerContent}>
          {[...shoutouts, ...shoutouts].map((s, i) => (
            <span key={i} style={styles.shoutoutItem}>
              <span style={styles.name}>{s.name}</span>
              <span style={styles.msg}> — {s.message}</span>
              <span style={styles.dot}> · </span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    overflow: 'hidden',
  },
  label: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--accent)',
    letterSpacing: '1px',
    flexShrink: 0,
    background: 'var(--accent-glow)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  tickerTrack: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  tickerContent: {
    display: 'inline-block',
    animation: 'ticker 18s linear infinite',
  },
  shoutoutItem: {
    fontSize: '13px',
    marginRight: '20px',
  },
  name: {
    color: 'var(--accent)',
    fontWeight: '700',
  },
  msg: {
    color: 'var(--text-secondary)',
  },
  dot: {
    color: 'var(--text-muted)',
  },
};