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
  if (!prefs) {
    // Return default preferences if none exist
    return {
      notifications: { push: true },
      units: 'metric',
      theme: 'dark',
      language: 'en',
      reminders: { workout: "07:00", meal: "12:00" }
    };
  }
  
  const normalized = { ...prefs };
  
  // Ensure notifications object exists and has proper structure
  if (!normalized.notifications) {
    normalized.notifications = { push: true };
  } else {
    // Clean up old notification types
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
  
  // Ensure other required fields have defaults
  if (!normalized.units) normalized.units = 'metric';
  if (!normalized.theme) normalized.theme = 'dark';
  if (!normalized.language) normalized.language = 'en';
  if (!normalized.reminders) {
    normalized.reminders = { workout: "07:00", meal: "12:00" };
  }
  
  return normalized;
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPreferences = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user._id) {
        const response = await axios.get(`http://localhost:3000/preferences?userId=${user._id}`);
        const normalizedPrefs = normalizePreferences(response.data);
        setPreferences(normalizedPrefs);
        localStorage.setItem('userPreferences', JSON.stringify(normalizedPrefs));
      } else {
        // No user logged in, set default preferences
        const defaultPrefs = normalizePreferences(null);
        setPreferences(defaultPrefs);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      // Fallback to stored preferences or defaults
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const normalizedStored = normalizePreferences(JSON.parse(stored));
        setPreferences(normalizedStored);
      } else {
        const defaultPrefs = normalizePreferences(null);
        setPreferences(defaultPrefs);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  const updatePreferences = async (newPreferences) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user._id) {
        throw new Error('No user logged in');
      }

      const cleanPreferences = normalizePreferences(newPreferences);
      
      const response = await axios.post('http://localhost:3000/preferences', {
        userId: user._id,
        ...cleanPreferences
      });
      
      const normalizedResponse = normalizePreferences(response.data);
      setPreferences(normalizedResponse);
      localStorage.setItem('userPreferences', JSON.stringify(normalizedResponse));
      
      // Update user object in localStorage with new preferences
      const updatedUser = { ...user, preferences: normalizedResponse };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Dispatch events for other components to listen to
      window.dispatchEvent(new CustomEvent('preferencesUpdated', {
        detail: normalizedResponse
      }));
      
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: normalizedResponse.language }
      }));
      
      return normalizedResponse;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  };

  const convertWeight = (value, toUnit = null) => {
    if (value === null || value === undefined || value === '') return value;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    const targetUnit = toUnit || preferences?.units || 'metric';
    const currentUnit = preferences?.units || 'metric';
    
    if (currentUnit === targetUnit) return numValue;

    // Convert between metric (kg) and imperial (lbs)
    if (currentUnit === 'metric' && targetUnit === 'imperial') {
      return numValue * 2.20462; // kg to lbs
    }
    if (currentUnit === 'imperial' && targetUnit === 'metric') {
      return numValue / 2.20462; // lbs to kg
    }
    
    return numValue;
  };

  const convertHeight = (value, toUnit = null) => {
    if (value === null || value === undefined || value === '') return value;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    const targetUnit = toUnit || preferences?.units || 'metric';
    const currentUnit = preferences?.units || 'metric';
    
    if (currentUnit === targetUnit) return numValue;

    // Convert between metric (cm) and imperial (inches)
    if (currentUnit === 'metric' && targetUnit === 'imperial') {
      return numValue / 2.54; // cm to inches
    }
    if (currentUnit === 'imperial' && targetUnit === 'metric') {
      return numValue * 2.54; // inches to cm
    }
    
    return numValue;
  };

  const getWeightUnit = () => {
    return preferences?.units === 'imperial' ? 'lbs' : 'kg';
  };

  const getHeightUnit = () => {
    return preferences?.units === 'imperial' ? 'in' : 'cm';
  };

  const formatWeight = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'N/A';
    
    const converted = convertWeight(value);
    return `${converted.toFixed(1)} ${getWeightUnit()}`;
  };

  const formatHeight = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'N/A';
    
    const converted = convertHeight(value);
    return `${converted.toFixed(1)} ${getHeightUnit()}`;
  };

  const refreshPreferences = () => {
    return loadPreferences();
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
    formatHeight,
    refreshPreferences
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};