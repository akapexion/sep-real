import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Dumbbell } from "lucide-react";

const Footer = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer className="relative overflow-hidden py-20 font-[Poppins] transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-black -z-10"></div>
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full animate-pulse -z-10"></div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full animate-pulse -z-10"></div>

      {/* ✨ Floating particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[6px] h-[6px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-[2px]"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            y: [Math.random() * window.innerHeight, -50],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 14 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* 💫 Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Logo Pulse */}
        <motion.div
          className="inline-flex items-center justify-center mb-6 sm:mb-8 p-4 sm:p-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
        </motion.div>

        {/* Branding */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          FitTrack
        </h3>
        <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto px-2">
          Forge your strength, transform your body — and push beyond your limits.  
          FitTrack is your ultimate companion in fitness, focus, and endurance.
        </p>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>support@fittrack.com</span>
          </div>
          <span className="hidden sm:inline text-gray-600">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span>Karachi, Pakistan</span>
          </div>
        </div>

        {/* Divider Glow */}
        <motion.div
          className="mx-auto w-40 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{ originX: 0.5 }}
        />

        {/* Copyright */}
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} FitTrack. All rights reserved.
        </p>
      </motion.div>

      {/* ⚡ Bottom glow bar */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-cyan-400 via-blue-500 to-yellow-400"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{ originX: 0 }}
      />
    </footer>
  );
};

export default Footer;
