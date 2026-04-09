import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Target, Users, Award, Heart, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// ── Injected styles (mirrors Hero / Footer / ComingSoon / AboutSection) ────
const aboutPageStyles = `
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
  .ap-card {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.09);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
    transition: all 0.25s ease;
  }
  .ap-card:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, transparent) !important;
    box-shadow: 0 0 32px color-mix(in srgb, var(--accent) 12%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    transform: translateY(-6px);
  }
  .ap-stat-card {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.09);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
    transition: all 0.25s ease;
  }
  .ap-stat-card:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, transparent) !important;
    box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 15%, transparent) !important;
    transform: translateY(-4px);
  }
  .ap-cta-btn:hover {
    box-shadow: 0 0 36px color-mix(in srgb, var(--accent) 65%, transparent) !important;
    transform: scale(1.05);
  }
`;

const STATS = [
  { icon: Users,  number: "10K+", label: "Active Members"   },
  { icon: Award,  number: "500+", label: "Success Stories"  },
  { icon: Heart,  number: "98%",  label: "Satisfaction Rate" },
  { icon: Zap,    number: "24/7", label: "Support Available" },
];

const VALUES = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To empower individuals to achieve their fitness goals through innovative tracking, personalized insights, and a supportive community.",
  },
  {
    icon: Dumbbell,
    title: "Our Vision",
    desc: "To become the world's most trusted fitness platform, helping millions transform their lives one workout at a time.",
  },
  {
    icon: Users,
    title: "Our Values",
    desc: "We believe in consistency, dedication, and community support. Every member's journey matters, and we're here to make it count.",
  },
];

const FEATURES = [
  {
    icon: Dumbbell,
    title: "Smart Workout Tracking",
    desc: "Log your lifts, track your sets, and see performance analytics evolve with intelligent progress charts.",
  },
  {
    icon: Zap,
    title: "AI Progress Insights",
    desc: "Understand your body with AI-based recommendations that help optimize recovery and boost strength.",
  },
  {
    icon: Users,
    title: "Connected Community",
    desc: "Join thousands of athletes worldwide, share progress, and get inspired by people chasing the same goals.",
  },
];

// ── Shared section divider ─────────────────────────────────────────────────
const Divider = () => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
    viewport={{ once: true }}
    style={{
      margin: "0 auto",
      width: 200, height: 1,
      background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 60%, transparent), transparent)",
      originX: 0.5,
    }}
  />
);

// ── Shared section heading ─────────────────────────────────────────────────
const SectionHeading = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, delay }}
    viewport={{ once: true }}
    className="text-center mb-14"
  >
    <h2
      className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative inline-block"
      style={{ color: "var(--accent)" }}
    >
      {children}
      <span style={{
        position: "absolute", bottom: -6, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
        borderRadius: 2,
        animation: "shimmer-line 3s ease-in-out infinite",
      }} />
    </h2>
  </motion.div>
);

