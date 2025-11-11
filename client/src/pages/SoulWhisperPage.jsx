import React from "react";
import { motion } from "framer-motion";
import { Brain, Heart, Moon, Sun, Sparkles, Leaf, Music, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SoulWhisperPage = () => {
  const features = [
    {
      icon: <Brain className="w-10 h-10 text-yellow-400" />,
      title: "Mindful Meditation",
      desc: "Connect with your inner self through guided meditation sessions designed to calm your mind and reduce stress.",
    },
    {
      icon: <Heart className="w-10 h-10 text-orange-400" />,
      title: "Emotional Wellness",
      desc: "Track your emotional state and learn techniques to maintain mental balance and inner peace.",
    },
    {
      icon: <Moon className="w-10 h-10 text-purple-400" />,
      title: "Sleep Therapy",
      desc: "Improve your sleep quality with relaxing sounds and bedtime routines that help you unwind.",
    },
    {
      icon: <Sun className="w-10 h-10 text-yellow-500" />,
      title: "Morning Rituals",
      desc: "Start your day with positive affirmations and energizing morning practices for a productive day.",
    },
    {
      icon: <Sparkles className="w-10 h-10 text-yellow-400" />,
      title: "Energy Healing",
      desc: "Recharge your spiritual energy through breathing exercises and mindfulness techniques.",
    },
    {
      icon: <Leaf className="w-10 h-10 text-green-400" />,
      title: "Nature Connection",
      desc: "Reconnect with nature through virtual experiences and outdoor meditation guides.",
    },
  ];

  const programs = [
    {
      icon: <Music className="w-8 h-8" />,
      title: "Sound Healing",
      desc: "Experience the power of sound therapy with binaural beats and calming frequencies.",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Daily Journaling",
      desc: "Reflect on your thoughts and emotions with guided journaling prompts and exercises.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-[Michroma]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-yellow-600/10 to-black -z-10"></div>
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-500/10 blur-3xl rounded-full animate-pulse -z-10"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-yellow-500/10 blur-3xl rounded-full animate-pulse -z-10"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-10 text-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4 text-yellow-400">
              <Sparkles className="w-6 h-6" />
              <p className="uppercase tracking-widest text-xs sm:text-sm">
                Inner Peace & Wellness
              </p>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-yellow-400 to-orange-500 text-transparent bg-clip-text">
                SoulWhisper
              </span>
            </h1>
            
            <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2">
              Your journey to inner peace begins here. Connect with your soul, find balance, 
              and discover the power of mindfulness in your daily life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0e00] to-black"></div>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[6px] h-[6px] rounded-full bg-gradient-to-r from-purple-400 to-yellow-400 blur-[2px]"
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
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 md:mb-16 text-center bg-gradient-to-r from-purple-400 via-yellow-400 to-orange-500 text-transparent bg-clip-text px-2"
          >
            Wellness Programs
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md border border-purple-400/20 rounded-2xl p-8 hover:bg-white/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all"
              >
                <div className="mb-6 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-300 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed text-center">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-12 sm:py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-[#1a0e00]"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 md:mb-16 text-center bg-gradient-to-r from-purple-400 via-yellow-400 to-orange-500 text-transparent bg-clip-text px-2"
          >
            Special Programs
          </motion.h2>
          
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-purple-500/10 to-yellow-500/10 border border-purple-400/30 rounded-2xl p-10 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all"
              >
                <div className="flex items-start gap-6">
                  <div className="text-purple-400 flex-shrink-0">
                    {program.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-3 text-yellow-300">
                      {program.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {program.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0e00] to-black"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">
              Begin Your Journey to Inner Peace
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Join thousands who have found balance and harmony through SoulWhisper's wellness programs.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-purple-500 via-yellow-500 to-orange-600 rounded-full text-black font-semibold hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] transition-all"
            >
              Start Your Wellness Journey
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SoulWhisperPage;

