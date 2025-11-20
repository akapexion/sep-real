// // src/Dashboard/components/AnalyticsSection.jsx
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import toast from "react-hot-toast";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { Dumbbell, Apple, TrendingUp, Loader2 } from "lucide-react";
// import { useLanguage } from '../../hooks/useLanguage';

// const API_BASE = "http://localhost:3000";

// export default function AnalyticsSection() {
//   const [workouts, setWorkouts] = useState([]);
//   const [nutrition, setNutrition] = useState([]);
//   const [progress, setProgress] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const userId = user?._id;
//   const { t } = useLanguage();

//   const fetchData = useCallback(async () => {
//     if (!userId) return setLoading(false);
//     try {
//       const [w, n, p] = await Promise.all([
//         axios.get(`${API_BASE}/workouts?userId=${userId}`),
//         axios.get(`${API_BASE}/nutrition?userId=${userId}`),
//         axios.get(`${API_BASE}/progress?userId=${userId}`),
//       ]);
//       setWorkouts(w.data);
//       setNutrition(n.data);
//       setProgress(p.data);
//     } catch (err) {
//       toast.error(t("failedToLoadAnalytics"));
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, t]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const groupByDate = (arr, key, valueKey) => {
//     const map = {};
//     arr.forEach((i) => {
//       const d = new Date(i[key]).toISOString().split("T")[0];
//       map[d] = (map[d] || 0) + (i[valueKey] ?? 0);
//     });
//     return Object.entries(map)
//       .map(([date, value]) => ({ date, value }))
//       .sort((a, b) => a.date.localeCompare(b.date));
//   };

//   const weightLiftData = useMemo(() => {
//     const filtered = workouts.filter((w) => w.weights && w.date);
//     return groupByDate(filtered, "date", "weights");
//   }, [workouts]);

//   const workoutFreq = useMemo(() => {
//     const count = {};
//     workouts.forEach((w) => {
//       const d = new Date(w.date).toISOString().split("T")[0];
//       count[d] = (count[d] || 0) + 1;
//     });
//     return Object.entries(count)
//       .map(([date, count]) => ({ date, count }))
//       .sort((a, b) => a.date.localeCompare(b.date))
//       .slice(-14);
//   }, [workouts]);

//   const calorieData = useMemo(() => {
//     const filtered = nutrition.filter((n) => n.totalCalories && n.date);
//     return groupByDate(filtered, "date", "totalCalories").slice(-14);
//   }, [nutrition]);

//   const bodyWeightData = useMemo(() => {
//     return progress
//       .filter((p) => p.weight && p.date)
//       .map((p) => ({
//         date: new Date(p.date).toISOString().split("T")[0],
//         weight: p.weight,
//       }))
//       .sort((a, b) => a.date.localeCompare(b.date));
//   }, [progress]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--accent)" }} />
//       </div>
//     );
//   }

//   const CustomTooltip = ({ active, payload, label }) =>
//     active && payload?.length ? (
//       <div
//         className="p-3 rounded-lg shadow-lg border"
//         style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
//       >
//         <p className="font-medium">{`${t("date")}: ${label}`}</p>
//         {payload.map((p, i) => (
//           <p key={i} style={{ color: p.color }}>{`${p.name}: ${p.value}`}</p>
//         ))}
//       </div>
//     ) : null;

//   return (
//     <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
//       {/* Weight Lift */}
//       <ChartCard title={t("weightLiftedOverTime")} icon={Dumbbell}>
//         {weightLiftData.length ? (
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={weightLiftData}>
//               <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
//               <XAxis dataKey="date" padding={{ right: 20 }} stroke="var(--text-muted)" />
//               <YAxis stroke="var(--text-muted)" />
//               <Tooltip content={<CustomTooltip />} />
//               <Line dataKey="value" name={t("weightLifted")} stroke="var(--accent)" strokeWidth={3} dot={{ r: 5 }} connectNulls />
//             </LineChart>
//           </ResponsiveContainer>
//         ) : <Empty>{t("noWeightLiftingData")}</Empty>}
//       </ChartCard>

//       {/* Workout Frequency */}
//       <ChartCard title={t("workoutFrequency")} icon={TrendingUp}>
//         {workoutFreq.length ? (
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={workoutFreq}>
//               <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
//               <XAxis dataKey="date" padding={{ right: 20 }} stroke="var(--text-muted)" />
//               <YAxis stroke="var(--text-muted)" allowDecimals={false} />
//               <Tooltip content={<CustomTooltip />} />
//               <Bar dataKey="count" name={t("workouts")} fill="var(--accent)" radius={[6,6,0,0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         ) : <Empty>{t("noWorkoutsRecent")}</Empty>}
//       </ChartCard>

//       {/* Calorie Intake */}
//       <ChartCard title={t("dailyCalorieIntake")} icon={Apple}>
//         {calorieData.length ? (
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={calorieData}>
//               <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
//               <XAxis dataKey="date" padding={{ right: 20 }} stroke="var(--text-muted)" />
//               <YAxis stroke="var(--text-muted)" />
//               <Tooltip content={<CustomTooltip />} />
//               <Line dataKey="value" name={t("calories")} stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} connectNulls />
//             </LineChart>
//           </ResponsiveContainer>
//         ) : <Empty>{t("noNutritionLogs")}</Empty>}
//       </ChartCard>

//       {/* Body Weight */}
//       <ChartCard title={t("bodyWeightProgress")} icon={TrendingUp}>
//         {bodyWeightData.length ? (
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={bodyWeightData}>
//               <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
//               <XAxis dataKey="date" padding={{ right: 20 }} stroke="var(--text-muted)" />
//               <YAxis stroke="var(--text-muted)" />
//               <Tooltip content={<CustomTooltip />} />
//               <Line dataKey="weight" name={t("weight")} stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} connectNulls />
//             </LineChart>
//           </ResponsiveContainer>
//         ) : <Empty>{t("noWeightEntries")}</Empty>}
//       </ChartCard>
//     </motion.div>
//   );
// }

// const ChartCard = ({ title, icon: Icon, children }) => (
//   <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="p-5 rounded-xl shadow-lg"
//     style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
//     <h3 className="flex items-center gap-2 text-lg font-semibold mb-3" style={{ color: "var(--accent)" }}>
//       <Icon className="w-5 h-5" /> {title}
//     </h3>
//     {children}
//   </motion.div>
// );

// const Empty = ({ children }) => (
//   <p className="text-center py-12" style={{ color: "var(--text-muted)" }}>{children}</p>
// );
