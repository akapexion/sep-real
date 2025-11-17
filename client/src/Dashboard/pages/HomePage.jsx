// src/Dashboard/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Activity, Target, Calendar, BarChart3 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from '../pages/UseLanguage';

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
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [workoutsRes, goalsRes, nutritionRes, progressRes, notificationsRes] = await Promise.all([
        axios.get(`${API_BASE}/workouts?userId=${userId}`),
        axios.get(`${API_BASE}/goals?userId=${userId}`),
        axios.get(`${API_BASE}/nutrition?userId=${userId}`),
        axios.get(`${API_BASE}/progress?userId=${userId}`),
        axios.get(`${API_BASE}/notifications?userId=${userId}&limit=5`)
      ]);

      const workouts = workoutsRes.data;
      const goals = goalsRes.data;
      const nutritionLogs = nutritionRes.data;
      const progressEntries = progressRes.data;
      
      const completedGoals = goals.filter(goal => {
        const progress = calculateGoalProgress(goal);
        return progress >= 100;
      }).length;

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

      setStats({
        totalWorkouts: workouts.length,
        completedGoals,
        streak: uniqueDays,
        caloriesBurned: Math.round(caloriesBurned),
        nutritionLogs: nutritionLogs.length,
        progressEntries: progressEntries.length
      });

      setRecentActivity(notificationsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error(t('failedToLoadDashboard'));
    } finally {
      setLoading(false);
    }
  };

  const calculateGoalProgress = (goal) => {
    if (goal.current === 0 && goal.target === 0) return 0;
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

  const getStreakMessage = () => {
    if (stats.streak > 0) {
      return t('streakMessage', { days: stats.streak });
    }
    return t('readyForWorkout');
  };

  const getMotivationMessage = () => {
    if (stats.totalWorkouts === 0) {
      return t('firstWorkoutMotivation');
    } else if (stats.totalWorkouts < 5) {
      return t('beginnerMotivation');
    } else {
      return t('experiencedMotivation');
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl shadow-lg border"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
            {label}
          </p>
          {subtitle && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-primary)' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent)' }}></div>
        <span className="ml-2" style={{ color: 'var(--text-primary)' }}>
          {t('loading')}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl shadow-lg"
        style={{ 
          backgroundColor: 'var(--accent)',
        }}
      >
        <h1 className="text-2xl font-bold mb-2 text-white">
          {t('welcomeBack')}, {user?.name || t('fitnessEnthusiast')}! 👋
        </h1>
        <p className="text-white opacity-90">
          {getStreakMessage()}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Activity}
          label={t('totalWorkouts')}
          value={stats.totalWorkouts}
          color="#3B82F6"
          subtitle={t('allTime')}
        />
        <StatCard
          icon={Target}
          label={t('goalsAchieved')}
          value={stats.completedGoals}
          color="#10B981"
          subtitle={t('greatWork')}
        />
        <StatCard
          icon={TrendingUp}
          label={t('currentStreak')}
          value={`${stats.streak} ${t('days')}`}
          color="#F59E0B"
          subtitle={t('keepItUp')}
        />
        <StatCard
          icon={Award}
          label={t('caloriesBurned')}
          value={stats.caloriesBurned.toLocaleString()}
          color="#EF4444"
          subtitle={t('estimatedTotal')}
        />
        <StatCard
          icon={BarChart3}
          label={t('nutritionLogs')}
          value={stats.nutritionLogs}
          color="#8B5CF6"
          subtitle={t('mealsTracked')}
        />
        <StatCard
          icon={Calendar}
          label={t('progressEntries')}
          value={stats.progressEntries}
          color="#06B6D4"
          subtitle={t('measurementsRecorded')}
        />
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl shadow-lg"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)'
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('recentActivity')}
        </h2>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                {t('noRecentActivity')}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {t('startLoggingPrompt')}
              </p>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div
                key={activity._id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-opacity-50 transition-colors"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'goal' ? 'bg-green-500' :
                  activity.type === 'reminder' ? 'bg-blue-500' :
                  activity.type === 'activity' ? 'bg-purple-500' : 'bg-gray-500'
                }`}></div>
                <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
                  {activity.message}
                </p>
                <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl shadow-lg"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)'
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('quickActions')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('logWorkout'), path: '/dashboard/workouts', emoji: '💪', description: t('addNewExercise') },
            { label: t('addNutrition'), path: '/dashboard/nutrition', emoji: '🍎', description: t('trackMeals') },
            { label: t('trackProgress'), path: '/dashboard/progress', emoji: '📊', description: t('recordMeasurements') },
            { label: t('setGoals'), path: '/dashboard/goals', emoji: '🎯', description: t('createTargets') }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => window.location.href = action.path}
              className="p-4 rounded-lg text-center transition-all hover:scale-105 hover:shadow-md"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
            >
              <span className="text-2xl mb-2 block">{action.emoji}</span>
              <span className="text-sm font-medium block">{action.label}</span>
              <span className="text-xs opacity-75 mt-1 block" style={{ color: 'var(--text-primary)' }}>
                {action.description}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Motivation Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl shadow-lg text-center"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)'
        }}
      >
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('fitnessMotivation')} 💫
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
          {getMotivationMessage()}
        </p>
      </motion.div>
    </div>
  );
};

export default HomePage;