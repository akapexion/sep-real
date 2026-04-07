// src/Dashboard/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../pages/Navbar';
import Sidebar from '../pages/Sidebar';
import { usePreferencesContext } from '../pages/PreferencesContext';

const DashboardLayout = ({ user, logout, updateUser }) => {
  const { preferences, updatePreferences } = usePreferencesContext();
  const [isDark, setIsDark] = useState(true);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [isSavingWeight, setIsSavingWeight] = useState(false);

  useEffect(() => {
    if (user && user.currentWeight === null) {
      setShowWeightModal(true);
    }
  }, [user]);

  const handleSaveWeight = async () => {
    if (!weightInput || isNaN(weightInput)) return toast.error("Please enter a valid weight");
    setIsSavingWeight(true);
    try {
      const res = await axios.post('http://localhost:3000/profile/weight', {
        userId: user._id,
        currentWeight: Number(weightInput)
      });
      const updated = { ...user, currentWeight: res.data.currentWeight };
      localStorage.setItem("user", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("profile-updated", { detail: updated }));
      if (updateUser) updateUser(updated);
      setShowWeightModal(false);
      toast.success("Weight saved!");
    } catch (err) {
      toast.error("Failed to save weight.");
    } finally {
      setIsSavingWeight(false);
    }
  };

  useEffect(() => {
    // Use preferences theme if available, otherwise use localStorage
    if (preferences) {
      const theme = preferences.theme === 'dark';
      setIsDark(theme);
      document.documentElement.setAttribute('data-theme', preferences.theme);
    } else {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = saved ? saved === 'dark' : prefersDark;
      setIsDark(initial);
      document.documentElement.setAttribute('data-theme', initial ? 'dark' : 'light');
    }
  }, [preferences]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const theme = newTheme ? 'dark' : 'light';

    // Update preferences in database
    if (preferences) {
      updatePreferences({
        ...preferences,
        theme: theme
      });
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {showWeightModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="p-8 w-full max-w-md text-center glass transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Welcome to FitTrack!</h2>
            <p className="mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>We just need your current weight to personalize your dashboard.</p>
            <input
              type="number"
              placeholder="Current Weight (kg/lbs)"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full text-center p-3 text-lg rounded-xl mb-6 border focus:outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            />
            <button
              onClick={handleSaveWeight}
              disabled={isSavingWeight}
              className="w-full py-3 rounded-xl font-bold text-black transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: 'var(--accent)', boxShadow: '0 0 15px var(--accent)' }}
            >
              {isSavingWeight ? "Saving..." : "Let's Go!"}
            </button>
          </div>
        </div>
      )}
      <Sidebar user={user} logout={logout} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar logout={logout} user={user} toggleTheme={toggleTheme} isDark={isDark} />
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="dashboard-header px-6 py-4"
        >
          <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>LIFT & PRESS</h1>
        </motion.header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet context={{ user, updateUser }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;