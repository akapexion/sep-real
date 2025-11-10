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

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications?userId=${user._id}`);
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleProfileClick = () => navigate('/dashboard/profile');

  const profileImageUrl = user?.profilePic
    ? `${API_BASE_URL}/uploads/${user.profilePic}`
    : '/default-avatar.png';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-header px-6 py-4 flex items-center justify-between"
    >
      {/* Search */}
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

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Theme toggle */}
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

        {/* Profile */}
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
              onError={(e) => (e.target.src = '/default-avatar.png')}
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
