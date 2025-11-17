import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Target, Users, Award, Heart, Zap } from "lucide-react";


const AboutPage = () => {
  const stats = [
    { icon: <Users className="w-8 h-8" />, number: "10K+", label: "Active Members" },
    { icon: <Award className="w-8 h-8" />, number: "500+", label: "Success Stories" },
    { icon: <Heart className="w-8 h-8" />, number: "98%", label: "Satisfaction Rate" },
    { icon: <Zap className="w-8 h-8" />, number: "24/7", label: "Support Available" },
  ];

  const values = [
    {
      icon: <Target className="w-10 h-10 text-yellow-400" />,
      title: "Our Mission",
      desc: "To empower individuals to achieve their fitness goals through innovative tracking, personalized insights, and a supportive community.",
    },
    {
      icon: <Dumbbell className="w-10 h-10 text-orange-400" />,
      title: "Our Vision",
      desc: "To become the world's most trusted fitness platform, helping millions transform their lives one workout at a time.",
    },
    {
      icon: <Users className="w-10 h-10 text-yellow-400" />,
      title: "Our Values",
      desc: "We believe in consistency, dedication, and community support. Every member's journey matters, and we're here to make it count.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-[Michroma]">
     
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 via-orange-700/10 to-black -z-10"></div>
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-yellow-500/10 blur-3xl rounded-full animate-pulse -z-10"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-10 text-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4 text-yellow-400">
              <Dumbbell className="w-6 h-6" />
              <p className="uppercase tracking-widest text-xs sm:text-sm">
                About Us
              </p>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
                FitTrack
              </span>
            </h1>
            
            <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2">
              FitTrack is your ultimate fitness partner — empowering you to track workouts, 
              monitor progress, and stay consistent with science-driven insights. 
              Whether you're a beginner or a pro athlete, we're here to make every rep count.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0e00] to-black"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:shadow-[0_0_30px_rgba(255,165,0,0.4)] transition-all"
              >
                <div className="text-yellow-400 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                  {stat.number}
                </h3>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#120900] to-black"></div>
        {Array.from({ length: 8 }).map((_, i) => (
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
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 md:mb-16 text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text px-2"
          >
            Our Foundation
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md border border-yellow-400/20 rounded-2xl p-8 hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,165,0,0.4)] transition-all"
              >
                <div className="mb-6 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-300 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed text-center">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-[#1a0e00]"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 md:mb-16 text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text px-2"
          >
            What We Offer
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-b from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,165,0,0.4)] transition-all"
            >
              <Dumbbell className="w-10 h-10 text-yellow-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3 text-yellow-300 text-center">
                Smart Workout Tracking
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed text-center">
                Log your lifts, track your sets, and see performance analytics evolve 
                with intelligent progress charts.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-b from-yellow-500/10 to-orange-500/10 border border-orange-500/30 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,165,0,0.4)] transition-all"
            >
              <Zap className="w-10 h-10 text-orange-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3 text-orange-300 text-center">
                AI Progress Insights
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed text-center">
                Understand your body with AI-based recommendations that help 
                optimize recovery and boost strength.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-b from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,165,0,0.4)] transition-all"
            >
              <Users className="w-10 h-10 text-yellow-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3 text-yellow-300 text-center">
                Connected Community
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed text-center">
                Join thousands of athletes worldwide, share progress, and 
                get inspired by people chasing the same goals.
              </p>
            </motion.div>
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
              Ready to Transform Your Fitness Journey?
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Join thousands of members who are already achieving their fitness goals with FitTrack.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full text-black font-semibold hover:shadow-[0_0_35px_rgba(255,165,0,0.7)] transition-all"
            >
              Join the FitTrack Revolution
            </motion.button>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default AboutPage;

