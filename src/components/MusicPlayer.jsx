// MusicPlayer.jsx — audio player with controls
import { useState, useRef, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';

export default function MusicPlayer({ isHost }) {
  const { roomState } = useRadio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // No audio source loaded yet
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 1;
    setCurrentTime(current);
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={styles.container}>

      {/* Song info */}
      <div style={styles.songInfo}>
        <div style={styles.disc}>
          <span style={{
            ...styles.discInner,
            animation: isPlaying ? 'spin 4s linear infinite' : 'none',
          }}>
            🎵
          </span>
        </div>
        <div style={styles.songText}>
          <p style={styles.songTitle}>
            {roomState.currentSong || 'No song selected'}
          </p>
          <p style={styles.songSub}>
            {isHost ? 'You are the DJ' : 'CampusCast Live'}
          </p>
        </div>
      </div>

      {/* Audio element — only rendered when needed, no empty src */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />

      {/* Progress bar */}
      <div style={styles.progressWrapper} onClick={handleSeek}>
        <div style={styles.progressBg}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          />
        </div>
        <div style={styles.timeRow}>
          <span style={styles.timeText}>{formatTime(currentTime)}</span>
          <span style={styles.timeText}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>

        <div style={styles.volumeRow}>
          <span style={styles.volIcon}>
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={styles.volumeSlider}
          />
        </div>

        <button style={styles.playBtn} onClick={togglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div style={styles.liveTag}>● LIVE</div>

      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}

const styles = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  songInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  disc: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: 'var(--shadow)',
  },
  discInner: {
    fontSize: '22px',
    display: 'inline-block',
  },
  songText: {
    flex: 1,
    overflow: 'hidden',
  },
  songTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  songSub: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  progressWrapper: {
    cursor: 'pointer',
  },
  progressBg: {
    height: '4px',
    background: 'var(--border)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))',
    borderRadius: '2px',
    transition: 'width 0.5s linear',
  },
  timeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '4px',
  },
  timeText: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  volumeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flex: 1,
  },
  volIcon: {
    fontSize: '16px',
    flexShrink: 0,
  },
  volumeSlider: {
    flex: 1,
    accentColor: 'var(--accent)',
    cursor: 'pointer',
  },
  playBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow)',
    flexShrink: 0,
  },
  liveTag: {
    background: 'var(--danger)',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: '20px',
    letterSpacing: '1px',
    flexShrink: 0,
  },
};