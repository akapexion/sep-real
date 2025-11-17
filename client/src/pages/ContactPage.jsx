import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageSquare, Clock } from "lucide-react";



const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      detail: "support@fittrack.com",
      link: "mailto:support@fittrack.com",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      detail: "+92 300 1234567",
      link: "tel:+923001234567",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      detail: "Karachi, Pakistan",
      link: "#",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      detail: "Mon - Sat: 9AM - 6PM",
      link: "#",
    },
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
              <MessageSquare className="w-6 h-6" />
              <p className="uppercase tracking-widest text-xs sm:text-sm">
                Get In Touch
              </p>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Contact{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
                Us
              </span>
            </h1>
            
            <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0e00] to-black"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-b from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:shadow-[0_0_30px_rgba(255,165,0,0.4)] transition-all block"
              >
                <div className="text-yellow-400 mb-4 flex justify-center">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-yellow-300">
                  {info.title}
                </h3>
                <p className="text-gray-300 text-sm">{info.detail}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
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
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-yellow-400/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text px-2">
              Send Us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                  placeholder="How can we help?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full text-black font-semibold hover:shadow-[0_0_35px_rgba(255,165,0,0.7)] transition-all"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-12 sm:py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-[#1a0e00]"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-yellow-400/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center"
          >
            <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-yellow-300">Our Location</h3>
            <p className="text-gray-300 mb-4">Karachi, Pakistan</p>
            <p className="text-gray-400 text-sm px-2">
              Visit us at our headquarters or reach out through any of the contact methods above.
            </p>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default ContactPage;

