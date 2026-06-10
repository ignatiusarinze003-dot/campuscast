// Toast.jsx — lightweight notification system
import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'var(--success)',
    error: 'var(--danger)',
    info: 'var(--accent)',
  };

  return (
    <div style={{ ...styles.toast, borderLeftColor: colors[type] }}>
      <span style={styles.message}>{message}</span>
      <button style={styles.close} onClick={onClose}>✕</button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderLeft: '4px solid var(--accent)',
    borderRadius: 'var(--radius)',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: 'var(--shadow)',
    animation: 'slideIn 0.3s ease',
    zIndex: 9999,
    maxWidth: '320px',
  },
  message: {
    fontSize: '13px',
    color: 'var(--text-primary)',
    flex: 1,
    lineHeight: '1.4',
  },
  close: {
    background: 'none',
    color: 'var(--text-muted)',
    fontSize: '12px',
    flexShrink: 0,
    padding: '2px 4px',
  },
};