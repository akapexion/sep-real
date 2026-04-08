// src/Dashboard/components/ProgressInputSection.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, TrendingUp, Plus, Calendar, Weight, Ruler, Timer, Dumbbell } from "lucide-react";
import { usePreferencesContext } from "../pages/PreferencesContext";
import { useLanguage } from "../pages/UseLanguage";
import { z } from "zod";

const API_BASE_URL = "http://localhost:3000";

const progSchema = z.object({
  date:        z.any().refine((v) => v !== "" && v != null, { message: "Please enter detail" }),
  weight:      z.any().refine((v) => v !== "" && v != null, { message: "Please enter detail" }),
  chest:       z.any().refine((v) => v !== "" && v != null, { message: "Please enter detail" }),
  waist:       z.any().refine((v) => v !== "" && v != null, { message: "Please enter detail" }),
  runTime:     z.any().refine((v) => v !== "" && v != null, { message: "Please enter detail" }),
  liftWeight:  z.any().refine((v) => v !== "" && v != null, { message: "Please enter detail" }),
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

  const [form, setForm] = useState({
    date: "", weight: "", chest: "", waist: "", runTime: "", liftWeight: "",
  });
  const [error, setSaving]   = useState({});
  const [saving, setIsSaving] = useState(false);

  // rename to avoid clash
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user   = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id;
    if (!userId) { toast.error(t("pleaseLogin")); return; }

    const result = progSchema.safeParse(form);
    if (!result.success) {
      const fe = result.error.format();
      setFieldErrors({
        date:       fe.date?._errors[0]       || "",
        weight:     fe.weight?._errors[0]     || "",
        chest:      fe.chest?._errors[0]      || "",
        waist:      fe.waist?._errors[0]      || "",
        runTime:    fe.runTime?._errors[0]    || "",
        liftWeight: fe.liftWeight?._errors[0] || "",
      });
      return;
    }
    setFieldErrors({});

    const payload = {
      userId,
      date:   form.date,
      weight: form.weight    ? parseFloat(form.weight)    : null,
      measurements: {
        chest: form.chest    ? parseFloat(form.chest)     : null,
        waist: form.waist    ? parseFloat(form.waist)     : null,
      },
      performance: {
        runTime:    form.runTime    ? parseFloat(form.runTime)    : null,
        liftWeight: form.liftWeight ? parseFloat(form.liftWeight) : null,
      },
    };

    setIsSaving(true);
    try {
      await axios.post(`${API_BASE_URL}/progress`, payload);
      toast.success(t("progressSaved"));
      setForm({ date: "", weight: "", chest: "", waist: "", runTime: "", liftWeight: "" });
      onProgressAdded();
    } catch (err) {
      console.error(err);
      toast.error(t("saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  // Field definitions — drives the grid declaratively
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

          {/* Entry counter pill */}
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
        <form onSubmit={handleSubmit} noValidate>

          {/* Section label */}
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{
            color: "var(--accent)", letterSpacing: "0.12em",
          }}>
            ＋ {t("newEntry")}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            {fields.map(({ key, type, label, unit, placeholder, min, max }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex flex-col gap-1"
              >
                {/* Label row */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span style={{ color: "var(--text-muted)" }}>{FIELD_ICON[key]}</span>
                  <label className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                    {label}{unit ? ` (${unit})` : ""}
                  </label>
                </div>

                {/* Input */}
                <input
                  type={type}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={placeholder ?? ""}
                  step={type === "number" ? "0.1" : undefined}
                  min={min}
                  max={max}
                  className="glass-input w-full px-3 py-2.5 text-sm"
                  style={glassInput}
                />

                {/* Inline error */}
                {fieldErrors[key] && (
                  <p className="text-xs pl-1 mt-0.5" style={{ color: "#f87171" }}>
                    {fieldErrors[key]}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginBottom: "1.25rem" }} />

          {/* Submit */}
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

            {/* Helper text */}
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {t("allFieldsRequired")}
            </p>
          </div>

        </form>
      </motion.div>
    </>
  );
}