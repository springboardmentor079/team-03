import api from './api';

const STORAGE_KEY = 'buildtrack_notifications';

const initialNotifications = [
  {
    id: 'notif-1',
    title: 'Critical Warning: Storage Capacity',
    message: 'Material Warehouse B is at 85% capacity threshold.',
    type: 'Procurement Alerts',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
  },
  {
    id: 'notif-2',
    title: 'Active Workforce Allocation',
    message: 'Site workforce allocation reached 91% today.',
    type: 'Attendance Alerts',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'notif-3',
    title: 'Milestone Deadline Approaching',
    message: 'Phase 2 Foundation Work due in 3 days for Oakwood Center.',
    type: 'Deadline Notifications',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
  },
  {
    id: 'notif-4',
    title: 'Purchase Order Approved',
    message: 'PO-2026-089 (Steel Beams) approved by Admin.',
    type: 'Procurement Alerts',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  }
];

const getStoredNotifications = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications));
      return initialNotifications;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load stored notifications:', e);
    return initialNotifications;
  }
};

const setStoredNotifications = (notifications) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications to storage:', e);
  }
};

/**
 * Fetch all notifications for current user
 */
export const getNotifications = async () => {
  try {
    const res = await api.get('/notifications');
    if (res.data && Array.isArray(res.data)) {
      setStoredNotifications(res.data);
      return res.data;
    }
    return getStoredNotifications();
  } catch (err) {
    // Graceful fallback to local persistent store if API is offline
    return getStoredNotifications();
  }
};

/**
 * Mark a single notification as read
 */
export const markAsRead = async (id) => {
  try {
    await api.patch(`/notifications/${id}/read`);
  } catch (err) {
    // Handled via local state sync
  }
  const current = getStoredNotifications();
  const updated = current.map(item => (item.id === id || item._id === id ? { ...item, isRead: true } : item));
  setStoredNotifications(updated);
  return updated;
};

/**
 * Mark all notifications as read / clear unread badges
 */
export const markAllAsRead = async () => {
  try {
    await api.patch('/notifications/read-all');
  } catch (err) {
    // Local sync fallback
  }
  const current = getStoredNotifications();
  const updated = current.map(item => ({ ...item, isRead: true }));
  setStoredNotifications(updated);
  return updated;
};

/**
 * Clear all notifications
 */
export const clearNotifications = async () => {
  try {
    await api.delete('/notifications');
  } catch (err) {
    // Local sync fallback
  }
  setStoredNotifications([]);
  return [];
};

/**
 * Add a new notification programmatically (for frontend events)
 */
export const createNotification = async (notification) => {
  const newNotif = {
    id: `notif-${Date.now()}`,
    title: notification.title || 'System Notification',
    message: notification.message || '',
    type: notification.type || 'System Notifications',
    isRead: false,
    createdAt: new Date().toISOString()
  };
  try {
    const res = await api.post('/notifications', newNotif);
    if (res.data) {
      const current = getStoredNotifications();
      setStoredNotifications([res.data, ...current]);
      return res.data;
    }
  } catch (err) {
    // Local fallback
  }
  const current = getStoredNotifications();
  const updated = [newNotif, ...current];
  setStoredNotifications(updated);
  return newNotif;
};
