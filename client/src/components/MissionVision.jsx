import React from "react";
import { motion } from "framer-motion";
import { Target, Rocket, HeartPulse, Dumbbell, Users } from "lucide-react";

const MissionVision = () => {
  return (
    <section
      className="relative py-28 bg-[#0b0b0b] text-white font-[Michroma] overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1594737625785-c0f4f5d6b95a?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text"
        >
          Our Mission & Vision
        </motion.h2>

        <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base mb-16 leading-relaxed">
          We’re building more than just a fitness app — we’re creating a community where technology meets passion, helping every individual push boundaries and track real progress.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
          {/* Mission Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md border border-yellow-400/20 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-white/20 transition-all shadow-[0_0_30px_rgba(255,200,0,0.1)]"
          >
            <Target className="text-yellow-400 w-14 h-14 mb-4" />
            <h3 className="text-2xl font-semibold mb-3 text-yellow-400">Our Mission</h3>
            <p className="text-gray-300 text-sm">
              Empower every fitness enthusiast to track, improve, and achieve through a seamless digital experience driven by data and passion.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md border border-orange-500/20 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-white/20 transition-all shadow-[0_0_30px_rgba(255,150,0,0.1)]"
          >
            <Rocket className="text-orange-400 w-14 h-14 mb-4" />
            <h3 className="text-2xl font-semibold mb-3 text-orange-400">Our Vision</h3>
            <p className="text-gray-300 text-sm">
              To revolutionize health tracking globally by integrating motivation, technology, and analytics into one powerful fitness ecosystem.
            </p>
          </motion.div>

          {/* Core Values */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md border border-red-500/20 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-white/20 transition-all shadow-[0_0_30px_rgba(255,100,0,0.1)]"
          >
            <HeartPulse className="text-red-400 w-14 h-14 mb-4" />
            <h3 className="text-2xl font-semibold mb-3 text-red-400">Our Core Values</h3>
            <p className="text-gray-300 text-sm">
              Consistency, strength, and self-discipline — we believe real transformation happens when passion meets persistence.
            </p>
          </motion.div>
        </div>

        {/* Second Row (with images + icons) */}
        <div className="grid md:grid-cols-2 gap-12 mt-24 items-center">
          {/* Left Side Image */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="rounded-3xl overflow-hidden border-2 border-yellow-500/30 shadow-[0_0_40px_rgba(255,200,0,0.15)]"
          >
            <img
              src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1600&q=80"
              alt="Fitness Motivation"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* Right Side Text */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-left space-y-6"
          >
            <h3 className="text-3xl font-bold text-yellow-400">We Believe in Progress, Not Perfection</h3>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              Every step counts. Whether it’s a 5-minute jog or a full workout session — consistency is what makes you stronger.  
              FitTrack is your daily motivation partner — tracking your effort, your nutrition, and your evolution.
            </p>

            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center gap-3 text-yellow-400">
                <Dumbbell className="w-6 h-6" /> <span>Smart Workout Tracking</span>
              </div>
              <div className="flex items-center gap-3 text-orange-400">
                <Users className="w-6 h-6" /> <span>Community Support</span>
              </div>
              <div className="flex items-center gap-3 text-red-400">
                <HeartPulse className="w-6 h-6" /> <span>Health Insights</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Background Glows */}
      <div className="absolute top-10 left-20 w-72 h-72 bg-yellow-400/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 blur-3xl rounded-full"></div>
    </section>
  );
};

export default MissionVision;
