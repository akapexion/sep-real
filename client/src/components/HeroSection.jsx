import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="min-h-screen font-[Michroma] flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Navbar */}

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-black -z-10"></div>
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full animate-pulse -z-10"></div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full animate-pulse -z-10"></div>

      {/* Grid / Flex Layout */}
      <div className="flex flex-col md:flex-col lg:grid lg:grid-cols-2 items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 md:px-10 lg:px-20 gap-8 sm:gap-10 py-12 sm:py-16 md:py-20 lg:py-24 text-center lg:text-left">

        {/* Hero Text */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-3" style={{ color: "var(--accent)" }}>
            <Dumbbell className="w-6 h-6" />
            <p className="uppercase tracking-widest text-xs sm:text-sm">
              Track. Train. Transform.
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[55px] font-bold leading-tight mb-6">
            Push Your{" "}
            <span className="font-extrabold drop-shadow-md" style={{ color: "var(--accent)" }}>
              Limits
            </span>{" "}
            — <br className="hidden lg:block" /> Transform Your Life.
          </h1>

          <p className="text-base sm:text-lg max-w-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Monitor your workouts, log your nutrition, and visualize your
            progress. <span className="font-bold" style={{ color: "var(--accent)" }}>FitTrack</span> gives
            you the power to stay consistent and reach your goals.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full text-black font-bold transition-all w-full sm:w-auto"
              style={{ background: "var(--accent)", boxShadow: "0 0 20px var(--accent)" }}
            >
              <Link to="/login" className="flex items-center gap-2"> Get Started <ArrowRight className="w-4 h-4" /> </Link>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 border rounded-full transition-all w-full sm:w-auto"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              <Link to="/about" className="flex items-center gap-2"> Learn More</Link>
              
            </motion.button>
          </div>

          <p className="mt-6 text-xs sm:text-sm tracking-widest" style={{ color: "var(--text-muted)" }}>
            Track Workouts | Log Meals | See Progress
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden md:flex justify-center items-center"
        >
          <img
            src="b1.png"
            alt="Fitness Workout"
            className="w-[250px] sm:w-[350px] md:w-[400px] lg:w-[500px] object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
