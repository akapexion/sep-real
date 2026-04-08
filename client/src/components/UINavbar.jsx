import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { X, Menu } from "lucide-react";

// ── Glassmorphism shared styles (mirrors RemindersSection) ───────────────────
const injectStyles = `
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }
  .nav-link-hover {
    position: relative;
    transition: color 0.2s ease;
  }
  .nav-link-hover::after {
    content: '';
    position: absolute;
    left: 0; bottom: -3px;
    width: 0; height: 2px;
    border-radius: 999px;
    background: var(--accent);
    transition: width 0.25s ease;
  }
  .nav-link-hover:hover::after { width: 100%; }
`;
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "About", "Contact"];

const UINavbar = () => {
  const [isScrolled, setIsScrolled]           = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const activePage =
    location.pathname === "/"
      ? "home"
      : location.pathname.replace("/", "").toLowerCase();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <>
      <style>{injectStyles}</style>

      <motion.nav
        className="fixed top-0 z-50 w-full flex flex-col items-center"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── Main pill ── */}
        <motion.div
          animate={{
            background: isScrolled
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0)",
            backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
            WebkitBackdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
            borderColor: isScrolled
              ? "rgba(255,255,255,0.10)"
              : "rgba(255,255,255,0)",
            boxShadow: isScrolled
              ? "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "0 0 0 rgba(0,0,0,0)",
            width: isScrolled ? "92%" : "97%",
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            width: { duration: 0.25, ease: "easeInOut" },
          }}
          className="mx-auto flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 rounded-full mt-3"
          style={{ border: "1px solid transparent" }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.img
              src="/logo-blue.png"
              alt="FitTrack Logo"
              animate={{ scale: isScrolled ? 0.88 : 1 }}
              whileHover={{ scale: isScrolled ? 0.92 : 1.04 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-8 sm:h-10 md:h-11 w-auto object-contain"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {NAV_LINKS.map((name) => {
              const isActive = activePage === name.toLowerCase();
              return (
                <Link
                  key={name}
                  to={`/${name === "Home" ? "" : name.toLowerCase()}`}
                  className="nav-link-hover text-sm xl:text-base font-medium"
                  style={{
                    color: isActive ? "var(--accent)" : "var(--text-muted)",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-1 w-full h-[2px] rounded-full"
                      style={{ background: "var(--accent)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA button (desktop) */}
          <div className="hidden lg:block">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to={isLoggedIn ? "/dashboard" : "/login"}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))",
                  boxShadow: "0 4px 16px color-mix(in srgb, var(--accent) 35%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
                  animation: "glow-pulse 3s ease-in-out infinite",
                }}
              >
                {isLoggedIn ? "Dashboard" : "Login"}
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--accent)",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate:  90, opacity: 0 }}
                  transition={{ duration: 0.15 }}>
                  <X className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span key="open"
                  initial={{ rotate: 90,  opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}>
                  <Menu className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* ── Mobile menu dropdown ── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{   opacity: 0, y: -8, scale: 0.98  }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden w-[92%] mx-auto mt-1 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {/* Section label */}
              <p className="px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--accent)", letterSpacing: "0.12em", opacity: 0.8 }}>
                Navigation
              </p>

              <div className="px-3 pb-3 space-y-0.5">
                {NAV_LINKS.map((name, i) => {
                  const isActive = activePage === name.toLowerCase();
                  return (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1,  x: 0   }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                    >
                      <Link
                        to={`/${name === "Home" ? "" : name.toLowerCase()}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200"
                        style={{
                          color:      isActive ? "var(--text-primary)" : "var(--text-muted)",
                          fontWeight: isActive ? 600 : 400,
                          background: isActive
                            ? "color-mix(in srgb, var(--accent) 14%, transparent)"
                            : "transparent",
                          border: isActive
                            ? "1px solid color-mix(in srgb, var(--accent) 28%, transparent)"
                            : "1px solid transparent",
                        }}
                      >
                        {/* Active accent dot */}
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                          background: isActive ? "var(--accent)" : "rgba(255,255,255,0.15)",
                          boxShadow: isActive ? "0 0 6px var(--accent)" : "none",
                        }} />
                        <span className="text-sm">{name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="px-3 pb-4">
                <Link
                  to={isLoggedIn ? "/dashboard" : "/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))",
                    boxShadow: "0 4px 16px color-mix(in srgb, var(--accent) 35%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
                  }}
                >
                  {isLoggedIn ? "Dashboard" : "Login"}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default UINavbar;