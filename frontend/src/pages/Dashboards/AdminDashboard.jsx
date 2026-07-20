import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeLink, setActiveLink] = useState('Dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    },
    {
      name: 'User Management',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      name: 'Projects',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      icon: (
        <svg viewBox="0 0 24 24">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    {
      name: 'Reports',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      name: 'Activity Logs',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    }
  ];

  const handleLinkClick = (name, e) => {
    e.preventDefault();
    setActiveLink(name);
  };

  const clearNotifications = () => {
    setNotificationCount(0);
    setShowNotifications(false);
  };

  return (
    <div className="dashboard-container">
      {/* 1. LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand-section">
          <div className="sidebar-brand">
            <div className="sidebar-logo-icon">
              {/* Stack / layers icon resembling construction/projects */}
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
                  <a
                    href={`#${item.name.toLowerCase().replace(' ', '-')}`}
                    className={`sidebar-link ${activeLink === item.name ? 'active' : ''}`}
                    onClick={(e) => handleLinkClick(item.name, e)}
                  >
                    <div className="sidebar-link-content">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {activeLink === item.name && <div className="sidebar-active-dot" />}
                  </a>
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
            <h1 className="header-title">Administrator Dashboard</h1>
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

              {/* Notification Dropdown (Micro-interaction) */}
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
                <div className="profile-avatar">AU</div>
                <div className="profile-info">
                  <span className="profile-name">Admin User</span>
                  <svg className="profile-chevron" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Profile Dropdown Menu (Micro-interaction) */}
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
                    href="#logout"
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: '#ef4444',
                      textDecoration: 'none',
                      fontWeight: '600',
                    }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Log Out
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. DASHBOARD MAIN BODY */}
        <div className="dashboard-body">
          {/* STATS CARDS */}
          <section className="stats-grid">
            {/* Card 1: Total Users */}
            <div className="stat-card total-users">
              <div className="stat-card-left">
                <span className="stat-title">Total Users</span>
                <span className="stat-value">4,821</span>
                <div className="stat-trend">
                  <div className="stat-trend-top trend-green">
                    <svg className="trend-icon-sm" viewBox="0 0 24 24">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                    <span>+ 12.4%</span>
                  </div>
                  <span className="stat-trend-bottom">from last month</span>
                </div>
              </div>
              <div className="stat-card-right">
                <svg viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>

            {/* Card 2: Active Projects */}
            <div className="stat-card active-projects">
              <div className="stat-card-left">
                <span className="stat-title">Active Projects</span>
                <span className="stat-value">138</span>
                <div className="stat-trend">
                  <div className="stat-trend-top trend-green">
                    <svg className="trend-icon-sm" viewBox="0 0 24 24">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                    <span>23 added</span>
                  </div>
                  <span className="stat-trend-bottom">this quarter</span>
                </div>
              </div>
              <div className="stat-card-right">
                <svg viewBox="0 0 24 24">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>

            {/* Card 3: Total Budget */}
            <div className="stat-card total-budget">
              <div className="stat-card-left">
                <span className="stat-title">Total Budget</span>
                <span className="stat-value">$94.7M</span>
                <div className="stat-trend">
                  <div className="stat-trend-top trend-gray">
                    <span>Stable</span>
                  </div>
                  <span className="stat-trend-bottom">$6.2M allocated this week</span>
                </div>
              </div>
              <div className="stat-card-right">
                <svg viewBox="0 0 24 24">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>

            {/* Card 4: System Alerts */}
            <div className="stat-card system-alerts">
              <div className="stat-card-left">
                <span className="stat-title">System Alerts</span>
                <span className="stat-value">7</span>
                <div className="stat-trend">
                  <div className="stat-trend-top trend-orange">
                    <svg className="trend-icon-sm" viewBox="0 0 24 24">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>3 urgent</span>
                  </div>
                  <span className="stat-trend-bottom">require immediate action</span>
                </div>
              </div>
              <div className="stat-card-right">
                <svg viewBox="0 0 24 24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
            </div>
          </section>

          {/* LOWER SECTION (2 COLUMNS) */}
          <section className="lower-grid">
            {/* Left Card: Projects by Category (HTML/CSS Bar Chart) */}
            <div className="dashboard-card">
              <div className="card-header-wrapper">
                <div>
                  <h2 className="card-title">Projects by Category</h2>
                  <p className="card-subtitle">Distribution across project types</p>
                </div>
                <span className="card-badge">Q2 2026</span>
              </div>

              {/* Bar Chart Block */}
              <div className="bar-chart-container">
                {/* Background Grid Lines */}
                <div className="chart-grid-lines">
                  <div className="grid-line-item" data-value="60"></div>
                  <div className="grid-line-item" data-value="45"></div>
                  <div className="grid-line-item" data-value="30"></div>
                  <div className="grid-line-item" data-value="15"></div>
                  <div className="grid-line-item" data-value="0"></div>
                </div>

                {/* Vertical Bars container */}
                <div className="chart-content-area">
                  {/* Residential Bar */}
                  <div className="chart-bar-column">
                    <div className="chart-bar-wrapper">
                      <div className="chart-bar-fill bar-residential" style={{ height: '86.6%' }}></div>
                      <div className="chart-bar-tooltip">Residential: 52</div>
                    </div>
                  </div>

                  {/* Commercial Bar */}
                  <div className="chart-bar-column">
                    <div className="chart-bar-wrapper">
                      <div className="chart-bar-fill bar-commercial" style={{ height: '63.3%' }}></div>
                      <div className="chart-bar-tooltip">Commercial: 38</div>
                    </div>
                  </div>

                  {/* Industrial Bar */}
                  <div className="chart-bar-column">
                    <div className="chart-bar-wrapper">
                      <div className="chart-bar-fill bar-industrial" style={{ height: '48.3%' }}></div>
                      <div className="chart-bar-tooltip">Industrial: 29</div>
                    </div>
                  </div>

                  {/* Infrastructure Bar */}
                  <div className="chart-bar-column">
                    <div className="chart-bar-wrapper">
                      <div className="chart-bar-fill bar-infrastructure" style={{ height: '31.6%' }}></div>
                      <div className="chart-bar-tooltip">Infrastructure: 19</div>
                    </div>
                  </div>
                </div>

                {/* X Axis Labels */}
                <div className="chart-x-axis">
                  <span className="chart-x-label">Residential</span>
                  <span className="chart-x-label">Commercial</span>
                  <span className="chart-x-label">Industrial</span>
                  <span className="chart-x-label">Infrastructure</span>
                </div>
              </div>

              {/* Legends */}
              <div className="chart-legend-wrapper">
                <div className="legend-item">
                  <div className="legend-dot residential"></div>
                  <span>Residential <span className="legend-count">(52)</span></span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot commercial"></div>
                  <span>Commercial <span className="legend-count">(38)</span></span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot industrial"></div>
                  <span>Industrial <span className="legend-count">(29)</span></span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot infrastructure"></div>
                  <span>Infrastructure <span className="legend-count">(19)</span></span>
                </div>
              </div>
            </div>

            {/* Right Card: Resource & System Load (Horizontal Progress Bars) */}
            <div className="dashboard-card">
              <div className="card-header-wrapper">
                <div>
                  <h2 className="card-title">Resource & System Load</h2>
                  <p className="card-subtitle">Real-time utilization overview</p>
                </div>
                <div className="live-badge">
                  <div className="live-dot"></div>
                  <span>Live</span>
                </div>
              </div>

              <div className="resource-load-list">
                {/* 1. Overall Budget Utilization (78%, orange) */}
                <div className="resource-item">
                  <div className="resource-label-row">
                    <div className="resource-label-group">
                      <span className="resource-name">Overall Budget Utilization</span>
                      <span className="resource-tag finance">Finance</span>
                    </div>
                    <span className="resource-percent-label orange">78%</span>
                  </div>
                  <div className="resource-track">
                    <div className="resource-fill orange" style={{ width: '78%' }}></div>
                  </div>
                </div>

                {/* 2. Server CPU Load (62%, green) */}
                <div className="resource-item">
                  <div className="resource-label-row">
                    <div className="resource-label-group">
                      <span className="resource-name">Server CPU Load</span>
                      <span className="resource-tag infrastructure">Infrastructure</span>
                    </div>
                    <span className="resource-percent-label green">62%</span>
                  </div>
                  <div className="resource-track">
                    <div className="resource-fill green" style={{ width: '62%' }}></div>
                  </div>
                </div>

                {/* 3. Storage Capacity Used (85%, red) */}
                <div className="resource-item">
                  <div className="resource-label-row">
                    <div className="resource-label-group">
                      <span className="resource-name">Storage Capacity Used</span>
                      <span className="resource-tag infrastructure">Infrastructure</span>
                    </div>
                    <span className="resource-percent-label red">85%</span>
                  </div>
                  <div className="resource-track">
                    <div className="resource-fill red" style={{ width: '85%' }}></div>
                  </div>
                </div>

                {/* 4. Active Workforce Allocation (91%, red) */}
                <div className="resource-item">
                  <div className="resource-label-row">
                    <div className="resource-label-group">
                      <span className="resource-name">Active Workforce Allocation</span>
                      <span className="resource-tag hr">HR</span>
                    </div>
                    <span className="resource-percent-label red">91%</span>
                  </div>
                  <div className="resource-track">
                    <div className="resource-fill red" style={{ width: '91%' }}></div>
                  </div>
                </div>

                {/* 5. Equipment Utilization (54%, green) */}
                <div className="resource-item">
                  <div className="resource-label-row">
                    <div className="resource-label-group">
                      <span className="resource-name">Equipment Utilization</span>
                      <span className="resource-tag operations">Operations</span>
                    </div>
                    <span className="resource-percent-label green">54%</span>
                  </div>
                  <div className="resource-track">
                    <div className="resource-fill green" style={{ width: '54%' }}></div>
                  </div>
                </div>
              </div>

              {/* Status Guide / Legend */}
              <div className="load-legend">
                <div className="load-legend-item">
                  <div className="load-legend-dot green"></div>
                  <span>Normal &lt; 70%</span>
                </div>
                <div className="load-legend-item">
                  <div className="load-legend-dot orange"></div>
                  <span>Warning 70-84%</span>
                </div>
                <div className="load-legend-item">
                  <div className="load-legend-dot red"></div>
                  <span>Critical &ge; 85%</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
