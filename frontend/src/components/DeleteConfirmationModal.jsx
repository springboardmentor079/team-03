import React from 'react';

/**
 * A premium custom confirmation modal for deleting projects or milestones.
 * @param {Object} props
 * @param {boolean} props.show Whether the modal is open.
 * @param {string} [props.title] Modal header title (e.g. "Delete Milestone?").
 * @param {string} [props.projectName] The name of the project or item being deleted.
 * @param {string} [props.itemName] Alternative property name for item title.
 * @param {Function} props.onClose Callback when user cancels or closes modal.
 * @param {Function} props.onConfirm Callback when user confirms deletion.
 */
const DeleteConfirmationModal = ({ show, title, projectName, itemName, onClose, onConfirm }) => {
  if (!show) return null;

  const displayName = itemName || projectName || '';
  const modalTitle = title || (itemName ? 'Delete Milestone?' : 'Delete Project?');

  return (
    <div 
      className="modal show d-block fade animate-fade-in" 
      tabIndex="-1" 
      role="dialog"
      style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.7)', 
        backdropFilter: 'blur(5px)', 
        zIndex: 1060 
      }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '450px' }}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          
          {/* Top Danger Accent Bar */}
          <div style={{ height: '6px', backgroundColor: '#ef4444' }}></div>

          <div className="modal-body p-4 text-center">
            
            {/* Warning Icon */}
            <div 
              className="d-inline-flex align-items-center justify-content-center mb-3"
              style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                color: '#ef4444',
                borderRadius: '50%'
              }}
            >
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Content */}
            <h4 className="fw-bold text-dark mb-2">{modalTitle}</h4>
            <p className="text-secondary mb-4 px-2" style={{ fontSize: '14.5px', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong className="text-dark">"{displayName}"</strong>? This action is permanent and cannot be undone.
            </p>

            {/* Buttons */}
            <div className="d-flex justify-content-center gap-3">
              <button 
                type="button" 
                className="btn btn-light border px-4 py-2 fw-semibold text-secondary"
                style={{ borderRadius: '8px', minWidth: '110px' }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger px-4 py-2 fw-bold text-white"
                style={{ 
                  borderRadius: '8px', 
                  minWidth: '110px', 
                  backgroundColor: '#ef4444', 
                  borderColor: '#ef4444' 
                }}
                onClick={onConfirm}
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
