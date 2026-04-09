import React from "react";
import { motion } from "framer-motion";
import { Target, Rocket, HeartPulse, Dumbbell, Users, Sparkles } from "lucide-react";

// ── Injected styles ────────────────────────────────────────────────────────
const missionStyles = `
  @keyframes orb-drift-slow {
    0%, 100% { transform: translate(0, 0) scale(1); }
    40%       { transform: translate(50px, -40px) scale(1.1); }
    70%       { transform: translate(-30px, 25px) scale(0.93); }
  }
  @keyframes border-glow {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }
  @keyframes shimmer-sweep {
    0%   { transform: translateX(-120%); }
    100% { transform: translateX(220%); }
  }
  @keyframes tag-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 25%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 50%, transparent); }
  }

  .mv-card {
    transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
    position: relative;
    overflow: hidden;
  }
  .mv-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 24px 64px rgba(0,0,0,0.35),
                inset 0 1px 0 rgba(255,255,255,0.12) !important;
  }
  .mv-card:hover .mv-shimmer { animation: shimmer-sweep 0.75s ease forwards; }
  .mv-card:hover .mv-ambient { opacity: 1 !important; }

  .feature-tag {
    transition: all 0.2s ease;
  }
  .feature-tag:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--accent) 55%, transparent) !important;
    background: color-mix(in srgb, var(--accent) 12%, transparent) !important;
  }
`;

// ── Card data ──────────────────────────────────────────────────────────────
const cards = [
  {
    icon: Target,
    color: "var(--accent)",
    title: "Our Mission",
    desc: "Empower every fitness enthusiast to track, improve, and achieve through a seamless digital experience driven by data and passion.",
    stat: "Purpose-driven",
  },
  {
    icon: Rocket,
    color: "#38bdf8",
    title: "Our Vision",
    desc: "To revolutionize health tracking globally by integrating motivation, technology, and analytics into one powerful fitness ecosystem.",
    stat: "Future-focused",
  },
  {
    icon: HeartPulse,
    color: "#f87171",
    title: "Core Values",
    desc: "Consistency, strength, and self-discipline — we believe real transformation happens when passion meets persistence.",
    stat: "Community-first",
  },
];

const featureTags = [
  { icon: Dumbbell,   color: "var(--accent)", label: "Smart Workout Tracking" },
  { icon: Users,      color: "#38bdf8",       label: "Community Support"       },
  { icon: HeartPulse, color: "#f87171",       label: "Health Insights"         },
];

