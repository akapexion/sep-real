// src/hooks/usePreferences.js
import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export const usePreferences = (userId) => {
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API}/preferences?userId=${userId}`).then(res => {
      setPrefs(res.data);
      document.documentElement.setAttribute("data-theme", res.data.theme);
    });
  }, [userId]);

  const update = async (newPrefs) => {
    await axios.post(`${API}/preferences`, { userId, ...newPrefs });
    setPrefs(newPrefs);
    document.documentElement.setAttribute("data-theme", newPrefs.theme);
  };

  const convert = (value, type) => {
    if (!prefs || prefs.units === "metric") return value;
    if (type === "weight") return (value * 2.20462).toFixed(1); // kg → lbs
    if (type === "length") return (value * 0.393701).toFixed(1); // cm → in
    return value;
  };

  return { prefs, update, convert };
};