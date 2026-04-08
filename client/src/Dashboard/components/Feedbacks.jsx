// src/Dashboard/components/Feedbacks.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { MessageSquare, Star, Loader2, User } from "lucide-react";

const API_BASE = "http://localhost:3000";

// ── Glassmorphism shared styles ──────────────────────────────────────────────
const glassCard = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
};

const sharedStyles = `
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }
  .fb-card:hover {
    background: rgba(255,255,255,0.06) !important;
    border-color: rgba(255,255,255,0.14) !important;
    transition: background 0.2s ease, border-color 0.2s ease;
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

// Renders 5 stars — filled/half/empty based on rating
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          style={{
            color:  i <= rating ? "#facc15" : "rgba(255,255,255,0.15)",
            fill:   i <= rating ? "#facc15" : "transparent",
            filter: i <= rating ? "drop-shadow(0 0 4px rgba(250,204,21,0.6))" : "none",
          }}
        />
      ))}
    </div>
  );
}

// Rating badge color — green ≥4, yellow =3, red <3
function getRatingStyle(rating) {
  if (rating >= 4) return { color: "#4ade80", bg: "rgba(74,222,128,0.10)",  border: "rgba(74,222,128,0.25)"  };
  if (rating >= 3) return { color: "#facc15", bg: "rgba(250,204,21,0.10)",  border: "rgba(250,204,21,0.25)"  };
  return             { color: "#f87171", bg: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.25)"   };
}

// Initials avatar from name
function Avatar({ name }) {
  const initials = name
    ?.split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{
        width: 38, height: 38, borderRadius: "10px",
        background: "color-mix(in srgb, var(--accent) 18%, transparent)",
        border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
        color: "var(--accent)",
        boxShadow: "0 0 10px color-mix(in srgb, var(--accent) 15%, transparent)",
      }}>
      {initials}
    </div>
  );
}

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await axios.get(`${API_BASE}/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(res.data.feedback);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) / feedbacks.length).toFixed(1)
    : null;

  // ── Loading ────────────────────────────────────────────────────────────────
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
              <MessageSquare className="w-5 h-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                User Feedbacks
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {feedbacks.length} response{feedbacks.length !== 1 ? "s" : ""} collected
              </p>
            </div>
          </div>

          {/* Average rating pill */}
          {avgRating && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
              background: "rgba(250,204,21,0.10)",
              border: "1px solid rgba(250,204,21,0.25)",
            }}>
              <Star className="w-3.5 h-3.5" style={{ color: "#facc15", fill: "#facc15" }} />
              <span className="text-xs font-semibold" style={{ color: "#facc15" }}>
                {avgRating} avg
              </span>
            </div>
          )}
        </div>

        {/* ── Empty state ── */}
        {feedbacks.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div style={{
              padding: 16, borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <MessageSquare className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No feedbacks yet.
            </p>
          </div>
        ) : (

          /* ── Feedback cards grid ── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {feedbacks.map((fb, i) => {
                const rs = getRatingStyle(fb.rating);
                return (
                  <motion.div
                    key={fb._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.05, duration: 0.28 }}
                    className="fb-card rounded-xl p-4 flex flex-col gap-3"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      cursor: "default",
                    }}
                  >
                    {/* Top row — avatar + name + rating badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={fb.name} />
                        <div>
                          <p className="text-sm font-semibold leading-tight"
                            style={{ color: "var(--text-primary)" }}>
                            {fb.name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {fb.email}
                          </p>
                        </div>
                      </div>

                      {/* Rating badge */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            color: rs.color,
                            background: rs.bg,
                            border: `1px solid ${rs.border}`,
                          }}>
                          {fb.rating}/5
                        </span>
                        <StarRating rating={fb.rating} />
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

                    {/* Message */}
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      "{fb.message}"
                    </p>

                    {/* Date */}
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {new Date(fb.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </>
  );
}