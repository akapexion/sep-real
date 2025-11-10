// src/Dashboard/components/SettingSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save, Trash2, Bell, Globe, Clock } from 'lucide-react';
import { usePreferences } from './usePreferences';
import { t } from '../../i18n';

const SettingSection = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { prefs: preferences, update } = usePreferences(user._id);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [parent, child] = name.split('.');
    const newPrefs = { ...preferences };

    if (child) {
      newPrefs[parent][child] = type === 'checkbox' ? checked : value;
    } else {
      newPrefs[name] = type === 'checkbox' ? checked : value;
    }
    update(newPrefs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await update(preferences);
      toast.success('Settings saved!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!confirm('Profile delete karna chahte ho?')) return;
    try {
      await axios.delete(`http://localhost:3000/profile?userId=${user._id}`);
      localStorage.clear();
      navigate('/login');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (!preferences) return <Loader2 className="animate-spin" />;

  return (
    <motion.div className="p-6 rounded-lg shadow" style={{ background: 'var(--bg-card)' }}>
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
        {t('settings', preferences.language) || 'Settings'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Notifications */}
        <div>
          <h4 className="flex items-center gap-2 mb-2"><Bell className="w-4 h-4" /> Notifications</h4>
          <div className="grid grid-cols-3 gap-3">
            {['push', 'email', 'sms'].map(ch => (
              <label key={ch} className="flex items-center">
                <input type="checkbox" name={`notifications.${ch}`} checked={preferences.notifications[ch]} onChange={handleChange} className="mr-2" />
                <span className="capitalize">{ch}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Units */}
        <div>
          <label>Units</label>
          <select name="units" value={preferences.units} onChange={handleChange} className="w-full p-2 rounded mt-1" style={{ background: 'var(--input-bg)' }}>
            <option value="metric">Metric (kg, cm)</option>
            <option value="imperial">Imperial (lbs, in)</option>
          </select>
        </div>

        {/* Theme */}
        <div>
          <label>Theme</label>
          <select name="theme" value={preferences.theme} onChange={handleChange} className="w-full p-2 rounded mt-1" style={{ background: 'var(--input-bg)' }}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="flex items-center gap-2"><Globe className="w-4 h-4" /> Language</label>
          <select name="language" value={preferences.language} onChange={handleChange} className="w-full p-2 rounded mt-1" style={{ background: 'var(--input-bg)' }}>
            <option value="en">English</option>
            <option value="ur">اردو</option>
            <option value="es">Español</option>
          </select>
        </div>

        {/* Reminders */}
        <div>
          <h4 className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4" /> Reminders</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label>Workout</label>
              <input type="time" name="reminders.workout" value={preferences.reminders.workout} onChange={handleChange} className="w-full p-2 rounded mt-1" style={{ background: 'var(--input-bg)' }} />
            </div>
            <div>
              <label>Meal</label>
              <input type="time" name="reminders.meal" value={preferences.reminders.meal} onChange={handleChange} className="w-full p-2 rounded mt-1" style={{ background: 'var(--input-bg)' }} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full flex justify-center items-center gap-2 py-2 rounded font-bold" style={{ background: 'var(--accent)', color: 'white' }}>
          {saving ? <Loader2 className="animate-spin" /> : <Save />} {saving ? "Saving..." : "Save"}
        </button>
      </form>

      <button onClick={handleDeleteProfile} className="mt-6 w-full flex justify-center items-center gap-2 py-2 rounded bg-red-600 text-white">
        <Trash2 /> Delete Profile
      </button>
    </motion.div>
  );
};

export default SettingSection;