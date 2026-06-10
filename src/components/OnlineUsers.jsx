// OnlineUsers.jsx — compact live user count
import { useRadio } from '../context/RadioContext';
import { avatarColor } from '../utils/helpers';

export default function OnlineUsers() {
  const { roomState } = useRadio();
  const { listeners, host } = roomState;
  const total = listeners.length + (host ? 1 : 0);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        👥 Online Now
        <span style={styles.count}>{total}</span>
      </h3>

      <div style={styles.avatarRow}>
        {/* Host avatar */}
        {host && (
          <div
            style={{
              ...styles.avatar,
              background: avatarColor(host.name),
              border: '2px solid var(--danger)',
            }}
            title={`${host.name} (Host)`}
          >
            {host.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Listener avatars — show max 8 */}
        {listeners.slice(0, 8).map((l) => (
          <div
            key={l.id}
            style={{
              ...styles.avatar,
              background: avatarColor(l.name),
            }}
            title={l.name}
          >
            {l.name.charAt(0).toUpperCase()}
          </div>
        ))}

        {/* Overflow count */}
        {listeners.length > 8 && (
          <div style={styles.overflow}>
            +{listeners.length - 8}
          </div>
        )}
      </div>

      {total === 0 && (
        <p style={styles.empty}>No one online yet.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  count: {
    background: 'var(--accent)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '10px',
    marginLeft: 'auto',
  },
  avatarRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    cursor: 'default',
    flexShrink: 0,
  },
  overflow: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)',
  },
  empty: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
};