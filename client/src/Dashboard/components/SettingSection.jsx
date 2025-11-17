// src/Dashboard/components/SettingSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save, Trash2, Bell, Globe, Smartphone, Shield, AlertTriangle } from 'lucide-react';
import { usePreferencesContext } from '../pages/PreferencesContext';
import { useLanguage } from '../pages/UseLanguage';

const SettingSection = () => {
  const { preferences, updatePreferences, loading } = usePreferencesContext();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [localPrefs, setLocalPrefs] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(JSON.parse(JSON.stringify(preferences)));
    }
  }, [preferences]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [parent, child] = name.split('.');
    
    setLocalPrefs(prev => {
      const newPrefs = JSON.parse(JSON.stringify(prev));
      
      if (child) {
        if (!newPrefs[parent]) newPrefs[parent] = {};
        newPrefs[parent][child] = type === 'checkbox' ? checked : value;
      } else {
        newPrefs[name] = type === 'checkbox' ? checked : value;
      }
      
      return newPrefs;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localPrefs) return;
    
    setSaving(true);
    try {
      await updatePreferences(localPrefs);
      toast.success(t('savedSuccessfully'));
    } catch (error) {
      toast.error(t('saveFailed'));
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm(
      `${t('areYouSure')}\n\n${t('thisActionCannotBeUndone')}`
    )) return;
    
    try {
      await axios.delete(`http://localhost:3000/profile?userId=${user._id}`);
      localStorage.clear();
      toast.success(t('deleteSuccessfully'));
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      toast.error(t('deleteFailed'));
      console.error('Delete error:', error);
    }
  };

  const handleResetForm = () => {
    setLocalPrefs(JSON.parse(JSON.stringify(preferences)));
    toast.info(t('changesDiscarded'));
  };

  if (loading || !localPrefs) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
        <span className="ml-2" style={{ color: "var(--text-primary)" }}>
          {t('loading')}
        </span>
      </div>
    );
  }

  const hasChanges = JSON.stringify(localPrefs) !== JSON.stringify(preferences);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg shadow-lg border"
      style={{ 
        background: 'var(--bg-card)', 
        borderColor: 'var(--border)'
      }}
    >
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: 'var(--accent)/20' }}>
            <Shield className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
              {t('preferences')}
            </h3>
            <p style={{ color: 'var(--text-muted)' }} className="mt-1">
              {t('manageYourAppSettings')}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="setting-group">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h4 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {t('notifications')}
            </h4>
          </div>
          
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <label className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
              style={{ 
                backgroundColor: localPrefs.notifications.push ? 'var(--accent)/10' : 'var(--bg-card)',
                borderColor: localPrefs.notifications.push ? 'var(--accent)' : 'var(--border)'
              }}
            >
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="notifications.push" 
                  checked={localPrefs.notifications.push} 
                  onChange={handleChange} 
                  className="w-5 h-5 rounded focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    accentColor: 'var(--accent)'
                  }}
                />
                <Smartphone className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <span className="font-medium text-lg" style={{ color: 'var(--text-primary)' }}>
                  {t('pushNotifications')}
                </span>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {t('receiveInAppAlerts')}
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('units')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
                {t('measurementSystem')}
              </label>
              <select 
                name="units" 
                value={localPrefs.units} 
                onChange={handleChange} 
                className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-offset-2"
                style={{ 
                  background: 'var(--input-bg)', 
                  color: 'var(--text-primary)', 
                  borderColor: 'var(--border)'
                }}
              >
                <option value="metric">🇪🇺 {t('metricSystem')} ({t('kg')}, {t('cm')})</option>
                <option value="imperial">🇺🇸 {t('imperialSystem')} ({t('lbs')}, {t('inches')})</option>
              </select>
            </div>
          </div>
        </div>

        <div className="setting-group">
          <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('appearance')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
                {t('theme')}
              </label>
              <select 
                name="theme" 
                value={localPrefs.theme} 
                onChange={handleChange} 
                className="w-full p-3 rounded-lg border transition-all duration-200"
                style={{ 
                  background: 'var(--input-bg)', 
                  color: 'var(--text-primary)', 
                  borderColor: 'var(--border)'
                }}
              >
                <option value="dark">🌙 {t('darkMode')}</option>
                <option value="light">☀️ {t('lightMode')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t('language')}
              </label>
              <select 
                name="language" 
                value={localPrefs.language} 
                onChange={handleChange} 
                className="w-full p-3 rounded-lg border transition-all duration-200"
                style={{ 
                  background: 'var(--input-bg)', 
                  color: 'var(--text-primary)', 
                  borderColor: 'var(--border)'
                }}
              >
                <option value="en">🇺🇸 English</option>
                <option value="ur">🇵🇰 اردو (Urdu)</option>
                <option value="es">🇪🇸 Español (Spanish)</option>
                <option value="fr">🇫🇷 Français (French)</option>
                <option value="de">🇩🇪 Deutsch (German)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <button 
            type="submit" 
            disabled={saving || !hasChanges}
            className="flex-1 flex justify-center items-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{ 
              backgroundColor: hasChanges ? 'var(--accent)' : 'var(--border)',
              color: 'white'
            }}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('saving')}...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {hasChanges ? t('save') : t('noChanges')}
              </>
            )}
          </button>
          
          {hasChanges && (
            <button 
              type="button" 
              onClick={handleResetForm}
              className="flex-1 py-3 px-6 rounded-lg font-semibold border transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border)'
              }}
            >
              {t('cancel')}
            </button>
          )}
        </div>
      </form>

      <div className="p-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <h4 className="text-lg font-semibold mb-4 text-red-500 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {t('dangerZone')}
        </h4>
        
        <div className="p-4 rounded-lg border-2 border-red-500/30 bg-red-500/10">
          <p className="text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('deleteProfileWarning')}
          </p>
          <button 
            onClick={handleDeleteProfile}
            className="flex items-center gap-2 py-2 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 hover:bg-red-600"
            style={{ 
              backgroundColor: '#ef4444',
              color: 'white'
            }}
          >
            <Trash2 className="w-4 h-4" />
            {t('deleteMyProfile')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingSection;