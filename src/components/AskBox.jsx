// AskBox.jsx — anonymous question submission with host replies
import { useState } from 'react';
import { useRadio } from '../context/RadioContext';

export default function AskBox({ isHost }) {
  const { roomState, askQuestion, answerQuestion } = useRadio();
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [replyInputs, setReplyInputs] = useState({});

  const questions = roomState.questions || [];

  const handleSubmit = () => {
    if (!input.trim()) return;
    askQuestion(input.trim());
    setInput('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleReply = (id) => {
    const reply = replyInputs[id];
    if (!reply || !reply.trim()) return;
    answerQuestion(id, reply.trim());
    setReplyInputs((prev) => ({ ...prev, [id]: '' }));
  };

  const updateReplyInput = (id, value) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  // ── HOST VIEW ─────────────────────────────────────
  if (isHost) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>
          ❓ Anonymous Questions
          <span style={styles.badge}>
            {questions.filter(q => !q.answered).length}
          </span>
        </h3>

        {questions.length === 0 ? (
          <p style={styles.empty}>
            No questions yet. Listeners can submit anonymously.
          </p>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              style={{
                ...styles.questionCard,
                ...(q.answered ? styles.answeredCard : {}),
              }}
            >
              {/* Question */}
              <div style={styles.questionHeader}>
                <span style={styles.questionTime}>{q.time}</span>
                {q.answered && (
                  <span style={styles.answeredTag}>✓ Answered</span>
                )}
              </div>
              <p style={styles.questionText}>❓ {q.question}</p>

              {/* Host reply if exists */}
              {q.reply && (
                <div style={styles.replyBox}>
                  <span style={styles.replyLabel}>🎙️ Your reply:</span>
                  <p style={styles.replyText}>{q.reply}</p>
                  <span style={styles.replyTime}>{q.repliedAt}</span>
                </div>
              )}

              {/* Reply input — only if not answered */}
              {!q.answered && (
                <div style={styles.replyRow}>
                  <input
                    style={styles.replyInput}
                    type="text"
                    placeholder="Type your reply..."
                    value={replyInputs[q.id] || ''}
                    onChange={(e) => updateReplyInput(q.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleReply(q.id)}
                  />
                  <button
                    style={styles.replyBtn}
                    onClick={() => handleReply(q.id)}
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  }

  // ── LISTENER VIEW ──────────────────────────────────
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>❓ Ask Anonymously</h3>
      <p style={styles.desc}>
        Submit a question — the host will reply live.
      </p>

      {submitted ? (
        <div style={styles.successMsg}>
          ✅ Question submitted! Watch for the host's reply below.
        </div>
      ) : (
        <>
          <textarea
            style={styles.textarea}
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={200}
            rows={3}
          />
          <button style={styles.submitBtn} onClick={handleSubmit}>
            Submit Anonymously
          </button>
        </>
      )}

      {/* Show answered questions with replies */}
      {questions.filter(q => q.answered && q.reply).length > 0 && (
        <div style={styles.answeredSection}>
          <p style={styles.answeredTitle}>🎙️ Host Replies</p>
          {questions
            .filter(q => q.answered && q.reply)
            .map((q) => (
              <div key={q.id} style={styles.answeredItem}>
                <p style={styles.answeredQuestion}>❓ {q.question}</p>
                <div style={styles.replyBox}>
                  <span style={styles.replyLabel}>🎙️ Host replied:</span>
                  <p style={styles.replyText}>{q.reply}</p>
                </div>
              </div>
            ))}
        </div>
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
  desc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  empty: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    resize: 'vertical',
    lineHeight: '1.5',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    padding: '10px 16px',
    borderRadius: '8px',
  },
  successMsg: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--accent)',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    textAlign: 'center',
  },
  questionCard: {
    background: 'var(--bg-secondary)',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderLeft: '3px solid var(--accent)',
  },
  answeredCard: {
    borderLeft: '3px solid var(--success)',
    opacity: 0.85,
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionTime: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  answeredTag: {
    fontSize: '11px',
    color: 'var(--success)',
    fontWeight: '700',
  },
  questionText: {
    fontSize: '13px',
    color: 'var(--text-primary)',
    lineHeight: '1.5',
  },
  replyRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '4px',
  },
  replyInput: {
    flex: 1,
    padding: '8px 12px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '12px',
  },
  replyBtn: {
    background: 'var(--success)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    padding: '8px 14px',
    borderRadius: '8px',
    flexShrink: 0,
  },
  replyBox: {
    background: 'var(--bg-card)',
    borderRadius: '6px',
    padding: '8px 12px',
    borderLeft: '3px solid var(--success)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  replyLabel: {
    fontSize: '11px',
    color: 'var(--success)',
    fontWeight: '700',
  },
  replyText: {
    fontSize: '13px',
    color: 'var(--text-primary)',
    lineHeight: '1.5',
  },
  replyTime: {
    fontSize: '10px',
    color: 'var(--text-muted)',
  },
  answeredSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '8px',
  },
  answeredTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
  },
  answeredItem: {
    background: 'var(--bg-secondary)',
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  answeredQuestion: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
};