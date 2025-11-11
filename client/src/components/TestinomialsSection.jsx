import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Star, CheckCircle, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Pro Athlete",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    feedback: "Transformed my training. Consistency is now automatic.",
    result: "+28% Strength",
    rating: 5,
    verified: true,
  },
  {
    name: "Ali Raza",
    role: "Fitness Enthusiast",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    feedback: "Lost 12kg in 3 months. Best tracking app ever.",
    result: "12kg Down",
    rating: 4,
    verified: true,
  },
  {
    name: "Sara Malik",
    role: "Trainer",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    feedback: "My clients love the progress charts. Game changer.",
    result: "50+ Clients",
    rating: 5,
    verified: true,
  },
];

const TestimonialCard = ({ testimonial }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-black rounded-2xl p-8 shadow-2xl border border-yellow-500/20 overflow-hidden w-full h-full"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={testimonial.img}
              alt={`${testimonial.name} profile`}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-yellow-400/60"
            />
            <div>
              <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
              <p className="text-sm text-yellow-400">{testimonial.role}</p>
            </div>
            {testimonial.verified && (
              <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
            )}
          </div>
          <p className="text-lg text-gray-300 italic leading-relaxed">
            "{testimonial.feedback}"
          </p>
        </div>

        {/* Bottom Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < testimonial.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-yellow-400">
            <TrendingUp className="w-4 h-4" />
            {testimonial.result}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    clearInterval(intervalRef.current);
  };

  return (
    <section className="relative w-full min-h-screen bg-black flex flex-col justify-center items-center px-6 py-20 font-[Michroma] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/10 via-orange-900/10 to-red-900/10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/10 blur-3xl rounded-full animate-pulse" />

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent z-10"
      >
        Real Results
      </motion.h2>

      {/* Testimonial Card */}
      <div className="relative w-full max-w-md h-[480px] md:h-[520px] z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            onClick={next}
            className="absolute inset-0"
          >
            <TestimonialCard testimonial={testimonials[current]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tap hint */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-gray-400 text-sm mt-8 z-10"
      >
        Tap to see more
      </motion.p>

      {/* Trust Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-20 flex flex-wrap justify-center gap-10 text-center text-gray-400 z-10"
      >
        <div>
          <div className="text-3xl font-bold text-yellow-400">50K+</div>
          <div className="text-xs">Active Users</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-orange-400">4.8 stars</div>
          <div className="text-xs">Rating</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-red-400">1M+</div>
          <div className="text-xs">Workouts</div>
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
