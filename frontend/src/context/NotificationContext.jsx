import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { useAdminAuth } from './AdminAuthContext';
import notificationsApi from '../api/notifications.api';
import NotificationToast from '../components/NotificationToast';

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  fetchNotifications: async () => {}
});

// Clean Web Audio API Chime Synthesizer for Audio Alerts (No MP3 file dependency)
const playChimeSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5

    osc2.frequency.setValueAtTime(659.25, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.25); // G5

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.12);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  } catch (e) {
    // Audio autoplay blocked or unsupported
  }
};

export const NotificationProvider = ({ children }) => {
  const { socket } = useSocket();
  const { isAuthenticated: isCustomerAuth } = useAuth();
  const { isAuthenticated: isAdminAuth } = useAdminAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeToast, setActiveToast] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isCustomerAuth && !isAdminAuth) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const res = isAdminAuth
        ? await notificationsApi.getAdminNotifications()
        : await notificationsApi.getMyNotifications();

      if (res.data && res.data.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Notifications REST API offline or error:', err.message);
    }
  }, [isCustomerAuth, isAdminAuth]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for Real-Time Socket Notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data) => {
      console.log('Real-time Notification received:', data);

      // Play audio chime
      playChimeSound();

      // Set active toast banner
      setActiveToast(data);

      // Add to notifications state list
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((count) => count + 1);

      // Auto dismiss toast after 5 seconds
      setTimeout(() => {
        setActiveToast((current) => (current === data ? null : current));
      }, 5000);
    };

    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => ((n._id || n.id) === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((count) => Math.max(0, count - 1));
      await notificationsApi.markAsRead(id);
    } catch (err) {
      console.warn('Failed to mark notification read:', err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      await notificationsApi.markAllAsRead();
    } catch (err) {
      console.warn('Failed to mark all notifications read:', err.message);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToast,
        closeToast: () => setActiveToast(null),
        markAsRead,
        markAllAsRead,
        fetchNotifications
      }}
    >
      {children}
      <NotificationToast toast={activeToast} onClose={() => setActiveToast(null)} />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
export default NotificationContext;
