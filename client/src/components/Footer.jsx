import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Dumbbell } from "lucide-react";

const Footer = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#1a0e00] via-[#120900] to-black text-white py-20 font-[Poppins]">
      {/* 🌈 Animated gradient orbs */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(253,199,0,0.08),transparent_70%)]"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,140,0,0.15),transparent_75%)]"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ✨ Floating particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[6px] h-[6px] rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-[2px]"
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
          className="inline-flex items-center justify-center mb-6 sm:mb-8 p-4 sm:p-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 shadow-lg shadow-orange-500/30"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
        </motion.div>

        {/* Branding */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          FitTrack
        </h3>
        <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto px-2">
          Forge your strength, transform your body — and push beyond your limits.  
          FitForge is your ultimate companion in fitness, focus, and endurance.
        </p>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-yellow-400" />
            <span>support@fitforge.com</span>
          </div>
          <span className="hidden sm:inline text-gray-600">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>Karachi, Pakistan</span>
          </div>
        </div>

        {/* Divider Glow */}
        <motion.div
          className="mx-auto w-40 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{ originX: 0.5 }}
        />

        {/* Copyright */}
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} FitForge. All rights reserved.
        </p>
      </motion.div>

      {/* ⚡ Bottom glow bar */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{ originX: 0 }}
      />
    </footer>
  );
};

export default Footer;
