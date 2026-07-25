import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import UnauthorizedModal from './UnauthorizedModal';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [modalReason, setModalReason] = useState('');

  // 1. Trap Browser Back / Forward Button Navigation robustly
  useEffect(() => {
    // Skip trapping logic if the user is unauthenticated or unauthorized
    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
      return;
    }

    // Capture the exact browser URL for the current React Router state, accounting for basenames.
    const currentHref = window.location.href;
    
    // We clone the current history state to preserve React Router's internal index (idx) and key.
    const currentState = window.history.state;
    
    // Push a dummy state to trap the back button
    window.history.pushState(currentState, '', currentHref);

    const handlePopState = (e) => {
      // INTERCEPT BEFORE REACT ROUTER:
      // React Router listens to popstate in the bubble phase. 
      // By using stopImmediatePropagation in the capture phase, we hide the event from React Router completely!
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // The browser URL just changed backward, but React Router doesn't know.
      // We must push React Router's expected URL to force the browser URL back to the trapped state!
      window.history.pushState(currentState, '', currentHref);

      setModalReason('Browser back and forward navigation is disabled for security reasons.');
      setShowUnauthorizedModal(true);
    };

    // Use { capture: true } to guarantee this listener runs FIRST, before any other listeners.
    window.addEventListener('popstate', handlePopState, { capture: true });

    return () => {
      window.removeEventListener('popstate', handlePopState, { capture: true });
    };
  }, [location.pathname, location.search, location.hash, user, allowedRoles]);

  // 2. Unauthenticated check
  if (!user) {
    return (
      <UnauthorizedModal 
        show={true} 
        attemptedUrl={location.pathname}
        reason="You are not logged in. Direct URL navigation and back access are blocked."
        onClose={() => navigate('/login', { replace: true })}
      />
    );
  }

  // 3. Unauthorized role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <UnauthorizedModal 
        show={true} 
        attemptedUrl={location.pathname}
        reason={`Your user role (${user.role}) does not have permission to access this area.`}
        onClose={() => navigate('/login', { replace: true })}
      />
    );
  }

  // 4. Authorized access
  return (
    <>
      <Outlet />
      {showUnauthorizedModal && (
        <UnauthorizedModal 
          show={showUnauthorizedModal} 
          attemptedUrl={location.pathname}
          reason={modalReason}
          onClose={() => setShowUnauthorizedModal(false)}
        />
      )}
    </>
  );
};

export default ProtectedRoute;
