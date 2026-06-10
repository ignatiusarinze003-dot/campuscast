// ErrorBoundary.jsx — catches unexpected React errors
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('CampusCast Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h2 style={styles.title}>⚠️ Something went wrong</h2>
          <p style={styles.message}>
            CampusCast hit an unexpected error. Please refresh the page.
          </p>
          <button
            style={styles.btn}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
          <p style={styles.detail}>
            {this.state.error?.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '40px 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--danger)',
  },
  message: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    maxWidth: '400px',
    lineHeight: '1.6',
  },
  btn: {
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    padding: '12px 28px',
    borderRadius: 'var(--radius)',
  },
  detail: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontFamily: 'monospace',
  },
};