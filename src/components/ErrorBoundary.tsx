'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number; // Track error count to prevent infinite loops
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Increment error count
    this.setState(prev => ({ errorCount: prev.errorCount + 1 }));
    
    // Prevent infinite loops - if too many errors, stop logging
    if (this.state.errorCount < 3) {
      console.error('โŒ ErrorBoundary caught an error:');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Component stack:', errorInfo.componentStack);
    } else {
      console.error('โŒ Too many errors caught, stopping error logging to prevent infinite loop');
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use inline styles to avoid any potential issues with Tailwind during error state
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #581c87, #6b21a8, #000000)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '28rem',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#f87171',
              marginBottom: '1rem'
            }}>
              เกิดข้อผิดพลาด
            </h1>
            <p style={{
              color: '#d1d5db',
              marginBottom: '1.5rem'
            }}>
              {this.state.error?.message || 'Something went wrong!'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  width: '100%',
                  backgroundColor: '#9333ea',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9333ea'}
              >
                รีโหลดหน้า
              </button>
              <button
                onClick={() => window.location.href = '/town'}
                style={{
                  width: '100%',
                  backgroundColor: '#374151',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              >
                กลับไปที่ Town
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                <summary style={{
                  cursor: 'pointer',
                  color: '#fbbf24',
                  marginBottom: '0.5rem'
                }}>
                  รายละเอียด Error (Dev Mode)
                </summary>
                <pre style={{
                  fontSize: '0.75rem',
                  color: '#fca5a5',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: '1rem',
                  borderRadius: '0.25rem',
                  overflow: 'auto',
                  maxHeight: '10rem'
                }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
