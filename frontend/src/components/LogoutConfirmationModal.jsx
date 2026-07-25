import React from 'react';

const LogoutConfirmationModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

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
      <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '400px' }}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          
          {/* Header Accent Bar */}
          <div style={{ height: '6px', backgroundColor: '#f97316' }}></div>

          <div className="modal-body p-4 text-center bg-white">
            {/* Warning/Logout Icon */}
            <div 
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: '64px', height: '64px', backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}
            >
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            {/* Title & Description */}
            <h4 className="fw-bold text-dark mb-2">Ready to Leave?</h4>
            <p className="text-secondary text-sm mb-4">
              Are you sure you want to log out of your session? You will be redirected to the landing page.
            </p>

            {/* Action Buttons */}
            <div className="d-flex flex-column gap-2">
              <button 
                className="btn fw-bold w-100" 
                style={{ 
                  backgroundColor: '#f97316', 
                  color: 'white', 
                  padding: '12px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s'
                }}
                onClick={onConfirm}
              >
                Yes, Log Out
              </button>
              
              <button 
                className="btn fw-bold w-100" 
                style={{ 
                  backgroundColor: '#f1f5f9', 
                  color: '#475569', 
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  transition: 'background-color 0.2s'
                }}
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
