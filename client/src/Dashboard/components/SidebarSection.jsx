// src/Dashboard/components/SidebarSection.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Dumbbell, Apple, TrendingUp, Target,
  Calendar, BarChart3, Settings, LogOut, ChevronRight,
  Users, MessageSquare,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../pages/UseLanguage';

// ── Glassmorphism shared styles (mirrors RemindersSection) ───────────────────
const sidebarStyle = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRight: '1px solid rgba(255,255,255,0.10)',
  boxShadow: '4px 0 32px rgba(0,0,0,0.20), inset -1px 0 0 rgba(255,255,255,0.06)',
};

const injectStyles = `
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }

  .nav-item-active {
    background: color-mix(in srgb, var(--accent) 14%, transparent) !important;
    border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08),
                0 2px 12px color-mix(in srgb, var(--accent) 15%, transparent);
  }

  .nav-item-inactive {
    border: 1px solid transparent;
  }

  .nav-item-inactive:hover {
    background: rgba(255,255,255,0.05) !important;
    border-color: rgba(255,255,255,0.07) !important;
  }

  .sidebar-scrollbar::-webkit-scrollbar { width: 3px; }
  .sidebar-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .sidebar-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.10);
    border-radius: 999px;
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

const SidebarSection = ({ user, logout }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { t }     = useLanguage();

  let menu = [
    { Icon: Home,         label: t('dashboard'),  path: '/dashboard' },
    { Icon: Dumbbell,     label: t('workouts'),   path: '/dashboard/workouts' },
    { Icon: Apple,        label: t('nutrition'),  path: '/dashboard/nutrition' },
    { Icon: TrendingUp,   label: t('progress'),   path: '/dashboard/progress' },
    { Icon: Target,       label: t('goals'),      path: '/dashboard/goals' },
    { Icon: Calendar,     label: t('reminders'),  path: '/dashboard/reminders' },
    { Icon: BarChart3,    label: t('analytics'),  path: '/dashboard/analytics' },
    { Icon: Users,        label: 'Community',     path: '/dashboard/community' },
    { Icon: MessageSquare, label: 'Give Feedback', path: '/dashboard/add-feedback' },
    { Icon: Settings,     label: t('settings'),   path: '/dashboard/settings' }
  ];

  if (user?.role === 'admin') {
    menu = [
      { Icon: Users,         label: 'All Users',  path: '/dashboard' },
      { Icon: TrendingUp,    label: 'Profile',    path: '/dashboard/profile' },
      { Icon: Settings,      label: 'Settings',   path: '/dashboard/settings' },
      { Icon: MessageSquare, label: 'Feedbacks',  path: '/dashboard/feedbacks' },
    ];
  }

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <style>{injectStyles}</style>

      <motion.aside
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  className="flex-shrink-0 flex flex-col overflow-hidden"
  style={{
    width: 260,
    ...sidebarStyle,
    position: 'sticky',   
    top: 0,              
    left: 0,             
    height: '100vh',     
  }}
>

        {/* ── Logo ── */}
        <div className="px-5 pt-6 pb-5" style={{
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <img src="../logo-blue.png" className='justify-self-center' width={128} alt="Logo" />
        </div>

        {/* ── Nav items ── */}
        <nav className="px-3 pb-3 pt-2 space-y-0.5 flex-1 overflow-y-auto sidebar-scrollbar">
          {menu.map(({ Icon, label, path }, i) => {
            const active = location.pathname === path;
            return (
              <motion.a
                key={path}
                href={path}
                onClick={e => { e.preventDefault(); navigate(path); }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1,  x: 0 }}
                transition={{ delay: i * 0.045, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                whileHover={!active ? { x: 4 } : {}}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer
                  ${active ? 'nav-item-active' : 'nav-item-inactive'}`}
                style={{ textDecoration: 'none' }}
              >
                {/* Icon container */}
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={active ? {
                    background: 'color-mix(in srgb, var(--accent) 18%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                  } : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                  <Icon className="w-4 h-4" style={{
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                    filter: active ? 'drop-shadow(0 0 4px var(--accent))' : 'none',
                    transition: 'all 0.2s ease',
                  }} />
                </div>

                {/* Label */}
                <span className="text-sm font-medium flex-1 truncate" style={{
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  transition: 'color 0.2s ease',
                }}>
                  {label}
                </span>

                {/* Active chevron */}
                <AnimatePresence>
                  {active && (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1,  x: 0 }}
                      exit={{  opacity: 0,  x: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-3.5 h-3.5" style={{
                        color: 'var(--accent)',
                        filter: 'drop-shadow(0 0 4px var(--accent))',
                      }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.a>
            );
          })}
        </nav>

      </motion.aside>
    </>
  );
};

export default SidebarSection;