// src/Dashboard/components/ProgressInputSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, TrendingUp, Plus, Calendar, Weight, Ruler, Timer, Dumbbell } from "lucide-react";
import { usePreferencesContext } from "../pages/PreferencesContext";
import { useLanguage } from "../pages/UseLanguage";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const API_BASE_URL = "http://localhost:3000";

const progSchema = z.object({
  date:        z.string().min(1, { message: "Date is required" }),
  weight:      z.coerce.number().min(20, { message: "Weight must be at least 20kg" }).max(600, { message: "Invalid weight" }),
  chest:       z.coerce.number().min(30, { message: "Chest measurement must be at least 30cm" }).max(300, { message: "Invalid measurement" }),
  waist:       z.coerce.number().min(30, { message: "Waist measurement must be at least 30cm" }).max(300, { message: "Invalid measurement" }),
  runTime:     z.coerce.number().min(0.1, { message: "Run time is required" }).max(1440, { message: "Max 24 hours" }),
  liftWeight:  z.coerce.number().min(0.1, { message: "Lift weight is required" }),
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

const sharedStyles = `
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }
  .glass-input:focus {
    outline: none;
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    background: rgba(255,255,255,0.08) !important;
  }
  .glass-input::placeholder { color: rgba(255,255,255,0.3); }
  .glass-input::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
  .glass-input[type="number"]::-webkit-inner-spin-button,
  .glass-input[type="number"]::-webkit-outer-spin-button { opacity: 0.4; }
`;
// ─────────────────────────────────────────────────────────────────────────────

const FIELD_ICON = {
  date:       <Calendar className="w-4 h-4" />,
  weight:     <Weight className="w-4 h-4" />,
  chest:      <Ruler className="w-4 h-4" />,
  waist:      <Ruler className="w-4 h-4" />,
  runTime:    <Timer className="w-4 h-4" />,
  liftWeight: <Dumbbell className="w-4 h-4" />,
};

export default function ProgressInputSection({ onProgressAdded }) {
  const { getWeightUnit, getHeightUnit } = usePreferencesContext();
  const { t } = useLanguage();
  const [saving, setIsSaving] = useState(false);
  const [goals, setGoals] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(progSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      weight: "",
      chest: "",
      waist: "",
      runTime: "",
      liftWeight: "",
    },
  });

  const fetchGoals = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/goals?userId=${userId}`);
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const checkAndCompleteGoal = async (loggedWeight) => {
    // Look for Weight Loss or Muscle Gain goals
    const activeWeightGoals = goals.filter(g => {
      const type = g.goalType.toLowerCase();
      // Check if goal is already completed (if there's a status field, otherwise calculate)
      const current = Number(g.current);
      const target = Number(g.target);
      const isLoss = type.includes("loss");
      
      // If progress is already 100%, skip
      if (isLoss) { if (current <= target) return false; }
      else { if (current >= target) return false; }

      return type.includes("weight") || type.includes("loss") || type.includes("gain");
    });

    for (const goal of activeWeightGoals) {
      const target = Number(goal.target);
      const type = goal.goalType.toLowerCase();
      const isLoss = type.includes("loss");

      // Check if logged weight meets or passes the target
      const isAchieved = isLoss ? loggedWeight <= target : loggedWeight >= target;

      if (isAchieved) {
        try {
          await axios.post(`${API_BASE_URL}/goals/${goal._id}`, {
            ...goal,
            current: loggedWeight,
          });
          toast.success(`🎉 ${t("goalAchieved")}: ${goal.goalType}!`, {
            duration: 5000,
            icon: '🏆',
          });
          fetchGoals(); // Refresh local goals list
        } catch (err) {
          console.error("Failed to auto-update goal:", err);
        }
      }
    }
  };

  const onSubmit = async (data) => {
    if (!userId) { toast.error(t("pleaseLogin")); return; }

    // REQUIREMENT 1: Block if no goals exist
    if (goals.length === 0) {
      toast.error(t("setGoalFirst") || "Go, set your goal first", {
        icon: '⚠️',
      });
      return;
    }

    const payload = {
      userId,
      date:   data.date,
      weight: Number(data.weight),
      measurements: {
        chest: Number(data.chest),
        waist: Number(data.waist),
      },
      performance: {
        runTime:    Number(data.runTime),
        liftWeight: Number(data.liftWeight),
      },
    };

    setIsSaving(true);
    try {
      await axios.post(`${API_BASE_URL}/progress`, payload);
      toast.success(t("progressSaved"));
      
      // REQUIREMENT 2: Check for goal completion
      checkAndCompleteGoal(Number(data.weight));

      reset({
        date: new Date().toISOString().split("T")[0],
        weight: "",
        chest: "",
        waist: "",
        runTime: "",
        liftWeight: "",
      });
      onProgressAdded();
    } catch (err) {
      console.error(err);
      toast.error(t("saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const fields = [
    {
      key: "date", type: "date", label: t("date"),
      unit: null, placeholder: null,
      min: today, max: today,
    },
    {
      key: "weight", type: "number", label: t("weight"),
      unit: getWeightUnit(), placeholder: `${t("weight")} (${getWeightUnit()})`,
    },
    {
      key: "chest", type: "number", label: t("chest"),
      unit: getHeightUnit(), placeholder: `${t("chest")} (${getHeightUnit()})`,
    },
    {
      key: "waist", type: "number", label: t("waist"),
      unit: getHeightUnit(), placeholder: `${t("waist")} (${getHeightUnit()})`,
    },
    {
      key: "runTime", type: "number", label: t("runTime"),
      unit: t("minutes"), placeholder: `${t("runTime")} (${t("minutes")})`,
    },
    {
      key: "liftWeight", type: "number", label: t("liftWeight"),
      unit: getWeightUnit(), placeholder: `${t("liftWeight")} (${getWeightUnit()})`,
    },
  ];

  return (
    <>
      <style>{sharedStyles}</style>

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div style={{
              padding: "10px", borderRadius: "12px",
              background: "color-mix(in srgb, var(--accent) 15%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
              boxShadow: "0 0 16px color-mix(in srgb, var(--accent) 20%, transparent)",
              animation: "glow-pulse 3s ease-in-out infinite",
            }}>
              <TrendingUp className="w-5 h-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {t("logNewProgress")}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {t("trackYourMeasurementsAndPerformance")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
          }}>
            <TrendingUp className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
              {today}
            </span>
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{
            color: "var(--accent)", letterSpacing: "0.12em",
          }}>
            ＋ {t("newEntry")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            {fields.map(({ key, type, label, unit, placeholder, min, max }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex flex-col gap-1"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span style={{ color: "var(--text-muted)" }}>{FIELD_ICON[key]}</span>
                  <label className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                    {label}{unit ? ` (${unit})` : ""}
                  </label>
                </div>

                <input
                  {...register(key)}
                  type={type}
                  placeholder={placeholder ?? ""}
                  step={type === "number" ? "any" : undefined}
                  min={min}
                  max={max}
                  className={`glass-input w-full px-3 py-2.5 text-sm ${errors[key] ? 'border-red-500' : ''}`}
                  style={glassInput}
                />

                {errors[key] && (
                  <p className="text-xs pl-1 mt-0.5" style={{ color: "#f87171" }}>
                    {errors[key].message}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginBottom: "1.25rem" }} />

          <div className="flex items-center gap-3">
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
                opacity: saving ? 0.75 : 1,
              }}
            >
              {saving
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Plus className="w-4 h-4" />}
              {saving ? `${t("saving")}…` : t("saveProgress")}
            </motion.button>

            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {t("allFieldsRequired")}
            </p>
          </div>

        </form>
      </motion.div>
    </>
  );
}
