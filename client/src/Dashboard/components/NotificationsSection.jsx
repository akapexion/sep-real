// src/Dashboard/components/NotificationsSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Trash2, CheckCircle, Bell, AlertTriangle, Target, Clock } from "lucide-react";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";
import toast, { Toaster } from "react-hot-toast";
import { useLanguage } from "../pages/UseLanguage";

const API_BASE = "http://localhost:3000";

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
  .row-hover:hover {
    background: rgba(255,255,255,0.04) !important;
    transition: background 0.2s ease;
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_ICON = {
  reminder: <Clock className="w-3.5 h-3.5" />,
  alert:    <AlertTriangle className="w-3.5 h-3.5" />,
  goal:     <Target className="w-3.5 h-3.5" />,
};

const TYPE_STYLE = {
  reminder: "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/25",
  alert:    "text-red-400 bg-red-500/10 border-red-500/25",
  goal:     "text-green-400 bg-green-500/10 border-green-500/25",
};

export default function NotificationsSection() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeTab, setActiveTab]         = useState("all");

  const user   = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const { t }  = useLanguage();

  const fetchNotifications = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const res = await axios.get(`${API_BASE}/notifications?userId=${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("GET /notifications error:", err.response?.data || err);
      toast.error(t("failedToLoadNotifications"));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  const markAsRead = async (id) => {
    try {
      await axios.post(`${API_BASE}/notifications/${id}`, { userId });
      fetchNotifications();
      toast.success(t("markedAsRead"));
    } catch (err) {
      console.error("Mark read error:", err);
      toast.error(t("failedToMarkAsRead"));
    }
  };

  const deleteNotification = (id) => {
    showDeleteConfirm({
      message: t("deleteNotificationConfirmation"),
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE}/notifications/${id}?userId=${userId}`);
          toast.success(t("deleteSuccessfully"));
          fetchNotifications();
        } catch {
          toast.error(t("unableToDelete"));
        }
      },
    });
  };

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // ── Derived counts ────────────────────────────────────────────────────────
  const tabs = ["all", "unread", "reminder", "alert"];

  const getCount = (tab) => {
    if (tab === "all")    return notifications.length;
    if (tab === "unread") return notifications.filter(n => !n.isRead).length;
    return notifications.filter(n => n.type === tab).length;
  };

  const filtered = notifications.filter(n => {
    if (activeTab === "all")    return true;
    if (activeTab === "unread") return !n.isRead;
    return n.type === activeTab;
  });
  // ─────────────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div style={{ position: "relative" }}>
        <Bell className="w-10 h-10 animate-spin" style={{ color: "var(--accent)" }} />
        <div style={{
          position: "absolute", inset: "-6px", borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)",
          animation: "glow-pulse 2s ease-in-out infinite",
        }} />
      </div>
    </div>
  );

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
              <Bell className="w-5 h-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {t("notifications")}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {t("activityAlertsAndUpdates")}
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
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 capitalize flex items-center justify-center gap-1.5"
              style={activeTab === tab ? {
                background: "var(--accent)",
                color: "#fff",
                boxShadow: "0 2px 12px color-mix(in srgb, var(--accent) 40%, transparent)",
              } : {
                color: "var(--text-muted)",
                background: "transparent",
              }}
            >
              {tab === "all"    ? t("all")
               : tab === "unread"   ? t("unread")
               : tab === "reminder" ? t("reminders")
               : t("alerts")}
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{
                background: activeTab === tab ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                color: activeTab === tab ? "#fff" : "var(--text-muted)",
              }}>
                {getCount(tab)}
              </span>
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="rounded-xl overflow-hidden" style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
        }}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {[t("type"), t("message"), t("date"), t("actions")].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div style={{
                            padding: 16, borderRadius: "50%",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}>
                            <Bell className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                          </div>
                          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            {t("noNotificationsFound")}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((notif, i) => (
                    <motion.tr
                      key={notif._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: notif.isRead ? 0.45 : 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className="row-hover"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      {/* Type */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${TYPE_STYLE[notif.type] || "text-gray-400 bg-gray-500/10 border-gray-500/25"}`}>
                          {TYPE_ICON[notif.type] ?? <Bell className="w-3.5 h-3.5" />}
                          {t(notif.type)}
                        </span>
                      </td>

                      {/* Message */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          {!notif.isRead && (
                            <span style={{
                              width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                              background: "var(--accent)",
                              boxShadow: "0 0 6px color-mix(in srgb, var(--accent) 60%, transparent)",
                            }} />
                          )}
                          <span className="text-sm" style={{ color: "var(--text-primary)", lineHeight: 1.45 }}>
                            {notif.message}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {new Date(notif.date).toLocaleDateString()}
                          </span>
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {new Date(notif.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5">
                          {!notif.isRead && (
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                              onClick={() => markAsRead(notif._id)}
                              className="p-2 rounded-lg transition-all"
                              style={{
                                background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                                border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                              }}
                              title={t("markAsRead")}
                            >
                              <CheckCircle className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                            onClick={() => deleteNotification(notif._id)}
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