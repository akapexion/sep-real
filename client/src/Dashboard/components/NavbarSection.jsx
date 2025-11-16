import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Sun, Moon, ChevronRight, CheckCircle, Trash2, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const NavbarSection = ({ user, toggleTheme, isDark }) => {
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:3000';

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profilePic, setProfilePic] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const notificationRef = useRef(null);
  const userId = user?._id;

  useEffect(() => {
    const loadProfilePic = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setProfilePic(storedUser.image || '');
    };
    
    loadProfilePic();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    const handleProfileUpdated = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setProfilePic(storedUser.image || '');
    };

    const handleNewNotification = () => {
      fetchNotifications();
    };

    window.addEventListener("profile-updated", handleProfileUpdated);
    window.addEventListener("new-notification", handleNewNotification);
    
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        const storedUser = JSON.parse(e.newValue || "{}");
        setProfilePic(storedUser.image || '');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
      window.removeEventListener("new-notification", handleNewNotification);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications?userId=${userId}`);
      const sortedNotifications = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotifications(sortedNotifications);
      setUnreadCount(sortedNotifications.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`${API_BASE_URL}/notifications/${notificationId}`, { userId });
      await fetchNotifications();
      toast.success('Marked as read');
    } catch (err) {
      console.error('Mark read error:', err);
      toast.error('Failed to mark as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!window.confirm('Delete notification?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/notifications/${notificationId}?userId=${userId}`);
      toast.success('Deleted');
      await fetchNotifications();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Delete failed');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(notif => 
          axios.post(`${API_BASE_URL}/notifications/${notif._id}`, { userId })
        )
      );
      await fetchNotifications();
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Mark all read error:', err);
      toast.error('Failed to mark all as read');
    }
  };

  const handleProfileClick = () => navigate('/dashboard/profile');

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    navigate('/dashboard/notifications');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'goal':
        return <Target className="w-4 h-4 text-green-500" />;
      case 'reminder':
        return <Bell className="w-4 h-4 text-blue-500" />;
      case 'alert':
        return <Bell className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationBorder = (type) => {
    switch (type) {
      case 'goal':
        return 'border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'reminder':
        return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'alert':
        return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const profileImageUrl = profilePic 
    ? `${API_BASE_URL}/uploads/${profilePic}`
    : null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-header px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search workouts, meals..."
            value={searchQuery}
            onChange={handleSearch}
            className="input pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition"
          />
        </form>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNotificationClick}
            className="p-2 rounded-full card relative"
            aria-label="Notifications"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <Bell className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </motion.button>

          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[var(--accent)] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleViewAllNotifications}
                      className="text-sm text-[var(--accent)] hover:underline flex items-center space-x-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {loading ? (
                <div className="p-4 text-center">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 mb-4">No notifications</p>
                  <button
                    onClick={handleViewAllNotifications}
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    Go to Notifications Page
                  </button>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.slice(0, 8).map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          !notification.isRead ? getNotificationBorder(notification.type) : 'opacity-70'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            {getNotificationIcon(notification.type)}
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              {notification.type}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(notification.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-white mb-2">
                          {notification.message}
                        </p>
                        <div className="flex justify-between items-center">
                          {!notification.isRead ? (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="text-xs text-[var(--accent)] hover:underline flex items-center space-x-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Mark read</span>
                            </button>
                          ) : (
                            <span className="text-xs text-green-500 flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Read</span>
                            </span>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="text-xs text-red-500 hover:text-red-700 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {notifications.length > 8 && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                      <button
                        onClick={handleViewAllNotifications}
                        className="w-full text-center text-sm text-[var(--accent)] hover:underline py-2 flex items-center justify-center space-x-1"
                      >
                        <span>View All Notifications ({notifications.length})</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>

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

        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={handleProfileClick}
          className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--bg-card-hover)' }}
        >
          <div className="relative">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--accent)]/30 shadow-md"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40x40?text=U';
                  e.target.onerror = null;
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center ring-2 ring-[var(--accent)]/30 shadow-md">
                <span className="text-sm font-semibold text-gray-600">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
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