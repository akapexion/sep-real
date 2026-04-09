// src/Dashboard/components/RecentWorkoutsSection.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";
import { Trash2, Edit2, Plus, Loader2, Dumbbell, Search, X } from "lucide-react";
import { usePreferencesContext } from "../pages/PreferencesContext";
import { useLanguage } from "../pages/UseLanguage";
import { z } from "zod";

const API_BASE_URL = "http://localhost:3000";

const CATEGORY_TAGS = {
  Strength:  ["Hypertrophy", "Powerlifting", "Bodybuilding", "Core", "Endurance"],
  Cardio:    ["Running", "Cycling", "Swimming", "Rowing", "Endurance"],
  Yoga:      ["Flexibility", "Vinyasa", "Hatha", "Restorative"],
  HIIT:      ["Intervals", "Circuit", "Tabata", "Sprint"],
  Mobility:  ["Stretching", "Recovery", "Warm-up", "Cool-down"],
  Other:     ["General", "Rehab", "Sports", "Mixed"],
};

const CATEGORY_COLORS = {
  Strength: { color: "var(--accent)",  bg: "color-mix(in srgb, var(--accent) 12%, transparent)",  border: "color-mix(in srgb, var(--accent) 25%, transparent)" },
  Cardio:   { color: "#f87171",        bg: "rgba(239,68,68,0.10)",    border: "rgba(239,68,68,0.25)"    },
  Yoga:     { color: "#4ade80",        bg: "rgba(74,222,128,0.10)",   border: "rgba(74,222,128,0.25)"   },
  HIIT:     { color: "#fb923c",        bg: "rgba(251,146,60,0.10)",   border: "rgba(251,146,60,0.25)"   },
  Mobility: { color: "#38bdf8",        bg: "rgba(56,189,248,0.10)",   border: "rgba(56,189,248,0.25)"   },
  Other:    { color: "#94a3b8",        bg: "rgba(148,163,184,0.10)",  border: "rgba(148,163,184,0.25)"  },
};

