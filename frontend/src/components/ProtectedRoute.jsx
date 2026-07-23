import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // 1. If no user is logged in, send them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If a user is logged in but doesn't have the right role, send them to an unauthorized page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. If they pass the checks, let them see the nested routes!
  return <Outlet />;
};

export default ProtectedRoute;
