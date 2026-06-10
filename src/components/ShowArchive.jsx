// ShowArchive.jsx — displays past show records
import { useRadio } from '../context/RadioContext';

export default function ShowArchive() {
  const { roomState, showEnded } = useRadio();
  const archive = roomState.archive || [];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📼 Show Archive</h3>

      {showEnded && (
        <div style={styles.justEnded}>
          ✅ Show saved — {showEnded.date} at {showEnded.time}
        </div>
      )}

      {archive.length === 0 ? (
        <p style={styles.empty}>
          No shows archived yet. End a show to save it here.
        </p>
      ) : (
        archive.map((show) => (
          <div key={show.id} style={styles.showCard}>
            <div style={styles.showHeader}>
              <span style={styles.showHost}>🎙️ {show.host}</span>
              <span style={styles.showDate}>{show.date}</span>
            </div>
            <div style={styles.showDetails}>
              <span style={styles.detail}>
                👥 {show.listenerCount} listener{show.listenerCount !== 1 ? 's' : ''}
              </span>
              <span style={styles.detail}>
                🎵 {show.songsPlayed.length} song{show.songsPlayed.length !== 1 ? 's' : ''}
              </span>
              <span style={styles.detail}>
                📢 {show.shoutouts.length} shoutout{show.shoutouts.length !== 1 ? 's' : ''}
              </span>
            </div>
            {show.songsPlayed.length > 0 && (
              <p style={styles.songPlayed}>
                Last song: {show.songsPlayed[0]}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  justEnded: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--accent)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    color: 'var(--text-primary)',
  },
  empty: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
  showCard: {
    background: 'var(--bg-secondary)',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  showHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showHost: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  showDate: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  showDetails: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  detail: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    background: 'var(--bg-card)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  songPlayed: {
    fontSize: '12px',
    color: 'var(--accent)',
    fontStyle: 'italic',
  },
};