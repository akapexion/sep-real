// src/Dashboard/components/SidebarSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Home, Dumbbell, Apple, TrendingUp, Target,
  Calendar, BarChart3, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const menu = [
  { Icon: Home,        label: 'Dashboard',   path: '/dashboard' },
  { Icon: Dumbbell,    label: 'Workouts',    path: '/dashboard/workouts' },
  { Icon: Apple,       label: 'Nutrition',   path: '/dashboard/nutrition' },
  { Icon: TrendingUp,  label: 'Progress',    path: '/dashboard/progress' },
  { Icon: Target,      label: 'Goals',       path: '/dashboard/goals' },
  { Icon: Calendar,    label: 'Reminders',    path: '/dashboard/reminders' },
  { Icon: BarChart3,   label: 'Analytics',   path: '/dashboard/analytics' },
  { Icon: Settings,    label: 'Settings',    path: '/dashboard/settings' },
];

const SidebarSection = ({ user, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: 260 }}
      transition={{ type: 'tween', duration: 0.2 }}
      className="sidebar flex-shrink-0 flex flex-col min-h-screen overflow-hidden"  // Changed to min-h-screen
      style={{
        width: 260,
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* ---- Logo Section ---- */}
      <div className="p-5 flex items-center space-x-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-black"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          FT
        </div>

        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>FitTrack</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Level 12</p>
        </div>
      </div>

      {/* ---- Menu Section ---- */}
      <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
        {menu.map(({ Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <motion.a
              key={path}
              href={path}
              onClick={e => { e.preventDefault(); navigate(path); }}
              whileHover={{ x: 6 }}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${
                active
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

      {/* ---- Logout Section ---- */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default SidebarSection;