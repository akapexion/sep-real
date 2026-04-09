import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Zap, Bell, ArrowRight } from "lucide-react";

// ── Injected styles (mirrors HeroSection / Footer pattern) ────────────────
const comingSoonStyles = `
  @keyframes float-orb {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.08); }
    66%       { transform: translate(-20px, 15px) scale(0.95); }
  }
  @keyframes grid-fade {
    0%   { opacity: 0.03; }
    50%  { opacity: 0.06; }
    100% { opacity: 0.03; }
  }
  @keyframes badge-glow {
    0%, 100% { box-shadow: 0 0 10px color-mix(in srgb, var(--accent) 30%, transparent); }
    50%       { box-shadow: 0 0 22px color-mix(in srgb, var(--accent) 55%, transparent); }
  }
  @keyframes shimmer-line {
    0%   { opacity: 0; transform: scaleX(0); }
    50%  { opacity: 1; }
    100% { opacity: 0; transform: scaleX(1); }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes bottom-bar-slide {
    0%   { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  @keyframes count-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.6; }
  }
  .cs-notify-btn:hover {
    box-shadow: 0 0 32px color-mix(in srgb, var(--accent) 60%, transparent) !important;
    transform: scale(1.05);
  }
  .cs-input:focus {
    outline: none;
    border-color: color-mix(in srgb, var(--accent) 50%, transparent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent) !important;
  }
  .cs-feature-chip:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, transparent) !important;
    background: color-mix(in srgb, var(--accent) 10%, transparent) !important;
    transform: translateY(-2px);
  }
`;

// ── Countdown target ───────────────────────────────────────────────────────
const TARGET = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

function getTimeLeft() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  return {
    days:  Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins:  Math.floor((diff / (1000 * 60)) % 60),
    secs:  Math.floor((diff / 1000) % 60),
  };
}

const FEATURES = [
  { icon: Zap,       label: "Smart Workouts"   },
  { icon: Dumbbell,  label: "Progress Tracking" },
  { icon: Bell,      label: "Daily Reminders"   },
];

