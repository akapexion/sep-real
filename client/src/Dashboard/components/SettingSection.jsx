// src/Dashboard/components/SettingSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SettingSection = () => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    units: 'metric',
    theme: 'dark',
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id; 
  const API_BASE_URL = 'http://localhost:3000'; 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!userId) {
        toast.error('User not logged in');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/preferences?userId=${userId}`);
        setPreferences(res.data);
      } catch (err) {
        toast.error('Failed to load preferences');
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error('User not logged in');
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/preferences`, { ...preferences, userId });
      toast.success('Preferences updated!');
      document.documentElement.setAttribute('data-theme', preferences.theme);
    } catch (err) {
      toast.error('Failed to update preferences');
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return;
    }
    if (!userId) {
      toast.error('User not logged in');
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/profile?userId=${userId}`);
      toast.success('Profile deleted successfully');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to delete profile');
    }
  };

  if (loading) return <p className="text-var(--text-muted)">Loading settings...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 rounded-lg shadow-md"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>User Preferences</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            checked={preferences.notifications}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="notifications" className="text-var(--text-primary)">Enable Notifications</label>
        </div>
        <div>
          <label className="block text-var(--text-secondary) mb-1">Units of Measurement</label>
          <select
            name="units"
            value={preferences.units}
            onChange={handleChange}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            <option value="metric">Metric (kg, cm)</option>
            <option value="imperial">Imperial (lbs, in)</option>
          </select>
        </div>
        <div>
          <label className="block text-var(--text-secondary) mb-1">Theme</label>
          <select
            name="theme"
            value={preferences.theme}
            onChange={handleChange}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md font-bold"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
        >
          Save Changes
        </button>
      </form>
      <div className="mt-6 pt-6 border-t border-[var(--border)]">
        <button
          onClick={handleDeleteProfile}
          className="w-full py-2 rounded-md font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Delete Profile
        </button>
      </div>
    </motion.div>
  );
};

export default SettingSection;