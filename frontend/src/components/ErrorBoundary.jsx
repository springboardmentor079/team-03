import React from 'react';

/**
 * Enterprise Global Error Boundary
 * Catches JavaScript errors anywhere in the child component tree,
 * logs error details, and displays a fallback UI instead of crashing.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Unhandled UI Exception caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white p-4"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          <div
            className="card border-0 shadow-lg bg-secondary bg-opacity-25 text-white p-5 text-center"
            style={{ maxWidth: '540px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
          >
            {/* Warning SVG Icon */}
            <div
              className="d-inline-flex align-items-center justify-content-center mb-4 mx-auto"
              style={{
                width: '72px',
                height: '72px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                borderRadius: '50%'
              }}
            >
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="fw-bold text-white mb-2">Something Went Wrong</h3>
            <p className="text-muted mb-4 px-2" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
              An unexpected UI error occurred while rendering this module. Our system has logged the error details.
            </p>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div
                className="text-start bg-dark text-danger p-3 rounded-3 mb-4 overflow-auto font-monospace small"
                style={{ maxHeight: '140px', fontSize: '12px' }}
              >
                {this.state.error.toString()}
              </div>
            )}

            <div className="d-flex justify-content-center gap-3">
              <button
                type="button"
                className="btn btn-outline-light px-4 py-2 fw-semibold"
                onClick={this.handleReload}
                style={{ borderRadius: '8px' }}
              >
                🔄 Refresh Page
              </button>
              <button
                type="button"
                className="btn btn-success px-4 py-2 fw-bold text-white"
                onClick={this.handleGoHome}
                style={{ borderRadius: '8px', backgroundColor: '#00c938', borderColor: '#00c938' }}
              >
                🏠 Return Dashboard
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
