import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import '../pages/Dashboards/AdminDashboard.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Determine active link based on current path
  const currentPath = location.pathname;
  let activeLink = 'Dashboard';
  if (currentPath.includes('projects')) activeLink = 'Projects';
  if (currentPath.includes('inventory')) activeLink = 'Inventory';
  if (currentPath.includes('workforce')) activeLink = 'Workforce';
  if (currentPath.includes('resources')) activeLink = 'Resources';
  if (currentPath.includes('analytics')) activeLink = 'Analytics';

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'Administrator': return '/dashboard/admin';
      case 'Project Manager': return '/dashboard/pm';
      case 'Site Engineer': return '/dashboard/engineer';
      case 'Contractor': return '/dashboard/contractor';
      case 'Worker': return '/dashboard/worker';
      case 'Client': return '/dashboard/client';
      default: return '/dashboard/projects-list';
    }
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: getDashboardPath(),
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    },
    // Only add these items if the user is an Administrator
    ...(user?.role === 'Administrator' ? [
      {
        name: 'Projects',
        path: '/dashboard/projects-list',
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        )
      },
      {
        name: 'Inventory',
        path: '/inventory',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        )
      },
      {
        name: 'Workforce',
        path: '/workforce',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
      },
      {
        name: 'Resources',
        path: '/dashboard/resources/allocation',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        )
      },
      {
        name: 'Analytics',
        path: '/dashboard/analytics/progress',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        )
      }
    ] : [])
  ];

  const clearNotifications = () => {
    setNotificationCount(0);
    setShowNotifications(false);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowProfileMenu(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* 1. LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand-section">
          <div className="sidebar-brand">
            <div className="sidebar-logo-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="sidebar-brand-name">BuildTrack</span>
          </div>

          <div className="sidebar-menu-section">
            <h2 className="sidebar-menu-header">Main Menu</h2>
            <ul className="sidebar-menu-list">
              {menuItems.map((item) => (
                <li key={item.name} className="sidebar-menu-item">
                  <Link
                    to={item.path}
                    className={`sidebar-link ${activeLink === item.name ? 'active' : ''}`}
                  >
                    <div className="sidebar-link-content">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {activeLink === item.name && <div className="sidebar-active-dot" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sidebar-footer">
          <span>PLATFORM VERSION</span>
          <span>BuildTrack v3.4.1</span>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="main-content">
        {/* 2. HEADER */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="header-title">{activeLink}</h1>
            <p className="header-subtitle">Welcome back — here's what's happening today.</p>
          </div>

          <div className="header-right">
            {/* Search Box */}
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search projects, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                className="notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="View notifications"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {notificationCount > 0 && (
                  <div className="notification-dot">
                    <span className="notification-dot-inner">{notificationCount}</span>
                  </div>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    width: '300px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    zIndex: 100,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Recent Notifications</h3>
                    <button
                      onClick={clearNotifications}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#00c938',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                  {notificationCount > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <li style={{ fontSize: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <strong>Critical Warning:</strong> Storage Capacity at 85%.
                      </li>
                      <li style={{ fontSize: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <strong>Active Workforce:</strong> Allocation reached 91% today.
                      </li>
                      <li style={{ fontSize: '12px' }}>
                        <strong>System Alert:</strong> Server CPU Load reached 62%.
                      </li>
                    </ul>
                  ) : (
                    <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>No new notifications</p>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <div className="user-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <div className="profile-avatar">{user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}</div>
                <div className="profile-info">
                  <span className="profile-name">{user?.name || 'User'}</span>
                  <svg className="profile-chevron" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    width: '180px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    padding: '8px 0',
                    zIndex: 100,
                  }}
                >
                  <Link
                    to="/dashboard/profile"
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: '#0f172a',
                      textDecoration: 'none',
                    }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Profile
                  </Link>
                  <a
                    href="#settings"
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: '#0f172a',
                      textDecoration: 'none',
                    }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Settings
                  </a>
                  <hr style={{ border: 0, borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
                  <a
                    href="/"
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: '#ef4444',
                      textDecoration: 'none',
                      fontWeight: '600',
                    }}
                    onClick={handleLogoutClick}
                  >
                    Log Out
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC CONTENT OUTLET */}
        <div className="dashboard-body">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal 
        show={showLogoutModal} 
        onConfirm={confirmLogout} 
        onCancel={() => setShowLogoutModal(false)} 
      />
    </div>
  );
};

export default DashboardLayout;