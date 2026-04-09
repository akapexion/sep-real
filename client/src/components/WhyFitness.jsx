import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, HeartPulse, Activity, Flame } from "lucide-react";

// ── Injected styles ────────────────────────────────────────────────────────
const whyStyles = `
  @keyframes orb-drift {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
    33%       { transform: translate(40px, -30px) scale(1.1); opacity: 1; }
    66%       { transform: translate(-25px, 20px) scale(0.92); opacity: 0.6; }
  }
  @keyframes card-glow-pulse {
    0%, 100% { opacity: 0; }
    50%       { opacity: 1; }
  }
  @keyframes icon-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-5px); }
  }
  @keyframes shimmer-sweep {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  .feature-card {
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    position: relative;
  }
  .feature-card:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: color-mix(in srgb, var(--accent) 50%, transparent) !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25),
                0 0 40px color-mix(in srgb, var(--accent) 12%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.12) !important;
  }
  .feature-card:hover .card-top-shimmer {
    animation: shimmer-sweep 0.7s ease forwards;
  }
  .feature-card:hover .icon-wrap {
    animation: icon-float 2s ease-in-out infinite;
  }
  .feature-card:hover .card-ambient {
    opacity: 1 !important;
  }
`;

const features = [
  {
    icon: Dumbbell,
    color: "var(--accent)",
    title: "Build Strength",
    desc: "Enhance endurance, power, and confidence through consistent workouts.",
    stat: "+40% Strength",
  },
  {
    icon: HeartPulse,
    color: "#38bdf8",
    title: "Improve Health",
    desc: "Boost your cardiovascular fitness and achieve better overall wellbeing.",
    stat: "♥ 72 BPM avg",
  },
  {
    icon: Activity,
    color: "#f87171",
    title: "Stay Consistent",
    desc: "Track your progress, follow reminders, and stay committed every day.",
    stat: "21-day streak",
  },
  {
    icon: Flame,
    color: "#fb923c",
    title: "Burn Calories",
    desc: "Track calories effectively while keeping workouts sustainable.",
    stat: "~500 kcal/day",
  },
];

const WhyFitness = () => {
  return (
    <>
      <style>{whyStyles}</style>

      <section className="relative py-24 font-[Michroma] overflow-hidden transition-colors duration-300">

        {/* ── Background layers ──────────────────────────────────────────── */}
        <div className="absolute inset-0 -z-20"
          style={{ background: 'radial-gradient(ellipse 100% 70% at 50% 50%, rgba(34,211,238,0.05) 0%, transparent 65%), var(--bg-primary, #0a0a0a)' }} />

        {/* Animated grid */}
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }} />

        {/* Drifting orbs */}
        {[
          { top: '5%',  left: '5%',  size: 280, color: 'rgba(34,211,238,0.08)',  dur: '12s' },
          { top: '60%', right: '4%', size: 350, color: 'rgba(59,130,246,0.07)',  dur: '16s' },
          { top: '30%', left: '45%', size: 220, color: 'rgba(34,211,238,0.05)',  dur: '20s' },
        ].map((orb, i) => (
          <div key={i} className="absolute -z-10 rounded-full" style={{
            top: orb.top, left: orb.left, right: orb.right,
            width: orb.size, height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            animation: `orb-drift ${orb.dur} ease-in-out infinite`,
            animationDelay: `${i * 3}s`,
          }} />
        ))}

        {/* Floating particles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 5, height: 5,
              background: i % 2 === 0 ? 'var(--accent)' : '#38bdf8',
              filter: 'blur(1.5px)',
              left: `${8 + i * 9}%`,
            }}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '-10%', opacity: [0, 0.7, 0] }}
            transition={{
              duration: 12 + i * 1.5,
              repeat: Infinity,
              delay: i * 1.2,
              ease: 'linear',
            }}
          />
        ))}

        {/* ── Content ────────────────────────────────────────────────────── */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6">

          {/* Section label pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
              color: 'var(--accent)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            <Flame className="w-3 h-3" />
            The FitTrack Advantage
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, #38bdf8 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Why Fitness Matters
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl mb-12 sm:mb-16 leading-relaxed max-w-3xl mx-auto px-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Fitness isn't just about workouts — it's about unlocking your best self.
            Get stronger, feel energized, and transform your lifestyle.
          </motion.p>

          {/* ── Feature Cards ─────────────────────────────────────────────── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="feature-card rounded-2xl p-6 flex flex-col items-center text-center overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.07)',
                  }}
                >
                  {/* Top shimmer line on hover */}
                  <div className="card-top-shimmer" style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                    background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                    transform: 'translateX(-100%)',
                  }} />

                  {/* Ambient color glow on hover */}
                  <div className="card-ambient" style={{
                    position: 'absolute', inset: 0, borderRadius: '1rem',
                    background: `radial-gradient(circle at 50% 0%, color-mix(in srgb, ${item.color} 8%, transparent), transparent 65%)`,
                    opacity: 0, transition: 'opacity 0.35s ease', pointerEvents: 'none',
                  }} />

                  {/* Icon wrapper */}
                  <div className="icon-wrap relative mb-5 p-4 rounded-2xl" style={{
                    background: `color-mix(in srgb, ${item.color} 10%, rgba(255,255,255,0.03))`,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: `1px solid color-mix(in srgb, ${item.color} 25%, rgba(255,255,255,0.06))`,
                    boxShadow: `0 0 20px color-mix(in srgb, ${item.color} 18%, transparent)`,
                  }}>
                    <Icon className="w-9 h-9" style={{ color: item.color }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold mb-2" style={{ color: item.color }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                    {item.desc}
                  </p>

                  {/* Stat chip */}
                  <div className="mt-auto px-3 py-1.5 rounded-lg text-xs font-semibold" style={{
                    background: `color-mix(in srgb, ${item.color} 10%, rgba(255,255,255,0.03))`,
                    border: `1px solid color-mix(in srgb, ${item.color} 22%, transparent)`,
                    color: item.color,
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                  }}>
                    {item.stat}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyFitness;