// src/Dashboard/components/SettingSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Loader2, Save, Trash2, Bell, Globe, Smartphone,
  Shield, AlertTriangle, RotateCcw,
} from 'lucide-react';
import { usePreferencesContext } from '../pages/PreferencesContext';
import { useLanguage } from '../pages/UseLanguage';

// ── Glassmorphism shared styles (mirrors RemindersSection) ───────────────────
const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.10)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
};

const glassInput = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'var(--text-primary)',
  borderRadius: '10px',
  transition: 'all 0.2s ease',
};

const inputFocusStyle = `
  .glass-input:focus {
    outline: none;
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    background: rgba(255,255,255,0.08) !important;
  }
  .glass-input option { background: var(--bg-card); color: var(--text-primary); }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }

  .setting-toggle:checked + .toggle-track {
    background: var(--accent) !important;
    border-color: color-mix(in srgb, var(--accent) 50%, transparent) !important;
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

// Reusable section wrapper
const SettingGroup = ({ icon: Icon, title, subtitle, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="rounded-xl p-5"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}
  >
    {/* Group header */}
    <div className="flex items-center gap-3 mb-5">
      <div style={{
        padding: '8px', borderRadius: '10px',
        background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
        border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
      }}>
        <Icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        )}
      </div>
    </div>
    {children}
  </motion.div>
);

// Toggle checkbox component
const GlassToggle = ({ name, checked, onChange, label, description }) => (
  <label className="flex items-center gap-4 cursor-pointer group">
    {/* Custom toggle */}
    <div className="relative flex-shrink-0">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked } })}
        className="w-11 h-6 rounded-full transition-all duration-300 flex items-center cursor-pointer"
        style={{
          background: checked
            ? 'var(--accent)'
            : 'rgba(255,255,255,0.10)',
          border: checked
            ? '1px solid color-mix(in srgb, var(--accent) 50%, transparent)'
            : '1px solid rgba(255,255,255,0.15)',
          boxShadow: checked
            ? '0 0 12px color-mix(in srgb, var(--accent) 35%, transparent)'
            : 'none',
          padding: '2px',
        }}
      >
        <div
          className="w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(0px)' }}
        />
      </div>
    </div>
    <div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {description && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>
      )}
    </div>
  </label>
);

// ─────────────────────────────────────────────────────────────────────────────

const SettingSection = () => {
  const { preferences, updatePreferences, loading } = usePreferencesContext();
  const { t }   = useLanguage();
  const navigate = useNavigate();

  const [saving, setSaving]         = useState(false);
  const [localPrefs, setLocalPrefs] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (preferences) setLocalPrefs(JSON.parse(JSON.stringify(preferences)));
  }, [preferences]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [parent, child] = name.split('.');
    setLocalPrefs(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (child) {
        if (!next[parent]) next[parent] = {};
        next[parent][child] = type === 'checkbox' ? checked : value;
      } else {
        next[name] = type === 'checkbox' ? checked : value;
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localPrefs) return;
    setSaving(true);
    try {
      await updatePreferences(localPrefs);
      toast.success(t('savedSuccessfully'));
    } catch (err) {
      toast.error(t('saveFailed'));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm(`${t('areYouSure')}\n\n${t('thisActionCannotBeUndone')}`)) return;
    try {
      await axios.delete(`http://localhost:3000/profile?userId=${user._id}`);
      localStorage.clear();
      toast.success(t('deleteSuccessfully'));
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      toast.error(t('deleteFailed'));
      console.error(err);
    }
  };

  const handleResetForm = () => {
    setLocalPrefs(JSON.parse(JSON.stringify(preferences)));
    toast.success(t('changesDiscarded'));
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading || !localPrefs) return (
    <div className="flex justify-center items-center py-20">
      <div style={{ position: 'relative' }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--accent)' }} />
        <div style={{
          position: 'absolute', inset: '-6px', borderRadius: '50%',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)',
          animation: 'glow-pulse 2s ease-in-out infinite',
        }} />
      </div>
    </div>
  );

  const hasChanges = JSON.stringify(localPrefs) !== JSON.stringify(preferences);

  return (
    <>
      <style>{inputFocusStyle}</style>
      <Toaster toastOptions={{
        style: { ...glassCard, color: 'var(--text-primary)', fontSize: '0.875rem' },
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 rounded-2xl overflow-hidden"
        style={{ ...glassCard, padding: '1.75rem' }}
      >

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div style={{
              padding: '10px', borderRadius: '12px',
              background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
              border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
              boxShadow: '0 0 16px color-mix(in srgb, var(--accent) 20%, transparent)',
              animation: 'glow-pulse 3s ease-in-out infinite',
            }}>
              <Shield className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {t('preferences')}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {t('manageYourAppSettings')}
              </p>
            </div>
          </div>

          {/* Unsaved changes badge */}
          <AnimatePresence>
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(251,191,36,0.10)',
                  border: '1px solid rgba(251,191,36,0.25)',
                }}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#fbbf24', display: 'inline-block',
                  boxShadow: '0 0 8px #fbbf24',
                }} />
                <span className="text-xs font-medium" style={{ color: '#fbbf24' }}>
                  Unsaved
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Settings form ── */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Notifications */}
          <SettingGroup
            icon={Bell}
            title={t('notifications')}
            subtitle={t('receiveInAppAlerts') || 'Control how you receive alerts'}
            delay={0.10}
          >
            <GlassToggle
              name="notifications.push"
              checked={localPrefs.notifications?.push ?? false}
              onChange={handleChange}
              label={t('pushNotifications')}
              description={t('receiveInAppAlerts')}
            />
          </SettingGroup>

          {/* Units */}
          <SettingGroup
            icon={Smartphone}
            title={t('units')}
            subtitle={t('measurementSystem') || 'Choose your measurement preference'}
            delay={0.15}
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                {t('measurementSystem')}
              </label>
              <select
                name="units"
                value={localPrefs.units}
                onChange={handleChange}
                className="glass-input w-full px-3 py-2.5 text-sm"
                style={glassInput}
              >
                <option value="metric">🇪🇺 {t('metricSystem')} ({t('kg')}, {t('cm')})</option>
                <option value="imperial">🇺🇸 {t('imperialSystem')} ({t('lbs')}, {t('inches')})</option>
              </select>
            </div>
          </SettingGroup>

          {/* Appearance */}
          <SettingGroup
            icon={Globe}
            title={t('appearance')}
            subtitle="Theme and language preferences"
            delay={0.20}
          >
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  {t('theme')}
                </label>
                <select
                  name="theme"
                  value={localPrefs.theme}
                  onChange={handleChange}
                  className="glass-input w-full px-3 py-2.5 text-sm"
                  style={glassInput}
                >
                  <option value="dark">🌙 {t('darkMode')}</option>
                  <option value="light">☀️ {t('lightMode')}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  {t('language')}
                </label>
                <select
                  name="language"
                  value={localPrefs.language}
                  onChange={handleChange}
                  className="glass-input w-full px-3 py-2.5 text-sm"
                  style={glassInput}
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="ur">🇵🇰 اردو (Urdu)</option>
                  <option value="es">🇪🇸 Español (Spanish)</option>
                  <option value="fr">🇫🇷 Français (French)</option>
                  <option value="de">🇩🇪 Deutsch (German)</option>
                </select>
              </div>
            </div>
          </SettingGroup>

          {/* ── Action buttons ── */}
          <div className="flex gap-2 pt-2">
            <motion.button
              type="submit"
              disabled={saving || !hasChanges}
              whileHover={hasChanges ? { scale: 1.02 } : {}}
              whileTap={hasChanges ? { scale: 0.98 } : {}}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={hasChanges ? {
                background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))',
                boxShadow: '0 4px 16px color-mix(in srgb, var(--accent) 35%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent) 50%, transparent)',
              } : {
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'var(--text-muted)',
                cursor: 'not-allowed',
                opacity: 0.5,
              }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? t('saving') + '…' : hasChanges ? t('save') : t('noChanges')}
            </motion.button>

            <AnimatePresence>
              {hasChanges && (
                <motion.button
                  type="button"
                  onClick={handleResetForm}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
                  style={{
                    ...glassInput,
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('cancel')}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </form>

        {/* ── Danger Zone ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 rounded-xl p-5"
          style={{
            background: 'rgba(239,68,68,0.04)',
            border: '1px solid rgba(239,68,68,0.18)',
          }}
        >
          {/* Danger header */}
          <div className="flex items-center gap-3 mb-4">
            <div style={{
              padding: '8px', borderRadius: '10px',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.25)',
            }}>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-400">{t('dangerZone')}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {t('deleteProfileWarning')}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDeleteProfile}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.35)',
              color: '#f87171',
            }}
          >
            <Trash2 className="w-4 h-4" />
            {t('deleteMyProfile')}
          </motion.button>
        </motion.div>

      </motion.div>
    </>
  );
};

export default SettingSection;