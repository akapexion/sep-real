// src/Dashboard/components/SidebarSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Home, Dumbbell, Apple, TrendingUp, Target,
  Calendar, BarChart3, Settings, LogOut, ChevronRight, Users, MessageSquare
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../pages/UseLanguage'; // Add language hook

const SidebarSection = ({ user, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage(); // Use language hook

  // Define menu with translations
  const menu = [
    { Icon: Home, label: t('dashboard'), path: '/dashboard' },
    { Icon: Dumbbell, label: t('workouts'), path: '/dashboard/workouts' },
    { Icon: Apple, label: t('nutrition'), path: '/dashboard/nutrition' },
    { Icon: TrendingUp, label: t('progress'), path: '/dashboard/progress' },
    { Icon: Target, label: t('goals'), path: '/dashboard/goals' },
    { Icon: Calendar, label: t('reminders'), path: '/dashboard/reminders' },
    { Icon: BarChart3, label: t('analytics'), path: '/dashboard/analytics' },
    { Icon: Settings, label: t('settings'), path: '/dashboard/settings' },
    { Icon: Users, label: 'Community', path: '/dashboard/community' },
    { Icon: MessageSquare, label: 'Give Feedback', path: '/dashboard/feedbacks' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Owais Abdullah

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: 260 }}
      transition={{ type: 'tween', duration: 0.2 }}
      className="sidebar flex-shrink-0 flex flex-col min-h-screen overflow-hidden"
      style={{
        width: 260,
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
      }}
    >
      <div className="p-5 flex items-center space-x-3">
        <img src="../logo.png" width={150} alt="" />
      </div>

      <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
        {menu.map(({ Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <motion.a
              key={path}
              href={path}
              onClick={e => { e.preventDefault(); navigate(path); }}
              whileHover={{ x: 6 }}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${active
                ? 'bg-[var(--accent)]/20 border'
                : 'hover:bg-[var(--bg-card-hover)]'
                }`}
              style={{
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                borderColor: active ? 'var(--accent)' : 'transparent',
              }}
            >
              <Icon className="w-5 h-5" style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
              <span className="font-medium">{label}</span>
              {active && <ChevronRight className="ml-auto w-4 h-4" style={{ color: 'var(--accent)' }} />}
            </motion.a>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
      </div>
    </motion.aside>
  );
};

export default SidebarSection;