const ComingSoon = () => {
  const [time, setTime]   = useState(getTimeLeft());
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleNotify = () => {
    if (email.trim()) setSent(true);
  };

  return (
    <>
      <style>{comingSoonStyles}</style>

      <div
        className="relative overflow-hidden font-[Michroma] min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300"
        style={{ background: "var(--bg-primary, #0a0a0a)" }}
      >

        {/* ── Deep layered background (same as Hero/Footer) ─────────── */}
        <div
          className="absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 60% 40%, rgba(34,211,238,0.07) 0%, transparent 60%)," +
              "radial-gradient(ellipse 80% 60% at 20% 80%, rgba(59,130,246,0.06) 0%, transparent 55%)," +
              "var(--bg-primary, #0a0a0a)",
          }}
        />

        {/* Animated grid (same as Hero/Footer) */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            animation: "grid-fade 6s ease-in-out infinite",
          }}
        />

        {/* ── Floating orbs (same as Hero/Footer) ──────────────────── */}
        <div className="absolute -z-10" style={{ top: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)", filter: "blur(40px)", animation: "float-orb 10s ease-in-out infinite" }} />
        <div className="absolute -z-10" style={{ bottom: "8%", right: "5%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)", filter: "blur(50px)", animation: "float-orb 13s ease-in-out infinite reverse" }} />
        <div className="absolute -z-10" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 65%)", filter: "blur(60px)", animation: "float-orb 18s ease-in-out infinite" }} />

        {/* ── Main content ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full"
        >

          {/* Floating logo — same glass style as Footer */}
          <motion.div
            className="inline-flex items-center justify-center mb-6 p-4 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
              boxShadow: "0 8px 32px color-mix(in srgb, var(--accent) 15%, transparent), inset 0 1px 0 rgba(255,255,255,0.1)",
              animation: "float-slow 4s ease-in-out infinite",
            }}
          >
            <Dumbbell className="w-8 h-8" style={{ color: "var(--accent)" }} />
          </motion.div>

          {/* Brand badge — same as Hero/Footer badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 mb-5 px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
              animation: "badge-glow 3s ease-in-out infinite",
              color: "var(--accent)",
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-xs font-semibold">
              Something Big Is Coming
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4"
          >
            <span style={{ color: "var(--text-primary, #ffffff)" }}>We're </span>
            <span
              className="relative inline-block font-extrabold"
              style={{ color: "var(--accent)" }}
            >
              Launching
              {/* Shimmer underline — same as Hero */}
              <span style={{
                position: "absolute", bottom: -4, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                borderRadius: 2,
                animation: "shimmer-line 3s ease-in-out infinite",
              }} />
            </span>
            <span style={{ color: "var(--text-primary, #ffffff)" }}> Soon.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-base sm:text-lg max-w-lg leading-relaxed mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            We're working hard to bring something amazing.{" "}
            <span className="font-bold" style={{ color: "var(--accent)" }}>FitTrack</span>{" "}
            is almost ready — stay tuned and be the first to know.
          </motion.p>

          {/* ── Countdown — glass chips ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.6 }}
            className="flex gap-3 sm:gap-4 mb-10"
          >
            {[
              { val: time.days,  label: "Days"    },
              { val: time.hours, label: "Hours"   },
              { val: time.mins,  label: "Minutes" },
              { val: time.secs,  label: "Seconds" },
            ].map(({ val, label }) => (
              <div
                key={label}
                className="flex flex-col items-center px-4 py-3 sm:px-5 sm:py-4 rounded-2xl min-w-[64px] sm:min-w-[76px]"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                }}
              >
                <span
                  className="text-2xl sm:text-3xl font-bold tabular-nums"
                  style={{
                    color: "var(--accent)",
                    animation: label === "Seconds" ? "count-pulse 1s ease-in-out infinite" : "none",
                  }}
                >
                  {String(val).padStart(2, "0")}
                </span>
                <span className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* ── Feature chips — same stat-chip pattern as Hero/Footer ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap gap-3 justify-center mb-10"
          >
            {FEATURES.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.54 + i * 0.08 }}
                className="cs-feature-chip flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-default"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--text-primary, #fff)" }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Notify me — glass input + primary CTA btn ──────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-full max-w-md"
          >
            {sent ? (
              <div
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
                  color: "var(--accent)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <Bell className="w-4 h-4" />
                <span>You're on the list — we'll notify you!</span>
              </div>
            ) : (
              <div
                className="flex flex-col sm:flex-row gap-3"
              >
                {/* Glass input — matches Hero outline btn style */}
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                  className="cs-input flex-1 px-5 py-3 rounded-full text-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    color: "var(--text-primary, #fff)",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                />
                {/* Primary CTA — same as Hero primary btn */}
                <button
                  onClick={handleNotify}
                  className="cs-notify-btn flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
                  style={{
                    background: "var(--accent)",
                    color: "#000",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 0 20px color-mix(in srgb, var(--accent) 40%, transparent)",
                    transition: "all 0.25s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  Notify Me <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Divider — same shimmer gradient as Footer */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 1.5, ease: "easeInOut" }}
            style={{
              margin: "40px auto 16px",
              width: 200, height: 1,
              background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 60%, transparent), transparent)",
              originX: 0.5,
            }}
          />

          {/* Brand name */}
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} FitTrack. All rights reserved.
          </p>
        </motion.div>

        {/* ── Bottom glow bar (same as Hero/Footer) ─────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 3,
            background: "linear-gradient(90deg, var(--accent), #3b82f6, #facc15, var(--accent))",
            backgroundSize: "200%",
            animation: "bottom-bar-slide 4s linear infinite",
          }}
        />
      </div>
    </>
  );
};

export default ComingSoon;