const MissionVision = () => {
  return (
    <>
      <style>{missionStyles}</style>

      <section className="relative py-28 text-white font-[Michroma] overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1594737625785-c0f4f5d6b95a?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* ── Deep overlay ──────────────────────────────────────────────── */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(5,10,20,0.92) 100%)', backdropFilter: 'blur(2px)' }} />

        {/* ── Animated grid ─────────────────────────────────────────────── */}
        <div className="absolute inset-0 -z-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }} />

        {/* ── Drifting orbs ─────────────────────────────────────────────── */}
        {[
          { top: '5%',  left: '5%',  size: 300, color: 'rgba(34,211,238,0.09)',  dur: '14s' },
          { bottom: '5%', right: '4%', size: 380, color: 'rgba(59,130,246,0.08)', dur: '18s' },
          { top: '45%', left: '42%', size: 250, color: 'rgba(34,211,238,0.05)',  dur: '22s' },
        ].map((orb, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{
            top: orb.top, bottom: orb.bottom, left: orb.left, right: orb.right,
            width: orb.size, height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(48px)',
            animation: `orb-drift-slow ${orb.dur} ease-in-out infinite`,
            animationDelay: `${i * 3.5}s`,
          }} />
        ))}

        {/* ── Content ────────────────────────────────────────────────────── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">

          {/* Section pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
              color: 'var(--accent)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              animation: 'tag-pulse 3s ease-in-out infinite',
            }}
          >
            <Sparkles className="w-3 h-3" />
            Who We Are
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold mb-5"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, #38bdf8 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Our Mission & Vision
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-2xl mx-auto text-sm md:text-base mb-16 leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            We're building more than just a fitness app — we're creating a community where
            technology meets passion, helping every individual push boundaries and track real progress.
          </motion.p>

          {/* ── Three cards ───────────────────────────────────────────────── */}
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="mv-card rounded-3xl p-8 flex flex-col items-center text-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid color-mix(in srgb, ${card.color} 25%, rgba(255,255,255,0.07))`,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.07)`,
                  }}
                >
                  {/* Shimmer on hover */}
                  <div className="mv-shimmer" style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                    transform: 'translateX(-120%)',
                  }} />

                  {/* Ambient glow */}
                  <div className="mv-ambient" style={{
                    position: 'absolute', inset: 0, borderRadius: '1.5rem', pointerEvents: 'none',
                    background: `radial-gradient(circle at 50% 0%, color-mix(in srgb, ${card.color} 10%, transparent), transparent 65%)`,
                    opacity: 0, transition: 'opacity 0.35s ease',
                  }} />

                  {/* Icon */}
                  <div className="relative mb-5 p-4 rounded-2xl" style={{
                    background: `color-mix(in srgb, ${card.color} 10%, rgba(255,255,255,0.03))`,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: `1px solid color-mix(in srgb, ${card.color} 25%, rgba(255,255,255,0.06))`,
                    boxShadow: `0 0 24px color-mix(in srgb, ${card.color} 20%, transparent)`,
                  }}>
                    <Icon className="w-10 h-10" style={{ color: card.color }} />
                  </div>

                  <h3 className="text-xl font-bold mb-3" style={{ color: card.color }}>
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                    {card.desc}
                  </p>

                  {/* Stat chip */}
                  <div className="mt-auto px-3 py-1.5 rounded-lg text-xs font-semibold" style={{
                    background: `color-mix(in srgb, ${card.color} 10%, rgba(255,255,255,0.03))`,
                    border: `1px solid color-mix(in srgb, ${card.color} 22%, transparent)`,
                    color: card.color,
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                  }}>
                    {card.stat}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Second row ────────────────────────────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-12 mt-24 items-center text-left">

            {/* Left: image with glass frame */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 0 0 1px rgba(34,211,238,0.12), 0 24px 64px rgba(0,0,0,0.4)',
              }}
            >
              {/* Glass overlay on image */}
              <div style={{
                position: 'absolute', inset: 0, zIndex: 1,
                background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%)',
                pointerEvents: 'none',
              }} />
              {/* Accent border glow */}
              <div style={{
                position: 'absolute', inset: 0, zIndex: 2, borderRadius: '1.5rem',
                border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                pointerEvents: 'none',
                animation: 'border-glow 3s ease-in-out infinite',
              }} />
              <img
                src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1600&q=80"
                alt="Fitness Motivation"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {/* Right: text content */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-5"
            >
              {/* Glass text card */}
              <div className="rounded-2xl p-6" style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
              }}>
                <h3 className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ color: 'var(--accent)' }}>
                  We Believe in Progress, Not Perfection
                </h3>
                <p className="leading-relaxed text-sm md:text-base"
                  style={{ color: 'var(--text-muted)' }}>
                  Every step counts. Whether it's a 5-minute jog or a full workout session —
                  consistency is what makes you stronger. FitTrack is your daily motivation
                  partner — tracking your effort, your nutrition, and your evolution.
                </p>
              </div>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-3 pt-1">
                {featureTags.map(({ icon: Icon, color, label }) => (
                  <div
                    key={label}
                    className="feature-tag flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                    style={{
                      background: `color-mix(in srgb, ${color} 8%, rgba(255,255,255,0.03))`,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `1px solid color-mix(in srgb, ${color} 22%, rgba(255,255,255,0.07))`,
                      color,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MissionVision;