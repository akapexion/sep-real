import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './Dashboard/components/DashboardLayout';
import { PreferencesProvider } from './Dashboard/pages/PreferencesContext';
import HomePage from './Dashboard/pages/HomePage';
import WorkoutsPage from './Dashboard/pages/WorkoutsPage';
import NutritionPage from './Dashboard/pages/NutritionPage';
import ProgressPage from './Dashboard/pages/ProgressPage';
import GoalsPage from './Dashboard/pages/GoalsPage';
import SchedulePage from './Dashboard/pages/SchedulePage';
import AnalyticsPage from './Dashboard/pages/AnalyticsPage';
import SettingsPage from './Dashboard/pages/SettingsPage';
import ProfilePage from './Dashboard/pages/ProfilePage';
import Notification from './Dashboard/pages/Notification';
import RemindersPage from './Dashboard/pages/RemindersPage';
import Home from './pages/Home';
import AppLayout from './AppLayout';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import JoinPage from './pages/JoinPage';
import FeedbackForm from './Dashboard/components/FeedbackForm';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const ProtectedDashboard = ({ children }) => {
    return user ? (
      <DashboardLayout user={user} logout={handleLogout} updateUser={updateUser}>
        {children}
      </DashboardLayout>
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <PreferencesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<Home />} />
           <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/join" element={<JoinPage />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login Loginuser={loginUser} />} />

          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />

          <Route
            element={<ProtectedDashboard />}
          >
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/dashboard/workouts" element={<WorkoutsPage />} />
            <Route path="/dashboard/nutrition" element={<NutritionPage />} />
            <Route path="/dashboard/progress" element={<ProgressPage />} />
            <Route path="/dashboard/goals" element={<GoalsPage />} />
            <Route path="/dashboard/schedule" element={<SchedulePage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/notifications" element={<Notification />} />
            <Route path="/dashboard/reminders" element={<RemindersPage />} />
                  <Route path="/dashboard/feedbacks" element={<FeedbackForm />} />
            
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PreferencesProvider>
  );
};

export default App;