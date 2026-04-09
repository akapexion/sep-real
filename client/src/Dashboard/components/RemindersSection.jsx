// src/Dashboard/components/RemindersSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Trash2, Edit2, Plus, Loader2, Bell, ToggleLeft, ToggleRight,
  Clock, AlertTriangle, Calendar, Utensils, Dumbbell, Target,
} from "lucide-react";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";
import { z } from "zod";
import { useLanguage } from "../pages/UseLanguage";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const API_BASE = "http://localhost:3000";

const reminderSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" })
    .refine(val => /[a-zA-Z0-9]/.test(val), "Must contain at least one letter or number"),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  priority: z.string().optional(),
  notes: z.string().trim().optional().refine(val => !val || /[a-zA-Z0-9]/.test(val), "Must contain at least one letter or number"),
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

export default function RemindersSection() {
  const [reminders, setReminders]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [activeTab, setActiveTab]   = useState("all");

  const user   = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const { t }  = useLanguage();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
      category: "reminder",
      type: "workout",
      priority: "medium",
      notes: "",
    },
  });

  const watchedCategory = watch("category");

  const fetchReminders = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const { data } = await axios.get(`${API_BASE}/reminders?userId=${userId}`);
      setReminders(data);
    } catch { toast.error(t("failedToLoadReminders")); }
    finally   { setLoading(false); }
  }, [userId, t]);

  const scheduleNotification = (reminder) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission().then(p => { if (p === "granted") scheduleSingleNotification(reminder); });
    } else if (Notification.permission === "granted") { scheduleSingleNotification(reminder); }
  };

  const scheduleSingleNotification = (reminder) => {
    const reminderTime = new Date(reminder.date).getTime();
    const timeUntil    = reminderTime - Date.now();
    if (timeUntil > 0 && timeUntil < 86400000) {
      setTimeout(() => {
        if (reminder.isActive) {
          const notifTitle = reminder.category === "alert"
            ? `🚨 ${t("alert")}: ${reminder.title}`
            : `⏰ ${t("reminder")}: ${reminder.title}`;
          new Notification(notifTitle, {
            body: `${reminder.category === "alert" ? t("important") + ": " : ""}${reminder.notes || t("timeForActivity", { activity: t(reminder.type) })}`,
            icon: "/favicon.ico", tag: reminder._id,
          });
          createNotificationRecord(reminder);
        }
      }, timeUntil);
    }
  };

  const createNotificationRecord = async (reminder) => {
    try {
      await axios.post(`${API_BASE}/notifications`, {
        userId: reminder.userId, type: reminder.category,
        message: `${reminder.category === "alert" ? t("alert") : t("reminder")}: ${reminder.title}`,
        isRead: false, date: new Date().toISOString(), priority: reminder.priority,
      });
    } catch (err) { console.error(t("failedToCreateNotification"), err); }
  };

  const showBrowserNotification = (reminder) => {
    if (Notification.permission === "granted") {
      const notifTitle = reminder.category === "alert"
        ? `🚨 ${t("alert")}: ${reminder.title}`
        : `⏰ ${t("reminder")}: ${reminder.title}`;
      new Notification(notifTitle, {
        body: `${reminder.category === "alert" ? t("important") + ": " : ""}${reminder.notes || t("timeForActivity", { activity: t(reminder.type) })}`,
        icon: "/favicon.ico",
      });
      createNotificationRecord(reminder);
    }
  };

  const onSubmit = async (data) => {
    if (!userId) return toast.error(t("userNotLoggedIn"));

    const fullDateTime = `${data.date}T${data.time}:00`;
    const payload = { 
      userId, 
      ...data, 
      date: fullDateTime,
      priority: data.category === "alert" ? data.priority : "none",
      isActive: true 
    };

    setSaving(true);
    try {
      if (editingId) {
        await axios.post(`${API_BASE}/reminders/${editingId}`, payload);
        toast.success(data.category === "alert" ? t("alertUpdated") : t("reminderUpdated"));
      } else {
        await axios.post(`${API_BASE}/reminders`, payload);
        toast.success(data.category === "alert" ? t("alertCreated") : t("reminderCreated"));
        scheduleNotification(payload);
      }
      reset();
      setEditingId(null);
      fetchReminders();
    } catch (err) { 
      console.error(err); 
      toast.error(t("saveFailed")); 
    } finally { 
      setSaving(false); 
    }
  };

  const startEdit = (r) => {
    setEditingId(r._id);
    const rd = new Date(r.date);
    reset({
      title: r.title,
      type: r.type,
      category: r.category || "reminder",
      priority: r.priority || "medium",
      notes: r.notes || "",
      date: rd.toISOString().split("T")[0],
      time: rd.toTimeString().split(":").slice(0, 2).join(":"),
    });
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_BASE}/reminders/${id}`, { isActive: !currentStatus });
      toast.success(!currentStatus ? t("activated") : t("deactivated"));
      fetchReminders();
    } catch (err) { console.error(err); toast.error(t("updateFailed")); }
  };

  const del = (id) => {
    showDeleteConfirm({
      message: t("deleteReminderConfirmation"),
      onConfirm: async () => {
        try { await axios.delete(`${API_BASE}/reminders/${id}`); toast.success(t("deleteSuccessfully")); fetchReminders(); }
        catch { toast.error(t("unableToDelete")); }
      },
    });
  };

  const filteredReminders = reminders.filter(r => activeTab === "all" || r.category === activeTab);

  const getIcon = (item) => {
    if (item.category === "alert") return <AlertTriangle className="w-4 h-4" />;
    switch (item.type) {
      case "workout":     return <Dumbbell className="w-4 h-4" />;
      case "meal":        return <Utensils className="w-4 h-4" />;
      case "goal":        return <Target className="w-4 h-4" />;
      case "appointment": return <Calendar className="w-4 h-4" />;
      default:            return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "high":   return "text-red-400 bg-red-500/15 border-red-500/30";
      case "medium": return "text-yellow-400 bg-yellow-500/15 border-yellow-500/30";
      case "low":    return "text-blue-400 bg-blue-500/15 border-blue-500/30";
      default:       return "text-gray-400 bg-gray-500/15 border-gray-500/30";
    }
  };

  const getCategoryStyle = (cat) =>
    cat === "alert"
      ? "text-red-400 bg-red-500/15 border border-red-500/30"
      : "text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30";

  useEffect(() => {
    if (reminders.length === 0) return;
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach(r => {
        if (r.isActive) {
          const diff = new Date(r.date).getTime() - now.getTime();
          if (diff > 0 && diff <= 60000 && !r.notified) showBrowserNotification(r);
        }
      });
    };
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [reminders, t]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  }, []);

  useEffect(() => { fetchReminders(); }, [fetchReminders]);

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

  const tabs = ["all", "reminders", "alerts"];

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div style={{
              padding: "10px", borderRadius: "12px",
              background: "color-mix(in srgb, var(--accent) 15%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
              boxShadow: "0 0 16px color-mix(in srgb, var(--accent) 20%, transparent)",
              animation: "glow-pulse 3s ease-in-out infinite",
            }}>
              <Bell className="w-5 h-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {t("remindersAndAlerts")}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {t("realTimeNotifications")}
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "#22c55e",
              boxShadow: "0 0 8px #22c55e", display: "inline-block",
              animation: "glow-pulse 2s ease-in-out infinite",
            }} />
            <span className="text-xs font-medium" style={{ color: "#22c55e" }}></span>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 capitalize"
              style={activeTab === tab ? {
                background: "var(--accent)",
                color: "#fff",
                boxShadow: "0 2px 12px color-mix(in srgb, var(--accent) 40%, transparent)",
              } : {
                color: "var(--text-muted)",
                background: "transparent",
              }}
            >
              {tab === "all" ? t("all") : tab === "reminders" ? t("reminders") : t("alerts")}
              {tab !== "all" && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{
                  background: activeTab === tab ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                  color: activeTab === tab ? "#fff" : "var(--text-muted)",
                }}>
                  {reminders.filter(r => r.category === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl p-5 mb-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{
            color: "var(--accent)",
            letterSpacing: "0.12em",
          }}>
            {editingId ? `✏️ ${t("update")}` : `＋ ${t("add")} ${watchedCategory === "alert" ? t("alert") : t("reminder")}`}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-3" noValidate>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <input
                {...register("title")}
                placeholder={`${t("title")} *`}
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.title ? 'border-red-500' : ''}`}
                style={glassInput}
              />
              {errors.title && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.title.message}</p>}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <select
                {...register("category")}
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.category ? 'border-red-500' : ''}`}
                style={glassInput}
              >
                <option value="reminder">📅 {t("reminder")}</option>
                <option value="alert">🚨 {t("alert")}</option>
              </select>
              {errors.category && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.category.message}</p>}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <input
                {...register("date")}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.date ? 'border-red-500' : ''}`}
                style={glassInput}
              />
              {errors.date && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.date.message}</p>}
            </div>

            {/* Time */}
            <div className="flex flex-col gap-1">
              <input
                {...register("time")}
                type="time"
                step="300"
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.time ? 'border-red-500' : ''}`}
                style={glassInput}
              />
              {errors.time && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.time.message}</p>}
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1">
              <select
                {...register("type")}
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.type ? 'border-red-500' : ''}`}
                style={glassInput}
              >
                {["workout", "meal", "goal", "appointment", "medication", "other"].map(tp => (
                  <option key={tp} value={tp}>
                    {t(tp.charAt(0).toUpperCase() + tp.slice(1))}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.type.message}</p>}
            </div>

            {/* Priority (alerts only) */}
            {watchedCategory === "alert" && (
              <div className="flex flex-col gap-1">
                <select
                  {...register("priority")}
                  className={`glass-input w-full px-3 py-2.5 text-sm ${errors.priority ? 'border-red-500' : ''}`}
                  style={glassInput}
                >
                  <option value="low">🟢 {t("lowPriority")}</option>
                  <option value="medium">🟡 {t("mediumPriority")}</option>
                  <option value="high">🔴 {t("highPriority")}</option>
                </select>
                {errors.priority && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.priority.message}</p>}
              </div>
            )}

            {/* Notes */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <input
                {...register("notes")}
                placeholder={`${t("notes")} (${t("optional")})`}
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
                  opacity: saving ? 0.75 : 1,
                }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> :
                 editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {saving ? t("saving") + "…" : editingId ? t("update") :
                  `${t("add")} ${watchedCategory === "alert" ? t("alert") : t("reminder")}`}
              </motion.button>

              {editingId && (
                <motion.button
                  type="button"
                  onClick={() => { reset(); setEditingId(null); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium"
                  style={{
                    ...glassInput,
                    color: "var(--text-primary)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
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
                  {[t("item"), t("dateTime"), t("type"), t("status"), t("actions")].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredReminders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div style={{
                            padding: 16, borderRadius: "50%",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}>
                            <Bell className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                          </div>
                          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            {t("noItemsFound", { type: activeTab === "all" ? t("items") : t(activeTab) })}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredReminders.map((r, i) => (
                    <motion.tr
                      key={r._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: r.isActive ? 1 : 0.45, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className="row-hover"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      {/* Item */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${getCategoryStyle(r.category)}`}
                            style={{ backdropFilter: "blur(8px)" }}>
                            {getIcon(r)}
                          </div>
                          <div>
                            <div className="font-medium text-sm flex items-center gap-2"
                              style={{ color: "var(--text-primary)" }}>
                              {r.title}
                              {r.category === "alert" && (
                                <span className={`px-2 py-0.5 rounded-full text-xs border ${getPriorityColor(r.priority)}`}>
                                  {t(r.priority + "Priority")}
                                </span>
                              )}
                            </div>
                            {r.notes && (
                              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{r.notes}</div>
                            )}
                            <span className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${getCategoryStyle(r.category)}`}>
                              {r.category === "alert" ? `🚨 ${t("alert")}` : `⏰ ${t("reminder")}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date/Time */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {new Date(r.date).toLocaleDateString()}
                          </span>
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {new Date(r.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </td>

                      {/* Type badge */}
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                          style={{
                            background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                            color: "var(--accent)",
                            border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                          }}>
                          {t(r.type)}
                        </span>
                      </td>

                      {/* Toggle status */}
                      <td className="px-5 py-4">
                        <button onClick={() => toggleActive(r._id, r.isActive)}
                          className="flex items-center gap-2 transition-all duration-200">
                          {r.isActive ? (
                            <ToggleRight className="w-6 h-6" style={{ color: "var(--accent)", filter: "drop-shadow(0 0 4px var(--accent))" }} />
                          ) : (
                            <ToggleLeft className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                          )}
                          <span className="text-xs font-medium" style={{
                            color: r.isActive ? "var(--accent)" : "var(--text-muted)",
                          }}>
                            {r.isActive ? t("active") : t("inactive")}
                          </span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5">
                          <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                            onClick={() => startEdit(r)}
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
                            onClick={() => del(r._id)}
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
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
}
