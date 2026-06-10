// ChatBox.jsx — live chat for listeners
import { useState, useEffect, useRef } from 'react';
import { useRadio } from '../context/RadioContext';

export default function ChatBox() {
  const { messages, sendMessage, userName } = useRadio();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        💬 Live Chat
        <span style={styles.badge}>{messages.length}</span>
      </h3>

      {/* Messages window */}
      <div style={styles.messagesWindow}>
        {messages.length === 0 ? (
          <p style={styles.empty}>
            No messages yet. Say something! 👋
          </p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...(msg.name === userName ? styles.ownMessage : {}),
              }}
            >
              <div style={styles.msgHeader}>
                <div style={styles.msgAvatar}>
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <span style={styles.msgName}>{msg.name}</span>
                <span style={styles.msgTime}>{msg.time}</span>
              </div>
              <p style={styles.msgText}>{msg.message}</p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          maxLength={200}
        />
        <button style={styles.sendBtn} onClick={handleSend}>
          Send
        </button>
      </div>
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
    height: '420px',
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
  messagesWindow: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingRight: '4px',
  },
  empty: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginTop: '40px',
  },
  message: {
    background: 'var(--bg-secondary)',
    borderRadius: '8px',
    padding: '10px 12px',
  },
  ownMessage: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--accent)',
  },
  msgHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  msgAvatar: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  msgName: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--accent)',
  },
  msgTime: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginLeft: 'auto',
  },
  msgText: {
    fontSize: '13px',
    color: 'var(--text-primary)',
    lineHeight: '1.5',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '13px',
  },
  sendBtn: {
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    padding: '10px 16px',
    borderRadius: '8px',
    flexShrink: 0,
  },
};