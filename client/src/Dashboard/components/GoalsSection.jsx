// src/Dashboard/components/GoalsSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";
import { Trash2, Edit2, Plus, Loader2, Target } from "lucide-react";
import { usePreferencesContext } from "../pages/PreferencesContext";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "../pages/UseLanguage";

const API_BASE = "http://localhost:3000";

const goalSchema = z.object({
  goalType: z.string().min(1, { message: "Goal type is required" }),
  deadline: z.string().min(1, { message: "Deadline is required" }).refine((v) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const d = new Date(v);     d.setHours(0, 0, 0, 0);
    return !isNaN(d.getTime()) && d >= today;
  }, { message: "Deadline cannot be in the past" }),
  notes: z.string().trim().optional().refine(val => !val || /[a-zA-Z0-9]/.test(val), {
    message: "Notes must contain at least one letter or number"
  }),
  current: z.coerce.number().min(0.1, { message: "Current value must be greater than 0" }),
  target:  z.coerce.number().min(0.1, { message: "Target weight value must be greater than 0" }),
});

// ── Glassmorphism shared styles ──────────────────────────────────────────────
const glassCard = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
};

const glassInput = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "var(--text-primary)",
  borderRadius: "10px",
  transition: "all 0.2s ease",
};

const inputFocusStyle = `
  .glass-input:focus {
    outline: none;
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    background: rgba(255,255,255,0.08) !important;
  }
  .glass-input::placeholder { color: rgba(255,255,255,0.3); }
  .glass-input option { background: var(--bg-card); color: var(--text-primary); }

  .row-hover:hover {
    background: rgba(255,255,255,0.04) !important;
    transition: background 0.2s ease;
  }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

export default function GoalsSection() {
  const { preferences, formatWeight } = usePreferencesContext();
  const { t } = useLanguage();

  const [goals, setGoals]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [editingId, setEditingId] = useState(null);

  const user   = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goalType: "Weight Loss",
      target: "",
      current: "",
      deadline: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const watchedGoalType = watch("goalType");

  const isWeightRelated = (type) => {
    if (!type) return false;
    const l = type.toLowerCase();
    return l.includes("weight") || l.includes("loss") || l.includes("gain");
  };

  const isLossGoal = (type) =>
    type.toLowerCase().includes("loss") || type.toLowerCase().includes("reduce");

  useEffect(() => {
    if (isWeightRelated(watchedGoalType) && user?.currentWeight) {
      setValue("current", user.currentWeight);
    }
  }, [watchedGoalType, user?.currentWeight, setValue]);

  const fetchGoals = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const res = await axios.get(`${API_BASE}/goals?userId=${userId}`);
      setGoals(res.data);
    } catch { toast.error(t("failedToLoadGoals")); }
    finally  { setLoading(false); }
  }, [userId, t]);

  const onSubmit = async (data) => {
    if (!userId) return toast.error(t("userNotLoggedIn"));

    const payload = { 
      userId, 
      ...data, 
      target: Number(data.target),
      current: Number(data.current) 
    };

    setSaving(true);
    try {
      if (editingId) {
        await axios.post(`${API_BASE}/goals/${editingId}`, payload);
        toast.success(t("goalUpdated"));
      } else {
        await axios.post(`${API_BASE}/goals`, payload);
        toast.success(t("goalAdded"));
      }

      const progress = calculateProgress(payload);
      if (isWeightRelated(data.goalType) && progress >= 100) {
        try {
          const wRes = await axios.post(`${API_BASE}/profile/weight`,
            { userId, currentWeight: Number(data.current) });
          const updatedUser = { ...user, currentWeight: wRes.data.currentWeight };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new CustomEvent("profile-updated", { detail: updatedUser }));
          toast.success("Goal Achieved! Weight auto-updated.");
        } catch (e) { console.error(e); }
      }

      reset();
      setEditingId(null);
      fetchGoals();
    } catch { toast.error(editingId ? t("updateFailed") : t("addFailed")); }
    finally { setSaving(false); }
  };

  const deleteGoal = (id) => {
    showDeleteConfirm({
      message: t("deleteGoalConfirmation"),
      onConfirm: async () => {
        try { await axios.delete(`${API_BASE}/goals/${id}`); toast.success(t("deleteSuccessfully")); fetchGoals(); }
        catch { toast.error(t("unableToDelete")); }
      },
    });
  };

  const startEdit = (goal) => {
    setEditingId(goal._id);
    reset({
      goalType: goal.goalType,
      target: goal.target,
      current: goal.current,
      deadline: new Date(goal.deadline).toISOString().split("T")[0],
      notes: goal.notes || "",
    });
  };

  const calculateProgress = (goal) => {
    const { goalType, current, target } = goal;
    if (target === 0) return 0;
    if (isLossGoal(goalType)) {
      const start = Math.max(current, target);
      const total = start - target;
      if (total <= 0) return 100;
      return Math.min(Math.max(((start - current) / total) * 100, 0), 100);
    } else {
      const start = Math.min(current, target);
      const total = target - start;
      if (total <= 0) return 100;
      return Math.min(Math.max(((current - start) / total) * 100, 0), 100);
    }
  };

  const getProgressStatus = (goal) => {
    const progress = calculateProgress(goal);
    if (progress >= 100) return t("goalAchieved");
    const days = Math.ceil((new Date(goal.deadline) - new Date()) / 86400000);
    if (days < 0) return t("overdue");
    if (days === 0) return t("dueToday");
    if (days === 1) return t("oneDayLeft");
    return t("daysLeft", { days });
  };

  const getProgressStyle = (progress) => {
    if (progress >= 100) return { background: "#22c55e" };
    if (progress >= 75)  return { background: "var(--accent)" };
    if (progress >= 50)  return { background: "#eab308" };
    if (progress >= 25)  return { background: "#f97316" };
    return { background: "#ef4444" };
  };

  const getStatusColor = (goal) => {
    const p = calculateProgress(goal);
    const s = getProgressStatus(goal);
    if (p >= 100) return "#22c55e";
    if (s === t("overdue")) return "#f87171";
    return "var(--text-muted)";
  };

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  // ── Loading ──
  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div style={{ position: "relative" }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--accent)" }} />
        <div style={{
          position: "absolute", inset: "-6px", borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)",
          animation: "glow-pulse 2s ease-in-out infinite",
        }} />
      </div>
    </div>
  );

  const goalTypes = ["Weight Loss", "Muscle Gain", "Run Distance", "Lift Target", "Other"];
  const unitLabel = preferences?.units === "imperial" ? t("lbs") : t("kg");

  return (
    <>
      <style>{inputFocusStyle}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 rounded-2xl overflow-hidden"
        style={{ ...glassCard, padding: "1.75rem" }}
      >
        <Toaster toastOptions={{
          style: { ...glassCard, color: "var(--text-primary)", fontSize: "0.875rem" },
        }} />

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <div style={{
            padding: "10px", borderRadius: "12px",
            background: "color-mix(in srgb, var(--accent) 15%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
            boxShadow: "0 0 16px color-mix(in srgb, var(--accent) 20%, transparent)",
            animation: "glow-pulse 3s ease-in-out infinite",
          }}>
            <Target className="w-5 h-5" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              {t("fitnessGoals")}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {t("trackYourProgress") || "Track and manage your fitness goals"}
            </p>
          </div>
        </div>

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl p-5 mb-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--accent)", letterSpacing: "0.12em" }}>
            {editingId ? `✏️ ${t("update")}` : `＋ ${t("add")} ${t("goal") || "Goal"}`}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-3" noValidate>

            {/* Goal Type */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider pl-1"
                style={{ color: "var(--text-muted)" }}>
                {t("goalType")} *
              </label>
              <select
                {...register("goalType")}
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.goalType ? 'border-red-500' : ''}`}
                style={glassInput}
              >
                {goalTypes.map((gt) => (
                  <option key={gt} value={gt}>{gt}</option>
                ))}
              </select>
              {errors.goalType && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.goalType.message}</p>}
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider pl-1"
                style={{ color: "var(--text-muted)" }}>
                {t("deadline")} *
              </label>
              <input
                {...register("deadline")}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.deadline ? 'border-red-500' : ''}`}
                style={glassInput}
              />
              {errors.deadline && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.deadline.message}</p>}
            </div>

            {/* Target */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider pl-1"
                style={{ color: "var(--text-muted)" }}>
                {t("target")} {isWeightRelated(watchedGoalType) ? `(${unitLabel})` : ""} *
              </label>
              <input
                {...register("target")}
                type="number"
                step="any"
                placeholder={t("target")}
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.target ? 'border-red-500' : ''}`}
                style={glassInput}
              />
              {errors.target && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.target.message}</p>}
            </div>

            {/* Current */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider pl-1"
                style={{ color: "var(--text-muted)" }}>
                {t("current")} {isWeightRelated(watchedGoalType) ? `(${unitLabel})` : ""} *
              </label>
              <input
                {...register("current")}
                type="number"
                step="any"
                placeholder={t("current")}
                readOnly={isWeightRelated(watchedGoalType) && !!user?.currentWeight}
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.current ? 'border-red-500' : ''}`}
                style={{
                  ...glassInput,
                  ...(isWeightRelated(watchedGoalType) && user?.currentWeight ? {
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#f87171",
                  } : {}),
                }}
              />
              {errors.current && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.current.message}</p>}
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider pl-1"
                style={{ color: "var(--text-muted)" }}>
                {t("notes")}
              </label>
              <input
                {...register("notes")}
                placeholder={`${t("notes")} (${t("optional") || "optional"})`}
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.notes ? 'border-red-500' : ''}`}
                style={glassInput}
              />
              {errors.notes && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.notes.message}</p>}
            </div>

            {/* Actions */}
            <div className="md:col-span-2 flex gap-2 pt-1">
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))",
                  boxShadow: "0 4px 16px color-mix(in srgb, var(--accent) 35%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> :
                 editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {saving ? `${t("saving")}…` : editingId ? t("update") : `${t("add")} ${t("goal") || "Goal"}`}
              </motion.button>

              {editingId && (
                <motion.button
                  type="button"
                  onClick={() => { reset(); setEditingId(null); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium"
                  style={{ ...glassInput, color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  {t("cancel")}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* ── Table ── */}
        <div className="rounded-xl overflow-hidden" style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
        }}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {[t("type"), t("target"), t("current"), t("deadline"), t("progress"), t("status"), t("actions")].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {goals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div style={{
                            padding: 16, borderRadius: "50%",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}>
                            <Target className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                          </div>
                          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            {t("noGoalsSetYet")}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : goals.map((goal, i) => {
                    const progress = calculateProgress(goal);
                    const status   = getProgressStatus(goal);

                    return (
                      <motion.tr
                        key={goal._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                        className="row-hover"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        {/* Type */}
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                              color: "var(--accent)",
                              border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                            }}>
                            {goal.goalType}
                          </span>
                        </td>

                        {/* Target */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {isWeightRelated(goal.goalType) ? formatWeight(goal.target) : goal.target}
                          </span>
                        </td>

                        {/* Current */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {isWeightRelated(goal.goalType) ? formatWeight(goal.current) : goal.current}
                          </span>
                        </td>

                        {/* Deadline */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                              {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        {/* Progress bar */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full overflow-hidden"
                              style={{ background: "rgba(255,255,255,0.08)" }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                                className="h-full rounded-full"
                                style={getProgressStyle(progress)}
                              />
                            </div>
                            <span className="text-xs font-semibold tabular-nums"
                              style={{ color: "var(--text-primary)" }}>
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{
                              color: getStatusColor(goal),
                              background: `${getStatusColor(goal)}18`,
                              border: `1px solid ${getStatusColor(goal)}30`,
                            }}>
                            {status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex gap-1.5">
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                              onClick={() => startEdit(goal)}
                              className="p-2 rounded-lg transition-all"
                              style={{
                                background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                                border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                              }}
                              title={t("edit")}
                            >
                              <Edit2 className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                              onClick={() => deleteGoal(goal._id)}
                              className="p-2 rounded-lg transition-all"
                              style={{
                                background: "rgba(239,68,68,0.08)",
                                border: "1px solid rgba(239,68,68,0.2)",
                              }}
                              title={t("delete")}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
}
