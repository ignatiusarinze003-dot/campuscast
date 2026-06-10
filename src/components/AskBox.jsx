// AskBox.jsx — anonymous question submission
import { useState } from 'react';
import { useRadio } from '../context/RadioContext';

export default function AskBox({ isHost }) {
  const { roomState, askQuestion, answerQuestion } = useRadio();
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const questions = roomState.questions || [];

  const handleSubmit = () => {
    if (!input.trim()) return;
    askQuestion(input.trim());
    setInput('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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
              <div style={styles.questionHeader}>
                <span style={styles.questionTime}>{q.time}</span>
                {q.answered && (
                  <span style={styles.answeredTag}>✓ Answered</span>
                )}
              </div>
              <p style={styles.questionText}>{q.question}</p>
              {!q.answered && (
                <button
                  style={styles.answerBtn}
                  onClick={() => answerQuestion(q.id)}
                >
                  Mark as Answered
                </button>
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
        Submit a question or topic for the host — no name attached.
      </p>

      {submitted ? (
        <div style={styles.successMsg}>
          ✅ Question submitted! The host will see it.
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
    gap: '6px',
    borderLeft: '3px solid var(--accent)',
  },
  answeredCard: {
    opacity: 0.5,
    borderLeft: '3px solid var(--success)',
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
  answerBtn: {
    background: 'var(--success)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    padding: '6px 12px',
    borderRadius: '6px',
    alignSelf: 'flex-start',
  },
};