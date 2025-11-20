// src/Dashboard/components/AnalyticsSection.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Dumbbell, Apple, TrendingUp, Loader2, Utensils } from "lucide-react";
import { useLanguage } from '../pages/UseLanguage'; 

const API_BASE = "http://localhost:3000";

const groupByDate = (items, dateKey, valueKey) =>
  Object.entries(
    items.reduce((acc, item) => {
      const date = new Date(item[dateKey]).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + (item[valueKey] ?? 0);
      return acc;
    }, {})
  )
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

export default function AnalyticsSection() {
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const { t } = useLanguage(); 

  const fetchData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const [wRes, nRes, pRes] = await Promise.all([
        axios.get(`${API_BASE}/workouts?userId=${userId}`),
        axios.get(`${API_BASE}/nutrition?userId=${userId}`),
        axios.get(`${API_BASE}/progress?userId=${userId}`),
      ]);
      setWorkouts(wRes.data);
      setNutrition(nRes.data);
      setProgress(pRes.data);
    } catch (err) {
      toast.error(t('failedToLoadAnalytics')); 
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const weightLiftData = useMemo(() => {
    const filtered = workouts.filter((w) => w.weights && w.date);
    return groupByDate(filtered, "date", "weights");
  }, [workouts]);

  const workoutFreq = useMemo(() => {
    const freq = workouts.reduce((acc, w) => {
      const d = new Date(w.date).toISOString().split("T")[0];
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(freq)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);
  }, [workouts]);

  const calorieData = useMemo(() => {
    const filtered = nutrition.filter((n) => n.totalCalories && n.date);
    return groupByDate(filtered, "date", "totalCalories").slice(-14);
  }, [nutrition]);

  // Nutrition Logs Data - Group by meal type
  const nutritionLogsData = useMemo(() => {
    const mealCounts = nutrition.reduce((acc, log) => {
      const mealType = log.mealType || 'Other';
      acc[mealType] = (acc[mealType] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(mealCounts)
      .map(([mealType, count]) => ({ 
        mealType: t(mealType.toLowerCase()) || mealType, 
        count 
      }))
      .sort((a, b) => b.count - a.count);
  }, [nutrition, t]);

  // Daily Nutrition Logs Frequency
  const dailyNutritionLogsData = useMemo(() => {
    const freq = nutrition.reduce((acc, log) => {
      const date = new Date(log.date).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(freq)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);
  }, [nutrition]);

  const bodyWeightData = useMemo(() => {
    return progress
      .filter((p) => p.weight && p.date)
      .map((p) => ({
        date: new Date(p.date).toISOString().split("T")[0],
        weight: p.weight,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [progress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  const chartProps = { margin: { top: 5, right: 30, left: 20, bottom: 5 } };

  // Custom tooltip to handle translations
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 rounded-lg shadow-lg border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        >
          <p className="font-medium">{`${t('date')}: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 rounded-lg shadow-lg border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        >
          <p className="font-medium">{`${t('mealType')}: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${t('logs')}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Weight Lifted */}
      <ChartCard title={t('weightLiftedOverTime')} icon={Dumbbell}>
        {weightLiftData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weightLiftData} {...chartProps}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                name={t('weightLifted')}
                stroke="var(--accent)"
                strokeWidth={3}
                dot={{ fill: "var(--accent)", r: 5, strokeWidth: 2, stroke: "var(--bg-card)" }}
                activeDot={{ r: 7, stroke: "var(--accent)", strokeWidth: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Empty>{t('noWeightLiftingData')}</Empty>
        )}
      </ChartCard>

      {/* Workout Frequency */}
      <ChartCard title={t('workoutFrequency')} icon={TrendingUp}>
        {workoutFreq.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={workoutFreq} {...chartProps}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                name={t('workouts')}
                fill="var(--accent)" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Empty>{t('noWorkoutsRecent')}</Empty>
        )}
      </ChartCard>

      {/* Calorie Intake */}
      <ChartCard title={t('dailyCalorieIntake')} icon={Apple}>
        {calorieData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={calorieData} {...chartProps}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                name={t('calories')}
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: "#f59e0b", r: 5, strokeWidth: 2, stroke: "var(--bg-card)" }}
                activeDot={{ r: 7, stroke: "#f59e0b", strokeWidth: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Empty>{t('noNutritionLogs')}</Empty>
        )}
      </ChartCard>

      {/* Nutrition Logs by Meal Type */}
      <ChartCard title={t('nutritionLogsByMealType')} icon={Utensils}>
        {nutritionLogsData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={nutritionLogsData} {...chartProps}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
              <XAxis 
                dataKey="mealType" 
                stroke="var(--text-muted)" 
                tick={{ fontSize: 12 }} 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar 
                dataKey="count" 
                name={t('logs')}
                fill="#10b981" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Empty>{t('noNutritionLogs')}</Empty>
        )}
      </ChartCard>

      {/* Daily Nutrition Logs Frequency */}
      <ChartCard title={t('dailyNutritionLogs')} icon={Utensils}>
        {dailyNutritionLogsData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dailyNutritionLogsData} {...chartProps}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                name={t('nutritionLogs')}
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 5, strokeWidth: 2, stroke: "var(--bg-card)" }}
                activeDot={{ r: 7, stroke: "#8b5cf6", strokeWidth: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Empty>{t('noNutritionLogs')}</Empty>
        )}
      </ChartCard>

      {/* Body Weight */}
      <ChartCard title={t('bodyWeightProgress')} icon={TrendingUp}>
        {bodyWeightData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={bodyWeightData} {...chartProps}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="weight"
                name={t('weight')}
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 5, strokeWidth: 2, stroke: "var(--bg-card)" }}
                activeDot={{ r: 7, stroke: "#10b981", strokeWidth: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Empty>{t('noWeightEntries')}</Empty>
        )}
      </ChartCard>
    </motion.div>
  );
}

/* Reusable UI */
const ChartCard = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="p-5 rounded-xl shadow-lg"
    style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
  >
    <h3 className="flex items-center gap-2 text-lg font-semibold mb-3" style={{ color: "var(--accent)" }}>
      <Icon className="w-5 h-5" />
      {title}
    </h3>
    {children}
  </motion.div>
);

const Empty = ({ children }) => (
  <p className="text-center py-12" style={{ color: "var(--text-muted)" }}>
    {children}
  </p>
);