// src/Dashboard/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Sidebar from '../pages/Sidebar';

const DashboardLayout = ({ user, logout, updateUser }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ? saved === 'dark' : prefersDark;
    setIsDark(initial);
    document.documentElement.setAttribute('data-theme', initial ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const theme = newTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Sidebar user={user} logout={logout} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar user={user} toggleTheme={toggleTheme} isDark={isDark} />
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="dashboard-header px-6 py-4"
        >
          <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>FitTrack</h1>
        </motion.header>
<main className="flex-1 p-6 overflow-auto">
  <Outlet context={{ user, updateUser }} />
</main>

      </div>
    </div>
  );
};

export default DashboardLayout;