import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Activity, Zap, Users } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="relative py-24 overflow-hidden font-[Michroma] transition-colors duration-300">
      
      <div className="absolute inset-0" style={{ background: "var(--bg-primary)", opacity: 0.9 }}></div>

      {/* 🌟 Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 text-center">
        {/* Title */}
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          About{" "}
          <span className="font-extrabold drop-shadow-md" style={{ color: "var(--accent)" }}>
            FitTrack
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="max-w-3xl mx-auto text-lg leading-relaxed mb-16"
          style={{ color: "var(--text-secondary)" }}
        >
          FitTrack is your ultimate fitness partner — empowering you to track workouts, 
          monitor progress, and stay consistent with science-driven insights. 
          Whether you’re a beginner or a pro athlete, we’re here to make every rep count.  
        </motion.p>

        {/* 💪 Feature Highlights */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 mt-10">
          {/* Card 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl p-8 transition-all glass hover:border-cyan-400"
            style={{ background: "var(--bg-card)", borderColor: "var(--glass-border)" }}
          >
            <Dumbbell className="w-10 h-10 mb-4 mx-auto" style={{ color: "var(--accent)" }} />
            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--accent)" }}>
              Smart Workout Tracking
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Log your lifts, track your sets, and see performance analytics evolve 
              with intelligent progress charts.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl p-8 transition-all glass hover:border-cyan-400"
            style={{ background: "var(--bg-card)", borderColor: "var(--glass-border)" }}
          >
            <Activity className="w-10 h-10 mb-4 mx-auto" style={{ color: "var(--accent)" }} />
            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--accent)" }}>
              AI Progress Insights
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Understand your body with AI-based recommendations that help 
              optimize recovery and boost strength.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl p-8 transition-all glass hover:border-cyan-400"
            style={{ background: "var(--bg-card)", borderColor: "var(--glass-border)" }}
          >
            <Users className="w-10 h-10 mb-4 mx-auto" style={{ color: "var(--accent)" }} />
            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--accent)" }}>
              Connected Community
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Join thousands of athletes worldwide, share progress, and 
              get inspired by people chasing the same goals.
            </p>
          </motion.div>
        </div>

        {/* ⚡ CTA Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mt-16"
        >
          <button className="px-10 py-4 rounded-full text-black font-semibold transition-all" style={{ background: "var(--accent)", boxShadow: "0 0 20px var(--accent)" }}>
            Join the FitTrack Revolution
          </button>
        </motion.div>
      </div>

      {/* 🔶 Decorative Elements */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl"></div>
    </section>
  );
};

export default AboutSection;
