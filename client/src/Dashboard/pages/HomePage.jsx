// src/Dashboard/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Award, Activity, Target, Calendar, BarChart3,
  PlusCircle, Utensils, Ruler, CheckCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from '../pages/UseLanguage';
import AdminPage from './AdminPage';
import { Link } from 'react-router-dom';

const API_BASE = "http://localhost:3000";

const HomePage = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    completedGoals: 0,
    streak: 0,
    caloriesBurned: 0,
    nutritionLogs: 0,
    progressEntries: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  useEffect(() => {
    if (userId && user?.role !== 'admin') {
      const cached = sessionStorage.getItem(`dashboardData_${userId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setStats(parsed.stats);
          setRecentActivity(parsed.recentActivity);
          setLoading(false);
        } catch (e) {
          console.error("Cache parsing error", e);
        }
      }
      fetchDashboardData(!!cached);
    }
  }, [userId]);

  const fetchDashboardData = async (isCached = false) => {
    try {
      if (!isCached) setLoading(true);
      const [workoutsRes, goalsRes, nutritionRes, progressRes, notificationsRes] = await Promise.all([
        axios.get(`${API_BASE}/workouts?userId=${userId}`),
        axios.get(`${API_BASE}/goals?userId=${userId}`),
        axios.get(`${API_BASE}/nutrition?userId=${userId}`),
        axios.get(`${API_BASE}/progress?userId=${userId}`),
        axios.get(`${API_BASE}/notifications?userId=${userId}&limit=5`),
      ]);

      const workouts = workoutsRes.data;
      const goals = goalsRes.data;
      const nutritionLogs = nutritionRes.data;
      const progressEntries = progressRes.data;

      const completedGoals = goals.filter(goal => calculateGoalProgress(goal) >= 100).length;

      const last7Days = workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return workoutDate >= sevenDaysAgo;
      });

      const uniqueDays = new Set(last7Days.map(w => new Date(w.date).toDateString())).size;

      const caloriesBurned = workouts.reduce((sum, workout) => {
        const baseCalories = workout.sets * workout.reps * (workout.weights || 1) * 0.05;
        return sum + baseCalories;
      }, 0);

      const newStats = {
        totalWorkouts: workouts.length,
        completedGoals,
        streak: uniqueDays,
        caloriesBurned: Math.round(caloriesBurned),
        nutritionLogs: nutritionLogs.length,
        progressEntries: progressEntries.length
      };

      setStats(newStats);

      const recentNotifs = notificationsRes.data.slice(0, 5);
      setRecentActivity(recentNotifs);

      sessionStorage.setItem(`dashboardData_${userId}`, JSON.stringify({
        stats: newStats,
        recentActivity: recentNotifs,
      }));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error(t('failedToLoadDashboard'));
    } finally {
      setLoading(false);
    }
  };

  const calculateGoalProgress = (goal) => {
    if (goal.target === 0) return 0;
    const isLossGoal = goal.goalType.toLowerCase().includes('loss');

    if (isLossGoal) {
      const startWeight = Math.max(goal.current, goal.target);
      const totalToLose = startWeight - goal.target;
      const alreadyLost = startWeight - goal.current;
      if (totalToLose <= 0) return 100;
      return Math.min((alreadyLost / totalToLose) * 100, 100);
    } else {
      const startValue = Math.min(goal.current, goal.target);
      const totalToGain = goal.target - startValue;
      const alreadyGained = goal.current - startValue;
      if (totalToGain <= 0) return 100;
      return Math.min((alreadyGained / totalToGain) * 100, 100);
    }
  };

  const getStreakMessage = () => (stats.streak > 0 ? t('streakMessage', { days: stats.streak }) : t('readyForWorkout'));
  const getMotivationMessage = () => (
    stats.totalWorkouts === 0 ? t('firstWorkoutMotivation')
      : stats.totalWorkouts < 5 ? t('beginnerMotivation') : t('experiencedMotivation')
  );

  const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
          {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--text-primary)' }}>{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );

  if (user?.role === 'admin') {
    return <AdminPage />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent)' }}></div>
        <span className="ml-2" style={{ color: 'var(--text-primary)' }}>{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 card relative overflow-hidden"
        style={{ borderLeft: '4px solid var(--accent)' }}>
        <h1 className="text-2xl font-bold mb-2 z-10 relative">
          {t('Welcome')}, {user?.name || t('fitnessEnthusiast')}
        </h1>
        <p className="opacity-90 z-10 relative">{getStreakMessage()}</p>
        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-transparent to-[var(--accent)] opacity-20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={Activity} label={t('totalWorkouts')} value={stats.totalWorkouts} color="#3B82F6" subtitle={t('allTime')} />
        <StatCard icon={Target} label={t('goalsAchieved')} value={stats.completedGoals} color="#10B981" subtitle={t('greatWork')} />
        <StatCard icon={TrendingUp} label={t('currentStreak')} value={`${stats.streak} ${t('days')}`} color="#F59E0B" subtitle={t('keepItUp')} />
        <StatCard icon={Award} label={t('caloriesBurned')} value={stats.caloriesBurned.toLocaleString()} color="#EF4444" subtitle={t('estimatedTotal')} />
        <StatCard icon={BarChart3} label={t('nutritionLogs')} value={stats.nutritionLogs} color="#8B5CF6" subtitle={t('mealsTracked')} />
        <StatCard icon={Calendar} label={t('progressEntries')} value={stats.progressEntries} color="#06B6D4" subtitle={t('measurementsRecorded')} />
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 card">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('quickActions')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('logWorkout'), path: '/dashboard/workouts', icon: PlusCircle, description: t('addNewExercise') },
            { label: t('addNutrition'), path: '/dashboard/nutrition', icon: Utensils, description: t('trackMeals') },
            { label: t('trackProgress'), path: '/dashboard/progress', icon: Ruler, description: t('recordMeasurements') },
            { label: t('setGoals'), path: '/dashboard/goals', icon: CheckCircle, description: t('createTargets') }
          ].map((action, index) => (
            <Link to={action.path} key={index}
              className="p-4 rounded-xl text-center glass transition-all hover:scale-105 hover:-translate-y-1">
              <action.icon className="mx-auto w-7 h-7 mb-2" />
              <span className="text-sm font-medium block">{action.label}</span>
              <span className="text-xs opacity-75 mt-1 block" style={{ color: 'var(--text-primary)' }}>
                {action.description}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Motivation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 card text-center">
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('fitnessMotivation')}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{getMotivationMessage()}</p>
      </motion.div>

    </div>
  );
};

export default HomePage;