import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedModal = ({ show, attemptedUrl, reason, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleLoginRedirect = () => {
    if (onClose) onClose();
    navigate('/login', { replace: true });
  };

  const handleHomeRedirect = () => {
    if (onClose) onClose();
    navigate('/', { replace: true });
  };

  return (
    <div 
      className="modal show fade d-block animate-fade-in" 
      tabIndex="-1" 
      role="dialog"
      style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.75)', 
        backdropFilter: 'blur(6px)', 
        zIndex: 9999 
      }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '480px' }}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          
          {/* Header Accent Bar */}
          <div style={{ height: '6px', backgroundColor: '#ef4444' }}></div>

          <div className="modal-body p-4 text-center bg-white">
            {/* Warning Lock Icon */}
            <div 
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: '64px', height: '64px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
            >
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Title & Description */}
            <h4 className="fw-bold text-dark mb-2">Unauthorized Access Blocked</h4>
            <p className="text-secondary text-sm mb-3">
              {reason || 'Direct URL typing and back-button navigation to protected pages are blocked.'}
            </p>

            {attemptedUrl && (
              <div className="bg-light rounded p-2 mb-3 border text-start">
                <small className="text-muted d-block text-xs fw-semibold mb-1">Attempted Path:</small>
                <code className="text-danger fw-bold text-xs" style={{ wordBreak: 'break-all' }}>{attemptedUrl}</code>
              </div>
            )}

            <p className="text-muted text-xs mb-4">
              Please log in with appropriate credentials to access this section of the system.
            </p>

            {/* Action Buttons */}
            <div className="d-flex gap-2 justify-content-center">
              <button 
                type="button" 
                className="btn btn-outline-secondary px-4 py-2 fw-semibold"
                onClick={handleHomeRedirect}
                style={{ borderRadius: '8px', fontSize: '14px' }}
              >
                Go to Home
              </button>
              <button 
                type="button" 
                className="btn btn-danger px-4 py-2 fw-bold"
                onClick={handleLoginRedirect}
                style={{ borderRadius: '8px', backgroundColor: '#ef4444', borderColor: '#ef4444', fontSize: '14px' }}
              >
                Log In Now
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedModal;
