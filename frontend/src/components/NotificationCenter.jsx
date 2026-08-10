import React, { useState, useEffect, useRef } from 'react';
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from '../services/notificationService';

const getBadgeStyle = (type) => {
  switch (type) {
    case 'Procurement Alerts':
      return { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' };
    case 'Attendance Alerts':
      return { background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' };
    case 'Deadline Notifications':
      return { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' };
    default:
      return { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' };
  }
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const diffInMs = new Date() - new Date(dateString);
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data || []);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleItemClick = async (notif) => {
    if (!notif.isRead) {
      const updated = await markAsRead(notif.id || notif._id);
      setNotifications(updated);
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    const updated = await markAllAsRead();
    setNotifications(updated);
  };

  const handleClearAll = async (e) => {
    e.stopPropagation();
    const updated = await clearNotifications();
    setNotifications(updated);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Notification Bell Icon */}
      <button
        className="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        style={{
          background: 'none',
          border: 'none',
          padding: '8px',
          borderRadius: '50%',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <div className="notification-dot" style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: '#ef4444',
            color: '#fff',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
          }}>
            <span>{unreadCount}</span>
          </div>
        )}
      </button>

      {/* Notification Dropdown Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '48px',
            right: 0,
            width: '360px',
            maxHeight: '480px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
            border: '1px solid #e2e8f0',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: '#1e293b' }}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span style={{
                  fontSize: '11px',
                  backgroundColor: '#00c938',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: '600'
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00c938',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Mark Read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* List Items */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id || item._id}
                  onClick={() => handleItemClick(item)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f8fafc',
                    backgroundColor: item.isRead ? '#ffffff' : 'rgba(0, 201, 56, 0.04)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.isRead ? '#ffffff' : 'rgba(0, 201, 56, 0.04)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '600',
                      ...getBadgeStyle(item.type)
                    }}>
                      {item.type || 'Alert'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: item.isRead ? '500' : '700',
                    color: item.isRead ? '#475569' : '#0f172a'
                  }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                    {item.message}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="1.5" fill="none" style={{ marginBottom: '8px', opacity: 0.5 }}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p style={{ fontSize: '13px', margin: 0, fontWeight: '500' }}>No notifications at this time</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
