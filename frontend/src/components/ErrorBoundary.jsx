import React from 'react';
import { AlertTriangle, RefreshCw } from './Icons';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-cream)',
            padding: '2rem 1.5rem',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              maxWidth: '460px',
              width: '100%',
              backgroundColor: 'var(--color-cream-card)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem 2rem',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-error-bg)',
                border: '1.5px solid var(--color-error-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}
            >
              <AlertTriangle size={32} color="var(--color-error)" />
            </div>

            <h2
              className="font-display"
              style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: 'var(--color-primary)',
                marginBottom: '0.5rem'
              }}
            >
              Kuch Galat Ho Gaya
            </h2>

            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                lineHeight: '1.6',
                marginBottom: '1.75rem'
              }}
            >
              App render hone me unexpected error aayi. Kripya page reload karke try karein ya home par jayein.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReload}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem' }}
              >
                <RefreshCw size={15} /> Page Reload Karein
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = '/')}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                Home Par Jayein
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
