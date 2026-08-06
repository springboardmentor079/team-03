import { useState, useEffect } from 'react';
import { AuthContext } from './auth';

const getInitialUser = () => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  const savedUserStr = localStorage.getItem('user');

  if (!token && !savedUserStr) {
    return null;
  }

  try {
    const parsedUser = savedUserStr ? JSON.parse(savedUserStr) : {};
    return {
      ...parsedUser,
      role: role || parsedUser.role || 'Site Engineer',
      token: token || parsedUser.token || 'demo-jwt-token'
    };
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
    if (token && role) {
      return { role, token, name: 'User', email: 'user@buildtrack.com' };
    }
    return null;
  }
};

// AuthProvider component with Persistent Authentication & Cross-Tab Sync
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);

  // Cross-Tab Synchronization via Window Storage Event Listener
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Re-evaluate auth status whenever auth keys change in any tab
      if (['userToken', 'userRole', 'user', 'token'].includes(event.key)) {
        const updatedToken = localStorage.getItem('userToken') || localStorage.getItem('token');
        const updatedRole = localStorage.getItem('userRole');
        const updatedUserStr = localStorage.getItem('user');

        if (!updatedToken && !updatedUserStr) {
          // Logged out in another tab
          setUser(null);
        } else {
          // Logged in or user details changed in another tab
          try {
            const parsedUser = updatedUserStr ? JSON.parse(updatedUserStr) : {};
            setUser({
              ...parsedUser,
              role: updatedRole || parsedUser.role || 'Site Engineer',
              token: updatedToken || parsedUser.token || 'demo-jwt-token'
            });
          } catch (err) {
            console.error('Error parsing updated user from storage event:', err);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData, tokenStr) => {
    const token = tokenStr || userData?.token || 'demo-jwt-token-123456';
    const role = userData?.role || 'Site Engineer';
    const completeUser = { ...userData, role, token };

    // Explicitly set all storage items required for persistence & cross-tab sync
    localStorage.setItem('userToken', token);
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('user', JSON.stringify(completeUser));

    setUser(completeUser);
  };

  const logout = () => {
    // Completely clear all auth items from localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};