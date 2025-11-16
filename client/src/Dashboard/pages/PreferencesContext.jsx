// src/context/PreferencesContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PreferencesContext = createContext();

export const usePreferencesContext = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferencesContext must be used within a PreferencesProvider');
  }
  return context;
};

const normalizePreferences = (prefs) => {
  if (!prefs) return null;
  
  const normalized = { ...prefs };
  
  if (normalized.notifications) {
    if (normalized.notifications.email !== undefined) {
      delete normalized.notifications.email;
    }
    if (normalized.notifications.sms !== undefined) {
      delete normalized.notifications.sms;
    }
    
    // Ensure push exists and is boolean
    if (normalized.notifications.push === undefined) {
      normalized.notifications.push = true;
    }
  }
  
  return normalized;
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user._id) {
          const response = await axios.get(`http://localhost:3000/preferences?userId=${user._id}`);
          const normalizedPrefs = normalizePreferences(response.data);
          setPreferences(normalizedPrefs);
          applyTheme(normalizedPrefs.theme);
          localStorage.setItem('userPreferences', JSON.stringify(normalizedPrefs));
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
        const stored = localStorage.getItem('userPreferences');
        if (stored) {
          const normalizedStored = normalizePreferences(JSON.parse(stored));
          setPreferences(normalizedStored);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = async (newPreferences) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const cleanPreferences = normalizePreferences(newPreferences);
      
      const response = await axios.post('http://localhost:3000/preferences', {
        userId: user._id,
        ...cleanPreferences
      });
      
      const normalizedResponse = normalizePreferences(response.data);
      setPreferences(normalizedResponse);
      applyTheme(normalizedResponse.theme);
      localStorage.setItem('userPreferences', JSON.stringify(normalizedResponse));
      
      window.dispatchEvent(new CustomEvent('preferencesUpdated', {
        detail: normalizedResponse
      }));
      
      return normalizedResponse;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary', '#1a1a1a');
      root.style.setProperty('--bg-secondary', '#2d2d2d');
      root.style.setProperty('--bg-card', '#2d2d2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#a0a0a0');
      root.style.setProperty('--border', '#404040');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8f9fa');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#6c757d');
      root.style.setProperty('--border', '#dee2e6');
    }
  };

  const convertWeight = (value, toUnit = null) => {
    if (value === null || value === undefined || value === '') return value;
    
    const targetUnit = toUnit || preferences?.units || 'metric';
    const currentUnit = preferences?.units || 'metric';
    
    if (currentUnit === targetUnit) return parseFloat(value);

    if (currentUnit === 'metric' && targetUnit === 'imperial') {
      return parseFloat(value) * 2.20462;
    }
    if (currentUnit === 'imperial' && targetUnit === 'metric') {
      return parseFloat(value) / 2.20462;
    }
    
    return parseFloat(value);
  };

  const convertHeight = (value, toUnit = null) => {
    if (value === null || value === undefined || value === '') return value;
    
    const targetUnit = toUnit || preferences?.units || 'metric';
    const currentUnit = preferences?.units || 'metric';
    
    if (currentUnit === targetUnit) return parseFloat(value);

    if (currentUnit === 'metric' && targetUnit === 'imperial') {
      return parseFloat(value) / 2.54;
    }
    if (currentUnit === 'imperial' && targetUnit === 'metric') {
      return parseFloat(value) * 2.54;
    }
    
    return parseFloat(value);
  };

  const getWeightUnit = () => {
    return preferences?.units === 'imperial' ? 'lbs' : 'kg';
  };

  const getHeightUnit = () => {
    return preferences?.units === 'imperial' ? 'in' : 'cm';
  };

  const formatWeight = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const converted = convertWeight(value);
    return `${converted.toFixed(1)} ${getWeightUnit()}`;
  };

  const formatHeight = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const converted = convertHeight(value);
    return `${converted.toFixed(1)} ${getHeightUnit()}`;
  };

  const value = {
    preferences,
    loading,
    updatePreferences,
    convertWeight,
    convertHeight,
    getWeightUnit,
    getHeightUnit,
    formatWeight,
    formatHeight
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};