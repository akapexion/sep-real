import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const UINavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Active page detect karna
  const activePage =
    location.pathname === "/"
      ? "home"
      : location.pathname.replace("/", "").toLowerCase();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <motion.nav
      className="fixed top-0 z-50 w-full"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Main Navbar Container */}
      <motion.div
        style={{ willChange: "transform, background, filter, box-shadow" }}
        animate={{
          background: isScrolled
            ? "linear-gradient(135deg, rgba(20,20,20,0.7), rgba(0,0,0,0.4))"
            : "rgba(0,0,0,0)",
          border: isScrolled
            ? "1px solid rgba(255,215,0,0.25)"
            : "1px solid transparent",
          boxShadow: isScrolled
            ? "0 4px 25px rgba(255,215,0,0.15)"
            : "0 4px 30px rgba(0,0,0,0)",
          backdropFilter: isScrolled ? "blur(16px)" : "blur(0px)",
          scale: isScrolled ? 0.97 : 1,
          width: isScrolled ? "95%" : "98%",
        }}
        transition={{
          background: { duration: 0.25, ease: "easeInOut" },
          border: { duration: 0.2, ease: "easeOut" },
          boxShadow: { duration: 0.25, ease: "easeInOut" },
          backdropFilter: { duration: 0.3, ease: "easeOut" },
          scale: { duration: 0.2, ease: "easeOut" },
          width: { duration: 0.25, ease: "easeInOut" },
        }}
        className="mx-auto flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-full mt-2 transition-all duration-300"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            animate={{ scale: isScrolled ? 0.9 : 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <img
              src="/logo.png"
              alt="FitTrack Logo"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            />
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
          {["Home", "About", "Contact"].map((name) => {
            const isActive = activePage === name.toLowerCase();
            return (
              <Link
                key={name}
                to={`/${name === "Home" ? "" : name.toLowerCase()}`}
                className={`relative font-medium text-sm xl:text-base transition duration-300 ${isActive ? "text-cyan-400 font-extrabold" : "text-white opacity-80 hover:opacity-100 hover:text-cyan-300"
                  }`}
              >
                {name}
                {isActive && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Button (Desktop Only) */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <Link
            to={isLoggedIn ? "/dashboard" : "/login"}
            className="bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold px-4 xl:px-6 py-2.5 text-sm xl:text-base rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:scale-105"
          >
            {isLoggedIn ? "Dashboard" : "Login"}
          </Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-cyan-400 transition"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-cyan-500/20 z-10"
          >
            <div className="px-4 py-4 space-y-4 flex flex-col items-center">
              {["Home", "About", "Contact"].map(
                (name) => (
                  <Link
                    key={name}
                    to={`/${name === "Home" ? "" : name.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block transition ${activePage === name.toLowerCase()
                      ? "text-cyan-400 font-extrabold"
                      : "text-white opacity-80"
                      }`}
                  >
                    {name}
                  </Link>
                )
              )}
              <Link
                to={isLoggedIn ? "/dashboard" : "/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block bg-gradient-to-r from-cyan-400 to-blue-600 text-black text-center py-3 rounded-full font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)] w-full"
              >
                {isLoggedIn ? "Dashboard" : "Log In"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default UINavbar;
