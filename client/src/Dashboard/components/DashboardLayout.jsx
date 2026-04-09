// src/Dashboard/components/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Weight } from "lucide-react";
import Navbar from "../pages/Navbar";
import Sidebar from "../pages/Sidebar";
import { usePreferencesContext } from "../pages/PreferencesContext";

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

const layoutStyles = `
  .weight-input:focus {
    outline: none;
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    background: rgba(255,255,255,0.08) !important;
  }
  .weight-input::placeholder { color: rgba(255,255,255,0.3); }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }

  @keyframes modal-backdrop-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Subtle animated background grid */
  .dashboard-bg::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

const DashboardLayout = ({ user, logout, updateUser }) => {
  const { preferences, updatePreferences } = usePreferencesContext();
  const [isDark, setIsDark]                 = useState(true);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightInput, setWeightInput]       = useState("");
  const [isSavingWeight, setIsSavingWeight] = useState(false);

  useEffect(() => {
    if (user && user.currentWeight === null) setShowWeightModal(true);
  }, [user]);

  useEffect(() => {
    if (preferences) {
      setIsDark(preferences.theme === "dark");
      document.documentElement.setAttribute("data-theme", preferences.theme);
    } else {
      const saved       = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial     = saved ? saved === "dark" : prefersDark;
      setIsDark(initial);
      document.documentElement.setAttribute("data-theme", initial ? "dark" : "light");
    }
  }, [preferences]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const theme = newTheme ? "dark" : "light";
    if (preferences) {
      updatePreferences({ ...preferences, theme });
    } else {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  };

  const handleSaveWeight = async () => {
    if (!weightInput || isNaN(weightInput))
      return toast.error("Please enter a valid weight");
    setIsSavingWeight(true);
    try {
      const res = await axios.post("http://localhost:3000/profile/weight", {
        userId: user._id,
        currentWeight: Number(weightInput),
      });
      const updated = { ...user, currentWeight: res.data.currentWeight };
      localStorage.setItem("user", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("profile-updated", { detail: updated }));
      if (updateUser) updateUser(updated);
      setShowWeightModal(false);
      toast.success("Weight saved!");
    } catch {
      toast.error("Failed to save weight.");
    } finally {
      setIsSavingWeight(false);
    }
  };

  return (
    <>
      <style>{layoutStyles}</style>

      <div
        className="dashboard-bg flex min-h-screen relative"
        style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        

        {/* ── Weight Onboarding Modal ── */}
        <AnimatePresence>
          {showWeightModal && (
            <motion.div
              key="weight-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[100] flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
            >
              <motion.div
                key="weight-modal-card"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-sm mx-4 rounded-2xl overflow-hidden"
                style={{ ...glassCard, padding: "2rem" }}
              >
                {/* Modal header */}
                <div className="flex flex-col items-center gap-3 mb-6">
                  <div style={{
                    padding: "14px", borderRadius: "16px",
                    background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                    boxShadow: "0 0 24px color-mix(in srgb, var(--accent) 25%, transparent)",
                    animation: "glow-pulse 3s ease-in-out infinite",
                  }}>
                    <Weight className="w-7 h-7" style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                      Welcome to{" "}
                      <span style={{
                        background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #fff))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>
                        FitTrack!
                      </span>
                    </h2>
                    <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                      We just need your current weight to personalise your dashboard.
                    </p>
                  </div>
                </div>

                {/* Inner form panel */}
                <div className="rounded-xl p-4 mb-4" style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: "var(--accent)", letterSpacing: "0.12em" }}>
                    Your current weight
                  </p>
                  <input
                    type="number"
                    placeholder="define in k.g's"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveWeight()}
                    className="weight-input w-full px-3 py-2.5 text-sm text-center"
                    style={glassInput}
                  />
                </div>

                {/* CTA button */}
                <motion.button
                  onClick={handleSaveWeight}
                  disabled={isSavingWeight}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))",
                    boxShadow: "0 4px 16px color-mix(in srgb, var(--accent) 35%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
                    opacity: isSavingWeight ? 0.7 : 1,
                    cursor: isSavingWeight ? "not-allowed" : "pointer",
                  }}
                >
                  {isSavingWeight
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                    : "Let's Go!"}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── App Shell ── */}
        <Sidebar user={user} logout={logout} />

        <div className="flex-1 flex flex-col min-h-screen relative z-10">
          <Navbar
            logout={logout}
            user={user}
            toggleTheme={toggleTheme}
            isDark={isDark}
          />

          {/* ── Dashboard Header Banner ── */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="px-6 py-4 flex items-center gap-3"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {/* Accent bar */}
            <div style={{
              width: 4, height: 28, borderRadius: 99,
              background: "linear-gradient(180deg, var(--accent), color-mix(in srgb, var(--accent) 40%, transparent))",
              boxShadow: "0 0 10px color-mix(in srgb, var(--accent) 50%, transparent)",
              flexShrink: 0,
            }} />
            <div>
              <h1
                className="text-xl font-extrabold tracking-widest uppercase"
                style={{
                  background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #fff))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.18em",
                }}
              >
                TRACK YOUR JOURNEY
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </motion.header>

          {/* ── Page Content ── */}
          <main className="flex-1 p-6 overflow-auto relative z-10">
            <Outlet context={{ user, updateUser }} />
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;