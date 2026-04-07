import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, HeartPulse, Activity, Flame } from "lucide-react";

const WhyFitness = () => {
  const features = [
    {
      icon: <Dumbbell className="w-10 h-10 text-cyan-400" />,
      title: "Build Strength",
      desc: "Enhance endurance, power, and confidence through consistent workouts.",
    },
    {
      icon: <HeartPulse className="w-10 h-10 text-cyan-500" />,
      title: "Improve Health",
      desc: "Boost your cardiovascular fitness and achieve better overall wellbeing.",
    },
    {
      icon: <Activity className="w-10 h-10 text-red-400" />,
      title: "Stay Consistent",
      desc: "Track your progress, follow reminders, and stay committed every day.",
    },
    {
      icon: <Flame className="w-10 h-10 text-cyan-400" />,
      title: "Burn Calories",
      desc: "Track calories effectively while keeping workouts sustainable.",
    },
  ];

  return (
    <section className="relative py-24 font-[Michroma] overflow-hidden transition-colors duration-300">
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
      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text px-2"
        >
          Why Fitness Matters
        </motion.h2>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 md:mb-16 leading-relaxed max-w-3xl mx-auto px-2"
        >
          Fitness isn't just about workouts — it's about unlocking your best self.  
          Get stronger, feel energized, and transform your lifestyle.
        </motion.p>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8 hover:bg-white/20 hover:scale-105 transition-all duration-300 w-full"
            >
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="p-5 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full shadow-md shadow-cyan-500/30">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-cyan-400">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyFitness;
