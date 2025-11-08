// src/Dashboard/components/NavbarSection.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Sun, Moon, CheckCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavbarSection = ({ user, toggleTheme, isDark }) => {
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:3000';

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications?userId=${user._id}`);
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notification-button')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const markAllRead = async () => {
    try {
      for (const notif of notifications.filter(n => !n.isRead)) {
        await axios.post(`${API_BASE_URL}/notifications/${notif._id}`, { userId: user._id });
      }
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const markRead = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/notifications/${id}`, { userId: user._id });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/notifications/${id}?userId=${user._id}`);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  const profileImageUrl = user.profilePic ? `${API_BASE_URL}/uploads/${user.profilePic}` : '';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-header px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search workouts, meals..."
            className="input pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 rounded-full card"
          aria-label="Toggle theme"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          {isDark ? (
            <Sun className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          ) : (
            <Moon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          )}
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="notification-button relative p-2 rounded-full card"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <Bell className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </motion.button>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 mt-2 w-96 bg-[var(--bg-card)] rounded-lg shadow-xl border border-[var(--border)] overflow-hidden z-50 max-h-96 overflow-y-auto"
            >
              <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead} 
                    className="text-sm hover:underline" 
                    style={{ color: 'var(--accent)' }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="p-4 text-center" style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    className={`p-4 border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] flex justify-between items-start ${notif.isRead ? 'opacity-75' : ''}`}
                  >
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}: {notif.message}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(notif.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notif.isRead && (
                        <button 
                          onClick={() => markRead(notif._id)} 
                          className="p-1 hover:bg-[var(--bg-card-hover)] rounded"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notif._id)} 
                        className="p-1 hover:bg-red-500/10 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={handleProfileClick}
          className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--bg-card-hover)' }}
        >
          <div className="relative">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--accent)]/30 shadow-md"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg-card-hover)]"></div>
          </div>
          
          <div className="text-left">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'Guest User'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Fitness Enthusiast
            </p>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default NavbarSection;