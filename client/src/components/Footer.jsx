import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Dumbbell, Zap, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

// ── Injected styles (mirrors HeroSection pattern) ──────────────────────────
const footerStyles = `
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
  @keyframes bottom-bar-slide {
    0%   { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  .footer-nav-link:hover {
    background: color-mix(in srgb, var(--accent) 10%, transparent) !important;
    border-color: color-mix(in srgb, var(--accent) 40%, transparent) !important;
    color: var(--accent) !important;
    transform: translateY(-2px);
  }
  .footer-stat-chip:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, transparent) !important;
    background: color-mix(in srgb, var(--accent) 10%, transparent) !important;
    transform: translateY(-2px);
  }
  .footer-contact-card:hover {
    border-color: color-mix(in srgb, var(--accent) 35%, transparent) !important;
    box-shadow: 0 0 28px color-mix(in srgb, var(--accent) 15%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.08) !important;
  }
`;

// ── Stat chips — same data shape as HeroSection STATS ─────────────────────
const STATS = [
  { icon: Zap,        value: "10K+",  label: "Workouts Logged"  },
  { icon: Target,     value: "94%",   label: "Goals Achieved"   },
  { icon: TrendingUp, value: "Daily", label: "Progress Tracked" },
];

const NAV_LINKS = ["Home", "Features", "Workouts", "Nutrition", "About", "Contact"];

const Footer = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <style>{footerStyles}</style>

      <footer
        className="relative overflow-hidden font-[Michroma] transition-colors duration-300"
        style={{ paddingTop: 80, paddingBottom: 0 }}
      >
        {/* ── Deep layered background (same as Hero) ──────────────────── */}
        <div
          className="absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 40% 20%, rgba(34,211,238,0.07) 0%, transparent 60%)," +
              "radial-gradient(ellipse 80% 60% at 80% 80%, rgba(59,130,246,0.06) 0%, transparent 55%)," +
              "var(--bg-primary, #0a0a0a)",
          }}
        />

        {/* Animated grid (same as Hero) */}
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

        {/* ── Floating orbs (same as Hero) ─────────────────────────────── */}
        <div
          className="absolute -z-10"
          style={{
            top: "10%", left: "5%", width: 280, height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "float-orb 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -z-10"
          style={{
            bottom: "8%", right: "5%", width: 340, height: 340,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "float-orb 13s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute -z-10"
          style={{
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 500, height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 65%)",
            filter: "blur(60px)",
            animation: "float-orb 18s ease-in-out infinite",
          }}
        />

        {/* ── Main content ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
        >

          {/* Brand badge — same style as Hero badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
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
              Track. Train. Transform.
            </span>
          </motion.div>

          {/* Brand name */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: "var(--accent)" }}
          >
            FitTrack
          </motion.h2>

          {/* Shimmer underline — same as Hero headline accent */}
          <div
            style={{
              margin: "0 auto 20px",
              width: 80, height: 2,
              background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
              borderRadius: 2,
              animation: "shimmer-line 3s ease-in-out infinite",
            }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Forge your strength, transform your body — and push beyond your limits.{" "}
            <span className="font-bold" style={{ color: "var(--accent)" }}>FitTrack</span>{" "}
            is your ultimate companion in fitness, focus, and endurance.
          </motion.p>

          {/* ── Stat chips — exact same pattern as HeroSection ─────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center mb-8"
          >
            {STATS.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 + i * 0.08 }}
                viewport={{ once: true }}
                className="footer-stat-chip flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-default"
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
                <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                  {value}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Nav links — pill style matching Hero outline btn ──────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link}
                to={`/${link.toLowerCase()}`}
                className="footer-nav-link px-4 py-1.5 rounded-full text-xs uppercase tracking-widest"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                  color: "var(--text-secondary)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
              >
                {link}
              </Link>
            ))}
          </motion.div>

          {/* ── Contact card — glass chip style matching Hero accent chips */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.6 }}
            viewport={{ once: true }}
            className="footer-contact-card inline-flex flex-col sm:flex-row items-center overflow-hidden rounded-2xl mb-10"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
              transition: "all 0.25s ease",
            }}
          >
            <div
              className="flex items-center gap-2 px-6 py-3 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
              <span>support@fittrack.com</span>
            </div>
            {/* Gradient divider — same as Hero corner chips separator */}
            <div
              className="hidden sm:block"
              style={{
                width: 1, height: 36,
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)",
              }}
            />
            <div
              className="flex items-center gap-2 px-6 py-3 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
              <span>Karachi, Pakistan</span>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            viewport={{ once: true }}
            style={{
              margin: "0 auto 24px",
              width: 200, height: 1,
              background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 60%, transparent), transparent)",
              originX: 0.5,
            }}
          />

          {/* Copyright */}
          <p
            className="text-xs uppercase tracking-widest pb-8"
            style={{ color: "var(--text-muted)" }}
          >
            &copy; {new Date().getFullYear()} FitTrack. All rights reserved.
          </p>
        </motion.div>

        {/* ── Bottom glow bar — animated like Hero's gradient bar ──────── */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 3,
            background: "linear-gradient(90deg, var(--accent), #3b82f6, #facc15, var(--accent))",
            backgroundSize: "200%",
            animation: "bottom-bar-slide 4s linear infinite",
          }}
        />
      </footer>
    </>
  );
};

export default Footer;