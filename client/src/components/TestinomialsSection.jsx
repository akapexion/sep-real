import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Star, CheckCircle, TrendingUp, MessageSquareQuote, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

// ── Injected styles ────────────────────────────────────────────────────────
const testimonialStyles = `
  @keyframes orb-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    40%       { transform: translate(50px, -35px) scale(1.1); }
    70%       { transform: translate(-30px, 20px) scale(0.93); }
  }
  @keyframes tag-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 25%, transparent); }
    50%       { box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 50%, transparent); }
  }
  @keyframes dot-active {
    0%, 100% { transform: scaleX(1); }
    50%       { transform: scaleX(1.3); }
  }
  .nav-btn {
    transition: all 0.2s ease;
  }
  .nav-btn:hover {
    border-color: color-mix(in srgb, var(--accent) 55%, transparent) !important;
    background: color-mix(in srgb, var(--accent) 10%, rgba(255,255,255,0.05)) !important;
    color: var(--accent) !important;
    transform: scale(1.08);
  }
`;

// ── Testimonial Card ───────────────────────────────────────────────────────
const TestimonialCard = ({ testimonial }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const ratingCount = typeof testimonial.rating === "string"
    ? testimonial.rating.length
    : testimonial.rating ?? 5;

  return (
    <motion.div
      className="relative w-full h-full rounded-2xl overflow-hidden"
      style={{
        rotateX, rotateY,
        transformStyle: "preserve-3d",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, var(--accent), #38bdf8, transparent)",
      }} />

      {/* Ambient glow behind avatar */}
      <div style={{
        position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
        width: 220, height: 220, borderRadius: "50%",
        background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 70%)",
        filter: "blur(30px)", pointerEvents: "none",
      }} />

      {/* Quote icon watermark */}
      <div style={{
        position: "absolute", bottom: 16, right: 20,
        opacity: 0.05, pointerEvents: "none",
      }}>
        <MessageSquareQuote style={{ width: 80, height: 80, color: "var(--accent)" }} />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full p-8">

        {/* ── Top: Avatar + name ── */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar with glass ring */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                position: "absolute", inset: -3, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), #38bdf8)",
                padding: 2,
              }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)",
                }} />
              </div>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`}
                alt={`${testimonial.name} profile`}
                style={{
                  width: 56, height: 56, borderRadius: "50%",
                  objectFit: "cover", position: "relative", zIndex: 1,
                  border: "2px solid rgba(255,255,255,0.10)",
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold truncate" style={{ color: "var(--text-primary)" }}>
                {testimonial.name}
              </h3>
              <p className="text-xs truncate mt-0.5" style={{ color: "var(--accent)" }}>
                {testimonial.email}
              </p>
            </div>

            {/* Verified badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0" style={{
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.22)",
            }}>
              <CheckCircle className="w-3 h-3" style={{ color: "#4ade80" }} />
              <span className="text-xs font-semibold" style={{ color: "#4ade80" }}>Verified</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginBottom: "1.25rem" }} />

          {/* Message */}
          <p className="text-sm leading-relaxed italic" style={{ color: "var(--text-muted)" }}>
            "{testimonial.message}"
          </p>
        </div>

        {/* ── Bottom: Rating + badge ── */}
        <div className="mt-6">
          {/* Stars */}
          <div className="flex items-center gap-1.5 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4"
                style={{
                  color: i < ratingCount ? "#fbbf24" : "rgba(255,255,255,0.12)",
                  fill: i < ratingCount ? "#fbbf24" : "none",
                }} />
            ))}
            <span className="text-xs font-semibold ml-1" style={{ color: "#fbbf24" }}>
              {ratingCount}/5
            </span>
          </div>

          {/* Verified feedback tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{
            background: "color-mix(in srgb, var(--accent) 8%, rgba(255,255,255,0.03))",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
          }}>
            <TrendingUp className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
            <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>Verified Feedback</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Section ───────────────────────────────────────────────────────────
const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent]           = useState(0);
  const [loading, setLoading]           = useState(true);
  const intervalRef                     = useRef(null);

  const loadFeedback = async () => {
    try {
      const res = await axios.get(`${API_BASE}/feedback`);
      setTestimonials(res.data.feedback);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFeedback(); }, []);

  const startInterval = () => {
    clearInterval(intervalRef.current);
    if (testimonials.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrent(p => (p + 1) % testimonials.length);
      }, 5000);
    }
  };

  useEffect(() => { startInterval(); return () => clearInterval(intervalRef.current); }, [testimonials]);

  const next = () => { setCurrent(p => (p + 1) % testimonials.length); startInterval(); };
  const prev = () => { setCurrent(p => (p - 1 + testimonials.length) % testimonials.length); startInterval(); };

  // ── Loading ──
  if (loading) return (
    <div className="flex justify-center items-center py-24 font-[Michroma]">
      <div style={{ position: "relative" }}>
        <div className="w-8 h-8 rounded-full animate-spin"
          style={{ border: "2px solid rgba(255,255,255,0.08)", borderTopColor: "var(--accent)" }} />
      </div>
    </div>
  );

  // ── Empty ──
  if (testimonials.length === 0) return (
    <div className="text-center py-24 font-[Michroma]" style={{ color: "var(--text-muted)" }}>
      No feedback yet.
    </div>
  );

  return (
    <>
      <style>{testimonialStyles}</style>

      <section className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 py-24 font-[Michroma] overflow-hidden">

        {/* ── Background ──────────────────────────────────────────────── */}
        <div className="absolute inset-0 -z-20"
          style={{ background: "radial-gradient(ellipse 100% 70% at 50% 40%, rgba(34,211,238,0.05) 0%, transparent 65%), var(--bg-primary, #0a0a0a)" }} />

        {/* Grid */}
        <div className="absolute inset-0 -z-10 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }} />

        {/* Drifting orbs */}
        {[
          { top: "5%",  left: "5%",  size: 300, color: "rgba(34,211,238,0.08)", dur: "14s" },
          { bottom: "8%", right: "4%", size: 350, color: "rgba(59,130,246,0.07)", dur: "18s" },
        ].map((orb, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{
            top: orb.top, bottom: orb.bottom, left: orb.left, right: orb.right,
            width: orb.size, height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(48px)",
            animation: `orb-drift ${orb.dur} ease-in-out infinite`,
            animationDelay: `${i * 4}s`,
          }} />
        ))}

        {/* ── Section pill ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 z-10"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
            color: "var(--accent)",
            fontSize: 11, fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase",
            animation: "tag-pulse 3s ease-in-out infinite",
          }}
        >
          <Star className="w-3 h-3" style={{ fill: "var(--accent)" }} />
          What People Say
        </motion.div>

        {/* ── Headline ─────────────────────────────────────────────────── */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 z-10"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, #38bdf8 50%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Real Feedback
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm mb-14 z-10"
          style={{ color: "var(--text-muted)" }}
        >
          From real FitTrack members — unfiltered & verified.
        </motion.p>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div className="relative w-full max-w-md h-[460px] z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 36, scale: 0.93 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{ opacity: 0,  y: -36, scale: 0.93  }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <TestimonialCard testimonial={testimonials[current]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-5 mt-10 z-10">
          {/* Prev */}
          <button onClick={prev} className="nav-btn flex items-center justify-center w-9 h-9 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "var(--text-muted)",
            }}>
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => { setCurrent(i); startInterval(); }}
                style={{
                  width: i === current ? 22 : 7, height: 7,
                  borderRadius: 9999,
                  background: i === current ? "var(--accent)" : "rgba(255,255,255,0.15)",
                  border: "none", padding: 0, cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: i === current ? "0 0 8px color-mix(in srgb, var(--accent) 50%, transparent)" : "none",
                }} />
            ))}
          </div>

          {/* Next */}
          <button onClick={next} className="nav-btn flex items-center justify-center w-9 h-9 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "var(--text-muted)",
            }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hint */}
        <motion.p
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="text-xs mt-5 z-10"
          style={{ color: "var(--text-muted)" }}
        >
          Click card or use arrows to navigate
        </motion.p>

      </section>
    </>
  );
};

export default TestimonialsSection;