// SongVoting.jsx — song voting for host and listeners
import { useState } from 'react';
import { useRadio } from '../context/RadioContext';

export default function SongVoting({ isHost }) {
  const { roomState, startVote, castVote, endVote, userName } = useRadio();
  const [song1, setSong1] = useState('');
  const [song2, setSong2] = useState('');
  const [song3, setSong3] = useState('');

  const vote = roomState.vote;

  // Count votes per song
  const getVoteCount = (index) => {
    if (!vote?.votes) return 0;
    return Object.values(vote.votes).filter((v) => v === index).length;
  };

  const totalVotes = vote?.votes ? Object.keys(vote.votes).length : 0;

  const getPercent = (index) => {
    if (totalVotes === 0) return 0;
    return Math.round((getVoteCount(index) / totalVotes) * 100);
  };

  const userVote = vote?.votes?.[userName];

  const handleStartVote = () => {
    if (!song1.trim() || !song2.trim() || !song3.trim()) {
      alert('Please enter all three song options.');
      return;
    }
    startVote([song1.trim(), song2.trim(), song3.trim()]);
    setSong1('');
    setSong2('');
    setSong3('');
  };

  // ── HOST VIEW ─────────────────────────────────────
  if (isHost) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>🗳️ Song Vote</h3>

        {!vote || !vote.active ? (
          <>
            {vote?.winner && (
              <div style={styles.winnerBanner}>
                🏆 Last winner: <strong>{vote.winner}</strong>
              </div>
            )}
            <p style={styles.desc}>
              Propose three songs. Listeners vote. The winner plays next.
            </p>
            <input
              style={styles.input}
              placeholder="Option 1 — song name"
              value={song1}
              onChange={(e) => setSong1(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Option 2 — song name"
              value={song2}
              onChange={(e) => setSong2(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Option 3 — song name"
              value={song3}
              onChange={(e) => setSong3(e.target.value)}
            />
            <button style={styles.startBtn} onClick={handleStartVote}>
              Start Vote
            </button>
          </>
        ) : (
          <>
            <p style={styles.desc}>
              Vote is live — {totalVotes} vote{totalVotes !== 1 ? 's' : ''} cast
            </p>
            {vote.songs.map((song, i) => (
              <div key={i} style={styles.voteRow}>
                <div style={styles.voteInfo}>
                  <span style={styles.songLabel}>{song}</span>
                  <span style={styles.voteCount}>
                    {getVoteCount(i)} vote{getVoteCount(i) !== 1 ? 's' : ''}
                    {' '}({getPercent(i)}%)
                  </span>
                </div>
                <div style={styles.barBg}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${getPercent(i)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            <button style={styles.endBtn} onClick={endVote}>
              End Vote &amp; Play Winner
            </button>
          </>
        )}
      </div>
    );
  }

  // ── LISTENER VIEW ──────────────────────────────────
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🗳️ Song Vote</h3>

      {!vote || !vote.active ? (
        <p style={styles.desc}>
          {vote?.winner
            ? `🏆 Last vote winner: ${vote.winner}`
            : 'Waiting for the host to start a vote...'}
        </p>
      ) : (
        <>
          <p style={styles.desc}>
            Pick the next song! {totalVotes} vote{totalVotes !== 1 ? 's' : ''} so far.
          </p>
          {vote.songs.map((song, i) => (
            <div key={i} style={styles.voteRow}>
              <div style={styles.voteInfo}>
                <span style={styles.songLabel}>{song}</span>
                <span style={styles.voteCount}>
                  {getVoteCount(i)} ({getPercent(i)}%)
                </span>
              </div>
              <div style={styles.barBg}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${getPercent(i)}%`,
                    background: userVote === i
                      ? 'var(--success)'
                      : 'linear-gradient(90deg, var(--accent), var(--accent-secondary))',
                  }}
                />
              </div>
              <button
                style={{
                  ...styles.voteBtn,
                  ...(userVote === i ? styles.votedBtn : {}),
                }}
                onClick={() => castVote(i)}
                disabled={userVote !== undefined}
              >
                {userVote === i ? '✓ Voted' : 'Vote'}
              </button>
            </div>
          ))}
          {userVote !== undefined && (
            <p style={styles.votedMsg}>
              Your vote is in! Waiting for the host to end the vote.
            </p>
          )}
        </>
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
    gap: '10px',
  },
  title: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  desc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  winnerBanner: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--accent)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    color: 'var(--text-primary)',
  },
  input: {
    padding: '10px 14px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    width: '100%',
  },
  startBtn: {
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    padding: '10px 16px',
    borderRadius: '8px',
    marginTop: '4px',
  },
  endBtn: {
    background: 'var(--success)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    padding: '10px 16px',
    borderRadius: '8px',
    marginTop: '4px',
  },
  voteRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  voteInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  songLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  voteCount: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  barBg: {
    height: '6px',
    background: 'var(--border)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  },
  voteBtn: {
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '6px',
    alignSelf: 'flex-start',
    cursor: 'pointer',
  },
  votedBtn: {
    background: 'var(--success)',
    color: '#fff',
    border: '1px solid var(--success)',
  },
  votedMsg: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
};