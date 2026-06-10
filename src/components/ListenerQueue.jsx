// ListenerQueue.jsx — manages the call-in queue
import { useRadio } from '../context/RadioContext';
import { avatarColor } from '../utils/helpers';

export default function ListenerQueue() {
  const { roomState, removeFromQueue } = useRadio();
  const { queue, listeners } = roomState;

  return (
    <div style={styles.container}>

      {/* Listeners online */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          🎧 Listeners Online
          <span style={styles.badge}>{listeners.length}</span>
        </h3>
        {listeners.length === 0 ? (
          <p style={styles.empty}>No listeners yet. Share the link!</p>
        ) : (
          listeners.map((l) => (
            <div key={l.id} style={styles.listenerItem}>
              <div style={styles.avatar}>
                {l.name.charAt(0).toUpperCase()}
              </div>
              <span style={styles.listenerName}>{l.name}</span>
              <span style={styles.onlineTag}>● online</span>
              <div style={{
  ...styles.avatar,
  background: avatarColor(l.name),
}}>
  {l.name.charAt(0).toUpperCase()}
</div>
            </div>
          ))
        )}
      </div>

      {/* Call-in queue */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          📞 Call-In Queue
          <span style={styles.badge}>{queue.length}</span>
        </h3>
        {queue.length === 0 ? (
          <p style={styles.empty}>No one in the queue yet.</p>
        ) : (
          queue.map((q, index) => (
            <div key={q.id} style={styles.queueItem}>
              <span style={styles.queueNumber}>#{index + 1}</span>
              <div style={styles.avatar}>
                {q.name.charAt(0).toUpperCase()}
              </div>
              <span style={styles.listenerName}>{q.name}</span>
              <div style={{
  ...styles.avatar,
  background: avatarColor(q.name),
}}>
  {q.name.charAt(0).toUpperCase()}
</div>
              <button
                style={styles.acceptBtn}
                onClick={() => removeFromQueue(q.id)}
              >
                ✓ Done
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  section: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    background: 'var(--accent)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '10px',
    marginLeft: 'auto',
  },
  empty: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '10px 0',
  },
  listenerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0',
    borderBottom: '1px solid var(--border)',
  },
  queueItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0',
    borderBottom: '1px solid var(--border)',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  listenerName: {
    fontSize: '14px',
    color: 'var(--text-primary)',
    flex: 1,
  },
  onlineTag: {
    fontSize: '11px',
    color: 'var(--success)',
  },
  queueNumber: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '700',
    width: '24px',
  },
  acceptBtn: {
    background: 'var(--success)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
    flexShrink: 0,
  },
};