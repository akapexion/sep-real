// src/hooks/useLanguage.js
import { useState, useEffect } from 'react';
import { t } from '../../i18n';

export const useLanguage = () => {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.language);
    };

    // Set initial language from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const initialLang = user?.preferences?.language || 'en';
    setCurrentLang(initialLang);

    // Listen for language changes
    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const translate = (key, params = {}) => {
    let translated = t(key, currentLang);
    
    // Replace dynamic parameters like {days} with actual values
    Object.keys(params).forEach(param => {
      translated = translated.replace(`{${param}}`, params[param]);
    });
    
    return translated;
  };

  return { t: translate, currentLang };
};