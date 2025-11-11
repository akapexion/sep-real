import React from "react";
import { motion } from "framer-motion";
import { Key, Dumbbell, Users, MapPin, Clock, Shield, Star, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const GymKeyPage = () => {
  const features = [
    {
      icon: <Key className="w-10 h-10 text-yellow-400" />,
      title: "Digital Gym Access",
      desc: "Unlock any partner gym with your digital key. No physical cards needed - just your phone.",
    },
    {
      icon: <MapPin className="w-10 h-10 text-orange-400" />,
      title: "Find Nearby Gyms",
      desc: "Discover thousands of gyms in your area. Filter by equipment, amenities, and ratings.",
    },
    {
      icon: <Clock className="w-10 h-10 text-yellow-400" />,
      title: "24/7 Access",
      desc: "Access partner gyms anytime, anywhere. Work out on your schedule, not theirs.",
    },
    {
      icon: <Shield className="w-10 h-10 text-green-400" />,
      title: "Secure & Safe",
      desc: "Your data is protected with bank-level encryption. Your privacy is our priority.",
    },
    {
      icon: <Users className="w-10 h-10 text-orange-400" />,
      title: "Community Access",
      desc: "Connect with other members, share workout tips, and find workout buddies.",
    },
    {
      icon: <Star className="w-10 h-10 text-yellow-400" />,
      title: "Premium Facilities",
      desc: "Access to premium gyms with state-of-the-art equipment and world-class amenities.",
    },
  ];

  const plans = [
    {
      name: "Basic",
      price: "$19",
      period: "/month",
      features: [
        "Access to 100+ gyms",
        "Basic workout tracking",
        "Mobile app access",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Premium",
      price: "$39",
      period: "/month",
      features: [
        "Access to 500+ gyms",
        "Advanced workout tracking",
        "Priority support",
        "Personal trainer discounts",
        "Nutrition planning",
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: "$69",
      period: "/month",
      features: [
        "Unlimited gym access",
        "All premium features",
        "24/7 concierge support",
        "Free personal training sessions",
        "Exclusive gym partnerships",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-[Michroma]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 via-orange-700/10 to-black -z-10"></div>
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-yellow-500/10 blur-3xl rounded-full animate-pulse -z-10"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-orange-600/10 blur-3xl rounded-full animate-pulse -z-10"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-10 text-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4 text-yellow-400">
              <Key className="w-6 h-6" />
              <p className="uppercase tracking-widest text-xs sm:text-sm">
                Your Key to Fitness
              </p>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
                GymKey
              </span>
            </h1>
            
            <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2">
              One key, unlimited gyms. Access thousands of fitness facilities worldwide 
              with a single membership. Your fitness journey, simplified.
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
            Why Choose GymKey?
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
                className="bg-white/10 backdrop-blur-md border border-yellow-400/20 rounded-2xl p-8 hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,165,0,0.4)] transition-all"
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

      {/* Pricing Section */}
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
            Choose Your Plan
          </motion.h2>
          
          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className={`relative rounded-2xl p-8 transition-all ${
                  plan.popular
                    ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 shadow-[0_0_40px_rgba(255,165,0,0.3)]"
                    : "bg-white/5 backdrop-blur-md border border-yellow-400/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-yellow-300">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                      {plan.price}
                    </span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-full font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-black hover:shadow-[0_0_25px_rgba(255,165,0,0.6)]"
                      : "bg-white/10 border border-yellow-400/30 text-yellow-400 hover:bg-white/20"
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0e00] to-black"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { number: "5K+", label: "Partner Gyms" },
              { number: "50K+", label: "Active Members" },
              { number: "100+", label: "Cities" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center"
              >
                <h3 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                  {stat.number}
                </h3>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-[#1a0e00]"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">
              Ready to Unlock Your Fitness Potential?
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Join thousands of members who are already accessing premium gyms worldwide with GymKey.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full text-black font-semibold hover:shadow-[0_0_35px_rgba(255,165,0,0.7)] transition-all"
            >
              Get Your GymKey Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GymKeyPage;

