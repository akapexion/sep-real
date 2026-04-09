import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

// ── Injected styles ────────────────────────────────────────────────────────
const heroStyles = `
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-18px) rotate(2deg); }
  }
  @keyframes float-orb {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.08); }
    66%       { transform: translate(-20px, 15px) scale(0.95); }
  }
  @keyframes shimmer-line {
    0%   { opacity: 0; transform: scaleX(0); }
    50%  { opacity: 1; }
    100% { opacity: 0; transform: scaleX(1); }
  }
  @keyframes badge-glow {
    0%, 100% { box-shadow: 0 0 10px color-mix(in srgb, var(--accent) 30%, transparent); }
    50%       { box-shadow: 0 0 22px color-mix(in srgb, var(--accent) 55%, transparent); }
  }
  @keyframes grid-fade {
    0%   { opacity: 0.03; }
    50%  { opacity: 0.06; }
    100% { opacity: 0.03; }
  }
  .hero-btn-primary:hover {
    box-shadow: 0 0 32px color-mix(in srgb, var(--accent) 60%, transparent) !important;
    transform: scale(1.05);
  }
  .hero-btn-outline:hover {
    background: color-mix(in srgb, var(--accent) 10%, transparent) !important;
    transform: scale(1.05);
  }
  .stat-chip:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, transparent) !important;
    background: color-mix(in srgb, var(--accent) 10%, transparent) !important;
    transform: translateY(-2px);
  }
`;

// ── Stat chip data ─────────────────────────────────────────────────────────
const STATS = [
  { icon: Zap,        label: "Workouts Logged",   value: "10K+" },
  { icon: Target,     label: "Goals Achieved",    value: "94%"  },
  { icon: TrendingUp, label: "Progress Tracked",  value: "Daily" },
];

const HeroSection = () => {
  return (
    <>
      <style>{heroStyles}</style>

      <section className="min-h-screen font-[Michroma] flex flex-col relative overflow-hidden transition-colors duration-300">

        {/* ── Deep layered background ────────────────────────────────────── */}
        <div className="absolute inset-0 -z-20"
          style={{ background: 'radial-gradient(ellipse 120% 80% at 60% 40%, rgba(34,211,238,0.07) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 20% 80%, rgba(59,130,246,0.06) 0%, transparent 55%), var(--bg-primary, #0a0a0a)' }} />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'grid-fade 6s ease-in-out infinite',
        }} />

        {/* ── Floating orbs ─────────────────────────────────────────────── */}
        <div className="absolute -z-10" style={{
          top: '12%', left: '8%', width: 320, height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float-orb 10s ease-in-out infinite',
        }} />
        <div className="absolute -z-10" style={{
          bottom: '10%', right: '6%', width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float-orb 13s ease-in-out infinite reverse',
        }} />
        <div className="absolute -z-10" style={{
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animation: 'float-orb 18s ease-in-out infinite',
        }} />

        {/* ── Main grid layout ──────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-col lg:grid lg:grid-cols-2 items-center justify-center min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 gap-10 py-16 lg:py-24 text-center lg:text-left">

          {/* ── Left: Text content ─────────────────────────────────────── */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center lg:items-start"
          >
            {/* ── Brand badge ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex items-center gap-2.5 mb-5 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
                animation: 'badge-glow 3s ease-in-out infinite',
                color: 'var(--accent)',
              }}
            >
              <Dumbbell className="w-4 h-4" />
              <span className="uppercase tracking-widest text-xs font-semibold">
                Track. Train. Transform.
              </span>
            </motion.div>

            {/* ── Headline ── */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[55px] font-bold leading-tight mb-5"
            >
              Push Your{" "}
              <span className="relative inline-block font-extrabold" style={{ color: 'var(--accent)' }}>
                Limits
                {/* Shimmer underline */}
                <span style={{
                  position: 'absolute', bottom: -4, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                  borderRadius: 2,
                  animation: 'shimmer-line 3s ease-in-out infinite',
                }} />
              </span>{" "}
              —{" "}
              <br className="hidden lg:block" />
              Transform Your Life.
            </motion.h1>

            {/* ── Subtext ── */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-base sm:text-lg max-w-lg leading-relaxed mb-8"
              style={{ color: 'var(--text-secondary)' }}
            >
              Monitor your workouts, log your nutrition, and visualize your progress.{" "}
              <span className="font-bold" style={{ color: 'var(--accent)' }}>FitTrack</span>{" "}
              gives you the power to stay consistent and reach your goals.
            </motion.p>

            {/* ── CTA Buttons ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start mb-8"
            >
              {/* Primary CTA */}
              <Link to="/login">
                <button
                  className="hero-btn-primary flex items-center justify-center gap-2 px-8 py-3 rounded-full text-black font-bold transition-all w-full sm:w-auto"
                  style={{
                    background: 'var(--accent)',
                    boxShadow: '0 0 20px color-mix(in srgb, var(--accent) 40%, transparent)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              {/* Outline CTA — glassmorphism */}
              <Link to="/about">
                <button
                  className="hero-btn-outline flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold transition-all w-full sm:w-auto"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)',
                    color: 'var(--accent)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  Learn More
                </button>
              </Link>
            </motion.div>

            {/* ── Stat chips ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              {STATS.map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="stat-chip flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    {value}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Hero image with glass frame ────────────────────── */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:flex justify-center items-center relative"
          >
            {/* Outer glass ring */}
            <div style={{
              position: 'absolute',
              inset: -24,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.015)',
              backdropFilter: 'blur(2px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 0 80px color-mix(in srgb, var(--accent) 10%, transparent)',
            }} />

            {/* Inner glass frame behind image */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '40% 60% 55% 45% / 45% 40% 60% 55%',
              background: 'rgba(34,211,238,0.04)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(34,211,238,0.10)',
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.06), 0 0 60px rgba(34,211,238,0.08)',
            }} />

            {/* Floating image */}
            <img
              src="b1.png"
              alt="Fitness Workout"
              className="relative"
              style={{
                width: 'clamp(250px, 35vw, 500px)',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 30px rgba(34,211,238,0.35)) drop-shadow(0 0 60px rgba(34,211,238,0.15))',
                animation: 'float-slow 6s ease-in-out infinite',
                zIndex: 1,
              }}
            />

            {/* Corner accent chips */}
            {[
              { top: '10%', right: '-4%',  label: '🔥 On Streak', delay: 0.8 },
              { bottom: '12%', left: '-6%', label: '✅ Goal Hit',  delay: 1.0 },
            ].map(({ label, delay, ...pos }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay, duration: 0.4 }}
                style={{
                  position: 'absolute', ...pos, zIndex: 2,
                  padding: '6px 14px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default HeroSection;