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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Dumbbell33, Apple, TrendingUp, Loader2 } from "lucide-react";

const API_BASE = "http://localhost:3000";
const COLORS = ["#10b981", "#3b82f6", "#f59e0b"]; // green, blue, amber

// Helper: group array by date string (YYYY‑MM‑DD)
const groupByDate = (arr, dateKey, valueKey) => {
  const map = {};
  arr.forEach((item) => {
    const d = new Date(item[dateKey]).toISOString().split("T")[0];
    map[d] = (map[d] || 0) + (item[valueKey] ?? 0);
  });
  return Object.entries(map)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export default function AnalyticsSection() {
  const [rawWorkouts, setRawWorkouts] = useState([]);
  const [rawNutrition, setRawNutrition] = useState([]);
  const [rawProgress, setRawProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const fetchAll = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const [w, n, p] = await Promise.all([
        axios.get(`${API_BASE}/workouts?userId=${userId}`),
        axios.get(`${API_BASE}/nutrition?userId=${userId}`),
        axios.get(`${API_BASE}/progress?userId=${userId}`),
      ]);
      setRawWorkouts(w.data);
      setRawNutrition(n.data);
      setRawProgress(p.data);
    } catch (e) {
      toast.error("Failed to load analytics");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* -------------------------------------------------
     1. WEIGHT LIFTED (line) – sum of weights per day
     ------------------------------------------------- */
  const weightLiftData = useMemo(() => {
    const filtered = rawWorkouts.filter((w) => w.weights && w.date);
    return groupByDate(filtered, "date", "weights");
  }, [rawWorkouts]);

  /* -------------------------------------------------
     2. WORKOUT FREQUENCY (bar) – count per day (last 14 days)
     ------------------------------------------------- */
  const workoutFreq = useMemo(() => {
    const freq = rawWorkouts.reduce((acc, w) => {
      const d = new Date(w.date).toISOString().split("T")[0];
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(freq)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);
  }, [rawWorkouts]);

  /* -------------------------------------------------
     3. CALORIE INTAKE (line) – last 14 days
     ------------------------------------------------- */
  const calorieData = useMemo(() => {
    const filtered = rawNutrition.filter((n) => n.totalCalories && n.date);
    return groupByDate(filtered, "date", "totalCalories").slice(-14);
  }, [rawNutrition]);

  /* -------------------------------------------------
     4. MACRO PIE – total grams (protein / carbs / fat)
     ------------------------------------------------- */
  const macroTotals = useMemo(() => {
    const totals = rawNutrition.reduce(
      (acc, n) => {
        acc.protein += n.totalProteins || 0;
        acc.carbs += n.totalCarbs || 0;
        acc.fat += n.totalFats || 0;
        return acc;
      },
      { protein: 0, carbs: 0, fat: 0 }
    );
    return [
      { name: "Protein", value: Math.round(totals.protein) },
      { name: "Carbs", value: Math.round(totals.carbs) },
      { name: "Fat", value: Math.round(totals.fat) },
    ].filter((m) => m.value > 0);
  }, [rawNutrition]);

  /* -------------------------------------------------
     5. BODY‑WEIGHT TREND (line)
     ------------------------------------------------- */
  const bodyWeightData = useMemo(() => {
    return rawProgress
      .filter((p) => p.weight && p.date)
      .map((p) => ({
        date: new Date(p.date).toISOString().split("T")[0],
        weight: p.weight,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [rawProgress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  const chartCommonProps = {
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* ---------- 1. Weight Lifted ---------- */}
      <ChartCard title="Weight Lifted Over Time" icon={Dumbbell33}>
        {weightLiftData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weightLiftData} {...chartCommonProps}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--text-primary)" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--accent)"
                strokeWidth={3}
                dot={{ fill: "var(--accent)", r: 5 }}
                activeDot={{ r: 7 }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState>No weight‑lifting data yet</EmptyState>
        )}
      </ChartCard>

      {/* ---------- 2. Workout Frequency ---------- */}
      <ChartCard title="Workout Frequency (last 14 days)" icon={TrendingUp}>
        {workoutFreq.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={workoutFreq} {...chartCommonProps}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState>No workouts in the last 14 days</EmptyState>
        )}
      </ChartCard>

      {/* ---------- 3. Calorie Intake ---------- */}
      <ChartCard title="Daily Calorie Intake (last 14 days)" icon={Apple}>
        {calorieData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={calorieData} {...chartCommonProps}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: "#f59e0b", r: 5 }}
                activeDot={{ r: 7 }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState>No nutrition logs yet</EmptyState>
        )}
      </ChartCard>

      {/* ---------- 4. Macro Split ---------- */}
      <ChartCard title="Macronutrient Distribution" icon={Apple}>
        {macroTotals.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={macroTotals}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}g`}
                plugins={[ChartDataLabels]}
                datalabels={{
                  color: "#fff",
                  font: { weight: "bold" },
                  formatter: (value, ctx) => {
                    const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percent = ((value / total) * 100).toFixed(0);
                    return `${percent}%`;
                  },
                }}
              >
                {macroTotals.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState>No macro data yet</EmptyState>
        )}
      </ChartCard>

      {/* ---------- 5. Body Weight Trend ---------- */}
      <ChartCard title="Body‑Weight Progress" icon={TrendingUp}>
        {bodyWeightData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={bodyWeightData} {...chartCommonProps}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 5 }}
                activeDot={{ r: 7 }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState>No weight entries yet</EmptyState>
        )}
      </ChartCard>
    </motion.div>
  );
}

/* -------------------------------------------------
   Small reusable UI components
   ------------------------------------------------- */
const ChartCard = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="p-5 rounded-xl shadow-lg"
    style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--border)",
    }}
  >
    <h3
      className="flex items-center gap-2 text-lg font-semibold mb-3"
      style={{ color: "var(--accent)" }}
    >
      <Icon className="w-5 h-5" />
      {title}
    </h3>
    {children}
  </motion.div>
);

const EmptyState = ({ children }) => (
  <p className="text-center py-12" style={{ color: "var(--text-muted)" }}>
    {children}
  </p>
);