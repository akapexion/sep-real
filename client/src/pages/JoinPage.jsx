import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, Calendar, Dumbbell, Check, ArrowRight } from "lucide-react";

import Footer from "../components/Footer";

const JoinPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    plan: "premium",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Form submitted:", formData);
    alert("Welcome to FitTrack! Your account has been created successfully.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      plan: "premium",
    });
  };

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$9",
      period: "/month",
      features: [
        "Workout Tracking",
        "Basic Progress Reports",
        "Mobile App Access",
        "Email Support",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19",
      period: "/month",
      features: [
        "All Basic Features",
        "Advanced Analytics",
        "Nutrition Tracking",
        "Personal Trainer Access",
        "Priority Support",
        "Custom Workout Plans",
      ],
      popular: true,
    },
    {
      id: "elite",
      name: "Elite",
      price: "$39",
      period: "/month",
      features: [
        "All Premium Features",
        "1-on-1 Coaching Sessions",
        "Meal Planning",
        "24/7 Support",
        "Exclusive Content",
        "Early Access to Features",
      ],
    },
  ];

  const benefits = [
    { icon: <Dumbbell className="w-6 h-6" />, text: "Track Your Progress" },
    { icon: <Check className="w-6 h-6" />, text: "Personalized Workouts" },
    { icon: <User className="w-6 h-6" />, text: "Expert Guidance" },
    { icon: <Calendar className="w-6 h-6" />, text: "Flexible Schedule" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-[Michroma]">
      
      
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
              <Dumbbell className="w-6 h-6" />
              <p className="uppercase tracking-widest text-xs sm:text-sm">
                Start Your Journey
              </p>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Join{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
                FitTrack
              </span>
            </h1>
            
            <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2">
              Transform your fitness journey today. Choose a plan and start tracking your progress with our powerful tools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0e00] to-black"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
              >
                <div className="text-yellow-400 mb-3 flex justify-center">
                  {benefit.icon}
                </div>
                <p className="text-gray-300 text-xs sm:text-sm">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans & Form Section */}
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
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Plans Selection */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center lg:text-left bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
                Choose Your Plan
              </h2>
              
              <div className="space-y-4">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative cursor-pointer border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${
                      formData.plan === plan.id
                        ? "border-yellow-500 bg-yellow-500/10 shadow-[0_0_30px_rgba(255,165,0,0.3)]"
                        : "border-yellow-500/30 bg-white/5 hover:border-yellow-500/50"
                    }`}
                    onClick={() => setFormData({ ...formData, plan: plan.id })}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-4">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-yellow-300 mb-1">
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                            {plan.price}
                          </span>
                          <span className="text-gray-400 text-sm">{plan.period}</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.plan === plan.id
                          ? "border-yellow-500 bg-yellow-500"
                          : "border-gray-500"
                      }`}>
                        {formData.plan === plan.id && (
                          <Check className="w-4 h-4 text-black" />
                        )}
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Signup Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md border border-yellow-400/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
                Create Your Account
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full text-black font-semibold hover:shadow-[0_0_35px_rgba(255,165,0,0.7)] transition-all"
                >
                  Create Account <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
                
                <p className="text-center text-gray-400 text-xs sm:text-sm">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
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
              Ready to Transform Your Fitness?
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Join thousands of members who are already achieving their fitness goals with FitTrack.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JoinPage;