// ── Shared glass card ──────────────────────────────────────────────────────
const GlassCard = ({ icon: Icon, title, desc, index, center = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    viewport={{ once: true }}
    className={`ap-card rounded-2xl p-8 ${center ? "text-center" : "text-left"}`}
  >
    <div
      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${center ? "mx-auto" : ""}`}
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
);

const AboutPage = () => {
  return (
    <>
      <style>{aboutPageStyles}</style>

      <div
        className="min-h-screen font-[Michroma] relative transition-colors duration-300"
        style={{ background: "var(--bg-primary, #0a0a0a)" }}
      >
        {/* ── Persistent background (shared across all sections) ─────── */}
        <div
          className="fixed inset-0 -z-20"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 60% 30%, rgba(34,211,238,0.07) 0%, transparent 60%)," +
              "radial-gradient(ellipse 80% 60% at 20% 80%, rgba(59,130,246,0.06) 0%, transparent 55%)," +
              "var(--bg-primary, #0a0a0a)",
          }}
        />
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            animation: "grid-fade 6s ease-in-out infinite",
          }}
        />

        {/* Floating orbs */}
        <div className="fixed -z-10" style={{ top: "10%", left: "4%",  width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)", filter: "blur(40px)", animation: "float-orb 10s ease-in-out infinite" }} />
        <div className="fixed -z-10" style={{ bottom: "8%", right: "4%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)", filter: "blur(50px)", animation: "float-orb 13s ease-in-out infinite reverse" }} />
        <div className="fixed -z-10" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 65%)", filter: "blur(60px)", animation: "float-orb 18s ease-in-out infinite" }} />

        {/* Corner accents */}
        <div className="fixed top-8 left-8 w-20 h-20 border-t border-l rounded-tl-xl z-0" style={{ borderColor: "color-mix(in srgb, var(--accent) 20%, transparent)" }} />
        <div className="fixed bottom-8 right-8 w-20 h-20 border-b border-r rounded-br-xl z-0" style={{ borderColor: "color-mix(in srgb, var(--accent) 20%, transparent)" }} />

        {/* ════════════════════════════════════════════════════════════ */}
        {/* HERO SECTION                                                */}
        {/* ════════════════════════════════════════════════════════════ */}
        <section className="relative pt-28 sm:pt-32 pb-20 overflow-hidden z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 text-center">

            {/* Brand badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
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
              <span className="uppercase tracking-widest text-xs font-semibold">About Us</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              <span style={{ color: "var(--text-primary, #fff)" }}>About </span>
              <span className="relative inline-block font-extrabold" style={{ color: "var(--accent)" }}>
                FitTrack
                <span style={{
                  position: "absolute", bottom: -4, left: 0, right: 0, height: 2,
                  background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                  borderRadius: 2,
                  animation: "shimmer-line 3s ease-in-out infinite",
                }} />
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              FitTrack is your ultimate fitness partner — empowering you to track workouts,
              monitor progress, and stay consistent with science-driven insights.
              Whether you're a beginner or a pro athlete,{" "}
              <span className="font-bold" style={{ color: "var(--accent)" }}>we make every rep count.</span>
            </motion.p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* STATS SECTION                                               */}
        {/* ════════════════════════════════════════════════════════════ */}
        <section className="relative py-12 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map(({ icon: Icon, number, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="ap-stat-card rounded-2xl p-5 sm:p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                    style={{
                      background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1"
                    style={{ color: "var(--accent)" }}
                  >
                    {number}
                  </h3>
                  <p className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* MISSION / VISION / VALUES                                   */}
        {/* ════════════════════════════════════════════════════════════ */}
        <section className="relative py-20 sm:py-24 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
            <SectionHeading>Our Foundation</SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALUES.map((v, i) => (
                <GlassCard key={v.title} {...v} index={i} center />
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Divider />
        </div>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* FEATURES SECTION                                            */}
        {/* ════════════════════════════════════════════════════════════ */}
        <section className="relative py-20 sm:py-24 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
            <SectionHeading>What We Offer</SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <GlassCard key={f.title} {...f} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Divider />
        </div>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* CTA SECTION                                                 */}
        {/* ════════════════════════════════════════════════════════════ */}
        <section className="relative py-20 sm:py-24 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Glass CTA card */}
              <div
                className="rounded-3xl p-10 sm:p-14"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                  boxShadow: "0 0 60px color-mix(in srgb, var(--accent) 8%, transparent), inset 0 1px 0 rgba(255,255,255,0.07)",
                }}
              >
                {/* Mini badge */}
                <div
                  className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
                    animation: "badge-glow 3s ease-in-out infinite",
                    color: "var(--accent)",
                  }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-widest text-xs font-semibold">Get Started Today</span>
                </div>

                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: "var(--text-primary, #fff)" }}
                >
                  Ready to Transform Your{" "}
                  <span style={{ color: "var(--accent)" }}>Fitness Journey?</span>
                </h2>

                <p
                  className="text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Join thousands of members already achieving their fitness goals with{" "}
                  <span className="font-bold" style={{ color: "var(--accent)" }}>FitTrack</span>.
                </p>

                <Link to="/login">
                  <button
                    className="ap-cta-btn inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-black"
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
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Bottom glow bar (same as Hero/Footer/ComingSoon) ─────── */}
        <div
          style={{
            position: "relative",
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

export default AboutPage;