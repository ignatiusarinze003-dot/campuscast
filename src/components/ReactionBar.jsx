// ReactionBar.jsx — floating emoji reactions
import { useState } from 'react';
import { useRadio } from '../context/RadioContext';

export default function ReactionBar() {
  const { sendReaction, reactions } = useRadio();
  const emojis = ['🔥', '❤️', '😂', '🎵', '👏', '💜'];

  return (
    <div style={styles.container}>

      {/* Floating reactions display */}
      <div style={styles.floatArea}>
        {reactions.map((r) => (
          <span
            key={r.key}
            style={{
              ...styles.floatingEmoji,
              left: `${Math.random() * 80 + 10}%`,
            }}
          >
            {r.emoji}
          </span>
        ))}
        <style>{`
          @keyframes floatUp {
            0%   { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-80px) scale(1.4); }
          }
        `}</style>
      </div>

      {/* Emoji buttons */}
      <div style={styles.btnRow}>
        {emojis.map((e) => (
          <button
            key={e}
            style={styles.emojiBtn}
            onClick={() => sendReaction(e)}
          >
            {e}
          </button>
        ))}
      </div>

    </div>
  );
}

const styles = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '14px 18px',
    position: 'relative',
    overflow: 'hidden',
  },
  floatArea: {
    position: 'relative',
    height: '60px',
    marginBottom: '8px',
  },
  floatingEmoji: {
    position: 'absolute',
    bottom: 0,
    fontSize: '24px',
    animation: 'floatUp 2s ease-out forwards',
    pointerEvents: 'none',
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  emojiBtn: {
    fontSize: '22px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '8px 12px',
    cursor: 'pointer',
    transition: 'transform 0.1s',
  },
};