const workoutSchema = z.object({
  exerciseName: z.string().min(1, { message: "Exercise name is required" }),
  sets:         z.coerce.number().min(1, { message: "Sets must be at least 1" }).max(5,  { message: "Max 5 sets allowed"  }),
  reps:         z.coerce.number().min(1, { message: "Reps must be at least 1" }).max(20, { message: "Max 20 reps allowed" }),
  weights:      z.coerce.number().min(0, { message: "Weights cannot be negative" }),
  notes:        z.string().optional(),
  tags:         z.string().optional(),
  date:         z.string().min(1, { message: "Date is required" }),
  category:     z.string().min(1, { message: "Category is required" }),
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
  .glass-input option { background: var(--bg-card); color: var(--text-primary); }
  .glass-input::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
  .glass-input[type="number"]::-webkit-inner-spin-button,
  .glass-input[type="number"]::-webkit-outer-spin-button { opacity: 0.4; }
  .row-hover:hover {
    background: rgba(255,255,255,0.04) !important;
    transition: background 0.2s ease;
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

  // ── Reusable field wrapper ────────────────────────────────────────────────
  const Field = ({ label, error, children }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{error}</p>}
    </div>
  );

export default function RecentWorkoutsSection() {
  const { formatWeight, getWeightUnit } = usePreferencesContext();
  const { t } = useLanguage();

  const [exerciseName, setExerciseName] = useState("");
  const [sets,         setSets]         = useState("");
  const [reps,         setReps]         = useState("");
  const [weights,      setWeights]      = useState("");
  const [notes,        setNotes]        = useState("");
  const [category,     setCategory]     = useState("Other");
  const [tags,         setTags]         = useState(CATEGORY_TAGS["Other"][0]);
  const [date,         setDate]         = useState(new Date().toISOString().split("T")[0]);
  const [fieldErrors,  setFieldErrors]  = useState({});

  const [workouts,   setWorkouts]   = useState([]);
  const [editingId,  setEditingId]  = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [filterTag,  setFilterTag]  = useState("");

  const displayedWorkouts = workouts.filter(w =>
    !filterTag || (w.tags && w.tags.toLowerCase().includes(filterTag.toLowerCase()))
  );

  useEffect(() => { fetchWorkouts(); }, []);

  const fetchWorkouts = async () => {
    const user   = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id;
    if (!userId) return toast.error(t("userNotLoggedIn"));
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/workouts`, { params: { userId } });
      setWorkouts(res.data);
    } catch { toast.error(t("unableToFetchWorkouts")); }
    finally  { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = workoutSchema.safeParse({ exerciseName, sets, reps, weights, notes, tags, date, category });
    if (!result.success) {
      const fe = result.error.format();
      setFieldErrors({
        exerciseName: fe.exerciseName?._errors[0] || "",
        sets:         fe.sets?._errors[0]         || "",
        reps:         fe.reps?._errors[0]         || "",
        weights:      fe.weights?._errors[0]      || "",
        notes:        fe.notes?._errors[0]        || "",
        tags:         fe.tags?._errors[0]         || "",
        date:         fe.date?._errors[0]         || "",
        category:     fe.category?._errors[0]     || "",
      });
      return;
    }
    setFieldErrors({});

    const user   = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id;
    if (!userId) return toast.error(t("userNotLoggedIn"));

    setSaving(true);
    try {
      const body = { userId, exerciseName, sets, reps, weights, notes, category, tags, date };
      if (editingId) {
        await axios.post(`${API_BASE_URL}/workouts/${editingId}`, body);
        toast.success(t("updateSuccessfully"));
      } else {
        await axios.post(`${API_BASE_URL}/workouts`, body);
        toast.success(t("workoutAddedSuccessfully"));
      }
      resetForm();
      fetchWorkouts();
    } catch { toast.error(t("unableToSave")); }
    finally  { setSaving(false); }
  };

  const handleEdit = (w) => {
    setExerciseName(w.exerciseName);
    setSets(w.sets); setReps(w.reps); setWeights(w.weights);
    setNotes(w.notes); setCategory(w.category); setTags(w.tags);
    setDate(new Date(w.date).toISOString().split("T")[0]);
    setEditingId(w._id);
  };

  const handleDelete = (id) => {
    showDeleteConfirm({
      message: t("deleteWorkoutConfirmation"),
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/workouts/${id}`);
          toast.success(t("deleteSuccessfully"));
          fetchWorkouts();
        } catch { toast.error(t("unableToDelete")); }
      },
    });
  };

  const resetForm = () => {
    setExerciseName(""); setSets(""); setReps(""); setWeights("");
    setNotes(""); setCategory("Other"); setTags(CATEGORY_TAGS["Other"][0]);
    setDate(new Date().toISOString().split("T")[0]); setEditingId(null);
  };

  const tableHeaders = [
    t("date"), t("exercise"), t("sets"), t("reps"),
    `${t("weight")} (${getWeightUnit()})`, t("category"), t("tags"), t("notes"), t("actions"),
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
              <Dumbbell className="w-5 h-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {editingId ? t("editWorkout") : t("addWorkout")}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {t("trackYourWorkoutsAndProgress")}
              </p>
            </div>
          </div>

          {/* Workout count pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
          }}>
            <Dumbbell className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
              {workouts.length} {t("logged")}
            </span>
          </div>
        </div>

        {/* ── Form panel ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl p-5 mb-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--accent)", letterSpacing: "0.12em" }}>
            {editingId ? `✏️ ${t("update")}` : `＋ ${t("addWorkout")}`}
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">

            {/* Exercise name — full width */}
            <Field label={t("exerciseName")} error={fieldErrors.exerciseName}>
              <input
                type="text"
                value={exerciseName}
                onChange={e => setExerciseName(e.target.value)}
                placeholder={t("exerciseName")}
                className="glass-input w-full px-3 py-2.5 text-sm"
                style={glassInput}
              />
            </Field>

            {/* Sets / Reps / Weight — 3 columns */}
            <div className="grid grid-cols-3 gap-3">
              <Field label={t("sets")} error={fieldErrors.sets}>
                <input type="number" value={sets} onChange={e => setSets(e.target.value)}
                  min="1" max="5" placeholder="1–5"
                  className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput} />
              </Field>
              <Field label={t("reps")} error={fieldErrors.reps}>
                <input type="number" value={reps} onChange={e => setReps(e.target.value)}
                  min="1" max="20" placeholder="1–20"
                  className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput} />
              </Field>
              <Field label={`${t("weight")} (${getWeightUnit()})`} error={fieldErrors.weights}>
                <input type="number" value={weights} onChange={e => setWeights(e.target.value)}
                  step="0.5" placeholder="0"
                  className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput} />
              </Field>
            </div>

            {/* Category / Tags — 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("category")} error={fieldErrors.category}>
                <select
                  value={category}
                  onChange={e => { setCategory(e.target.value); setTags(CATEGORY_TAGS[e.target.value][0]); }}
                  className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput}
                >
                  {Object.keys(CATEGORY_TAGS).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={t("tags")} error={fieldErrors.tags}>
                <select value={tags} onChange={e => setTags(e.target.value)}
                  className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput}>
                  {CATEGORY_TAGS[category]?.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>
              </Field>
            </div>

            {/* Date — full width */}
            <Field label={t("date")} error={fieldErrors.date}>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput} />
            </Field>

            {/* Notes — full width textarea */}
            <Field label={t("notes")} error={fieldErrors.notes}>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder={`${t("notes")} (${t("optional")})`}
                className="glass-input w-full px-3 py-2.5 text-sm resize-none"
                style={{ ...glassInput, lineHeight: 1.5 }}
              />
            </Field>

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))",
                  boxShadow: "0 4px 16px color-mix(in srgb, var(--accent) 35%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
                  opacity: saving ? 0.75 : 1,
                }}
              >
                {saving   ? <Loader2 className="w-4 h-4 animate-spin" />
                : editingId ? <Edit2  className="w-4 h-4" />
                :             <Plus   className="w-4 h-4" />}
                {saving ? `${t("saving")}…` : editingId ? t("updateWorkout") : t("saveWorkout")}
              </motion.button>

              {editingId && (
                <motion.button
                  type="button" onClick={resetForm}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium"
                  style={{ ...glassInput, color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  {t("cancelEdit")}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* ── Recent workouts header + filter ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--accent)", letterSpacing: "0.12em" }}>
              {t("recentWorkouts")}
            </p>
          </div>

          {/* Filter input */}
          <div className="relative flex items-center" style={{ minWidth: 180 }}>
            <Search className="absolute left-3 w-3.5 h-3.5 pointer-events-none"
              style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Filter by tag…"
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
              className="glass-input w-full pl-8 pr-8 py-2 text-xs"
              style={{ ...glassInput, borderRadius: "8px" }}
            />
            {filterTag && (
              <button onClick={() => setFilterTag("")}
                className="absolute right-2.5 flex items-center"
                style={{ color: "var(--text-muted)" }}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div style={{ position: "relative" }}>
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
              <div style={{
                position: "absolute", inset: "-6px", borderRadius: "50%",
                background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)",
                animation: "glow-pulse 2s ease-in-out infinite",
              }} />
            </div>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {tableHeaders.map(h => (
                      <th key={h}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest whitespace-nowrap"
                        style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {displayedWorkouts.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-5 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div style={{
                              padding: 16, borderRadius: "50%",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}>
                              <Dumbbell className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                            </div>
                            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                              {filterTag ? `No workouts matching "${filterTag}"` : t("noWorkoutsFound")}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : displayedWorkouts.map((w, i) => {
                      const cs = CATEGORY_COLORS[w.category] || CATEGORY_COLORS["Other"];
                      return (
                        <motion.tr
                          key={w._id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ delay: i * 0.04, duration: 0.25 }}
                          className="row-hover"
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                        >
                          {/* Date */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                {new Date(w.date).toLocaleDateString()}
                              </span>
                            </div>
                          </td>

                          {/* Exercise name */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                              {w.exerciseName}
                            </span>
                          </td>

                          {/* Sets */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{
                                background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                                color: "var(--accent)",
                                border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                              }}>
                              {w.sets}
                            </span>
                          </td>

                          {/* Reps */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                              {w.reps}
                            </span>
                          </td>

                          {/* Weight */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                              {formatWeight(w.weights)}
                            </span>
                          </td>

                          {/* Category badge */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium border"
                              style={{ color: cs.color, background: cs.bg, borderColor: cs.border }}>
                              {w.category}
                            </span>
                          </td>

                          {/* Tags badge */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{
                                background: "rgba(255,255,255,0.06)",
                                color: "var(--text-muted)",
                                border: "1px solid rgba(255,255,255,0.10)",
                              }}>
                              {w.tags}
                            </span>
                          </td>

                          {/* Notes */}
                          <td className="px-5 py-4 max-w-[180px]">
                            <span className="text-xs truncate block" style={{ color: "var(--text-muted)" }}>
                              {w.notes || "—"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex gap-1.5">
                              <motion.button
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                                onClick={() => handleEdit(w)}
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
                                onClick={() => handleDelete(w._id)}
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
        )}
      </motion.div>
    </>
  );
}