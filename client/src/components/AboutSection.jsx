import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Activity, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// ── Injected styles (mirrors Hero / Footer / ComingSoon pattern) ───────────
const aboutStyles = `
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
  .about-card:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, transparent) !important;
    box-shadow: 0 0 32px color-mix(in srgb, var(--accent) 12%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    transform: translateY(-6px) scale(1.02);
  }
  .about-cta-btn:hover {
    box-shadow: 0 0 36px color-mix(in srgb, var(--accent) 65%, transparent) !important;
    transform: scale(1.05);
  }
`;

const CARDS = [
  {
    icon: Dumbbell,
    title: "Smart Workout Tracking",
    desc: "Log your lifts, track your sets, and watch performance analytics evolve with intelligent progress charts.",
  },
  {
    icon: Activity,
    title: "AI Progress Insights",
    desc: "Understand your body with AI-based recommendations that help optimize recovery and boost strength.",
  },
  {
    icon: Users,
    title: "Connected Community",
    desc: "Join thousands of athletes worldwide, share progress, and get inspired by people chasing the same goals.",
  },
];

const AboutSection = () => {
  return (
    <>
      <style>{aboutStyles}</style>

      <section
        className="relative py-24 overflow-hidden font-[Michroma] transition-colors duration-300"
      >
        {/* ── Deep layered background (same as Hero/Footer/ComingSoon) ── */}
        <div
          className="absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 30% 50%, rgba(34,211,238,0.07) 0%, transparent 60%)," +
              "radial-gradient(ellipse 80% 60% at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 55%)," +
              "var(--bg-primary, #0a0a0a)",
          }}
        />

        {/* Animated grid (same as Hero/Footer/ComingSoon) */}
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

        {/* ── Floating orbs (same as Hero/Footer/ComingSoon) ─────────── */}
        <div className="absolute -z-10" style={{ top: "5%",  left: "4%",  width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)", filter: "blur(40px)", animation: "float-orb 10s ease-in-out infinite" }} />
        <div className="absolute -z-10" style={{ bottom: "5%", right: "4%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)", filter: "blur(50px)", animation: "float-orb 13s ease-in-out infinite reverse" }} />
        <div className="absolute -z-10" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 65%)", filter: "blur(60px)", animation: "float-orb 18s ease-in-out infinite" }} />

        {/* ── Corner accents (kept from original, upgraded to accent color) */}
        <div className="absolute top-8 left-8 w-20 h-20 border-t border-l rounded-tl-xl" style={{ borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)" }} />
        <div className="absolute bottom-8 right-8 w-20 h-20 border-b border-r rounded-br-xl" style={{ borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)" }} />

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 text-center">

          {/* Brand badge — same as Hero/Footer/ComingSoon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 mb-6 px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
              animation: "badge-glow 3s ease-in-out infinite",
              color: "var(--accent)",
            }}
          >
            <Dumbbell className="w-4 h-4" />
            <span className="uppercase tracking-widest text-xs font-semibold">
              Who We Are
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            <span style={{ color: "var(--text-primary, #ffffff)" }}>About </span>
            <span
              className="relative inline-block font-extrabold"
              style={{ color: "var(--accent)" }}
            >
              FitTrack
              {/* Shimmer underline — same as Hero */}
              <span style={{
                position: "absolute", bottom: -4, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                borderRadius: 2,
                animation: "shimmer-line 3s ease-in-out infinite",
              }} />
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-lg leading-relaxed mb-16"
            style={{ color: "var(--text-secondary)" }}
          >
            FitTrack is your ultimate fitness partner — empowering you to track workouts,
            monitor progress, and stay consistent with science-driven insights.
            Whether you're a beginner or a pro athlete, we make every rep count.
          </motion.p>

          {/* ── Feature cards — glassmorphism (matching Hero accent chips) */}
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-4">
            {CARDS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="about-card rounded-2xl p-8 text-left"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                  transition: "all 0.25s ease",
                }}
              >
                {/* Icon in glass pill */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
                </div>

                <h3
                  className="text-base font-bold mb-3 uppercase tracking-wide"
                  style={{ color: "var(--accent)" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Divider — same shimmer gradient as Footer/ComingSoon */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            viewport={{ once: true }}
            style={{
              margin: "56px auto 48px",
              width: 200, height: 1,
              background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 60%, transparent), transparent)",
              originX: 0.5,
            }}
          />

          {/* ── CTA — same primary btn style as Hero/ComingSoon ─────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/login">
              <button
                className="about-cta-btn inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-black"
                style={{
                  background: "var(--accent)",
                  boxShadow: "0 0 20px color-mix(in srgb, var(--accent) 40%, transparent)",
                  transition: "all 0.25s ease",
                  fontSize: 14,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Join the FitTrack Revolution
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default AboutSection;