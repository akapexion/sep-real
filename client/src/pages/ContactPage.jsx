import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageSquare, Clock, ArrowRight } from "lucide-react";

// ── Injected styles (mirrors Hero / Footer / ComingSoon / AboutPage) ───────
const contactPageStyles = `
  @keyframes float-orb {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.08); }
    66%       { transform: translate(-20px, 15px) scale(0.95); }
  }
  @keyframes grid-fade {
    0%   { opacity: 0.03; }
    50%  { opacity: 0.06; }
    100% { opacity: 0.03; }
  }
  @keyframes badge-glow {
    0%, 100% { box-shadow: 0 0 10px color-mix(in srgb, var(--accent) 30%, transparent); }
    50%       { box-shadow: 0 0 22px color-mix(in srgb, var(--accent) 55%, transparent); }
  }
  @keyframes shimmer-line {
    0%   { opacity: 0; transform: scaleX(0); }
    50%  { opacity: 1; }
    100% { opacity: 0; transform: scaleX(1); }
  }
  @keyframes bottom-bar-slide {
    0%   { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  .cp-info-card {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.09);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
    transition: all 0.25s ease;
    text-decoration: none;
    display: block;
  }
  .cp-info-card:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, transparent) !important;
    box-shadow: 0 0 28px color-mix(in srgb, var(--accent) 12%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    transform: translateY(-5px);
  }
  .cp-input {
    width: 100%;
    padding: 12px 18px;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    color: var(--text-primary, #fff);
    font-family: inherit;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .cp-input::placeholder { color: rgba(255,255,255,0.25); }
  .cp-input:focus {
    border-color: color-mix(in srgb, var(--accent) 50%, transparent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 12%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.05) !important;
  }
  .cp-submit-btn {
    transition: all 0.25s ease;
    border: none;
    cursor: pointer;
  }
  .cp-submit-btn:hover {
    box-shadow: 0 0 36px color-mix(in srgb, var(--accent) 65%, transparent) !important;
    transform: scale(1.03);
  }
  .cp-submit-btn:active { transform: scale(0.97); }
`;

const CONTACT_INFO = [
  { icon: Mail,         title: "Email Us",       detail: "support@fittrack.com", link: "mailto:support@fittrack.com" },
  { icon: Phone,        title: "Call Us",         detail: "+92 300 1234567",      link: "tel:+923001234567"           },
  { icon: MapPin,       title: "Visit Us",        detail: "Karachi, Pakistan",    link: "#"                          },
  { icon: Clock,        title: "Working Hours",   detail: "Mon–Sat: 9AM – 6PM",  link: "#"                          },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <style>{contactPageStyles}</style>

      <div
        className="min-h-screen font-[Michroma] relative transition-colors duration-300"
        style={{ background: "var(--bg-primary, #0a0a0a)" }}
      >
        {/* ── Persistent background ───────────────────────────────────── */}
        <div
          className="fixed inset-0 -z-20"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 60% 30%, rgba(34,211,238,0.07) 0%, transparent 60%)," +
              "radial-gradient(ellipse 80% 60% at 20% 80%, rgba(59,130,246,0.06) 0%, transparent 55%)," +
              "var(--bg-primary, #0a0a0a)",
          }}
        />
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            animation: "grid-fade 6s ease-in-out infinite",
          }}
        />

        {/* Floating orbs */}
        <div className="fixed -z-10" style={{ top: "10%", left: "4%",  width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)", filter: "blur(40px)", animation: "float-orb 10s ease-in-out infinite" }} />
        <div className="fixed -z-10" style={{ bottom: "8%", right: "4%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)", filter: "blur(50px)", animation: "float-orb 13s ease-in-out infinite reverse" }} />
        <div className="fixed -z-10" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 65%)", filter: "blur(60px)", animation: "float-orb 18s ease-in-out infinite" }} />

        {/* Corner accents */}
        <div className="fixed top-8 left-8 w-20 h-20 border-t border-l rounded-tl-xl z-0" style={{ borderColor: "color-mix(in srgb, var(--accent) 20%, transparent)" }} />
        <div className="fixed bottom-8 right-8 w-20 h-20 border-b border-r rounded-br-xl z-0" style={{ borderColor: "color-mix(in srgb, var(--accent) 20%, transparent)" }} />

        {/* ════════════════════════════════════════════════════════════ */}
        {/* HERO                                                         */}
        {/* ════════════════════════════════════════════════════════════ */}
        <section className="relative pt-28 sm:pt-32 pb-20 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 text-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 mb-6 px-4 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
                animation: "badge-glow 3s ease-in-out infinite",
                color: "var(--accent)",
              }}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="uppercase tracking-widest text-xs font-semibold">Get In Touch</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              <span style={{ color: "var(--text-primary, #fff)" }}>Contact </span>
              <span className="relative inline-block font-extrabold" style={{ color: "var(--accent)" }}>
                Us
                <span style={{
                  position: "absolute", bottom: -4, left: 0, right: 0, height: 2,
                  background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                  borderRadius: 2,
                  animation: "shimmer-line 3s ease-in-out infinite",
                }} />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Have questions? We'd love to hear from you. Send us a message and we'll
              respond as soon as possible.
            </motion.p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* CONTACT INFO CARDS                                           */}
        {/* ════════════════════════════════════════════════════════════ */}
        <section className="relative py-4 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {CONTACT_INFO.map(({ icon: Icon, title, detail, link }, i) => (
                <motion.a
                  key={title}
                  href={link}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="cp-info-card rounded-2xl p-6 text-center"
                >
                  {/* Icon in glass pill */}
                  <div
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                    style={{
                      background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="text-sm font-bold mb-1 uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                    {title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{detail}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* CONTACT FORM                                                 */}
        {/* ════════════════════════════════════════════════════════════ */}
        <section className="relative py-20 sm:py-24 z-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="rounded-3xl p-8 sm:p-10 md:p-12"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                boxShadow: "0 0 60px color-mix(in srgb, var(--accent) 8%, transparent), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              {/* Form heading */}
              <div className="text-center mb-8">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 relative inline-block"
                  style={{ color: "var(--accent)" }}
                >
                  Send Us a Message
                  <span style={{
                    position: "absolute", bottom: -6, left: 0, right: 0, height: 2,
                    background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                    borderRadius: 2,
                    animation: "shimmer-line 3s ease-in-out infinite",
                  }} />
                </h2>
              </div>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                    style={{
                      background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
                    }}
                  >
                    <Send className="w-7 h-7" style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "var(--accent)" }}>Message Sent!</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
                      color: "var(--accent)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email row */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="cp-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="cp-input"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className="cp-input"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      className="cp-input"
                      style={{ resize: "none" }}
                    />
                  </div>

                  {/* Submit — same primary btn as Hero/AboutPage */}
                  <button
                    type="submit"
                    className="cp-submit-btn w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-black text-sm uppercase tracking-widest"
                    style={{
                      background: "var(--accent)",
                      boxShadow: "0 0 20px color-mix(in srgb, var(--accent) 40%, transparent)",
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* LOCATION CARD                                                */}
        {/* ════════════════════════════════════════════════════════════ */}
        <section className="relative pb-20 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="rounded-3xl p-10 sm:p-14 text-center"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                style={{
                  background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                }}
              >
                <MapPin className="w-7 h-7" style={{ color: "var(--accent)" }} />
              </div>
              <h3
                className="text-xl sm:text-2xl font-bold mb-2 uppercase tracking-wide"
                style={{ color: "var(--accent)" }}
              >
                Our Location
              </h3>
              <p className="text-base mb-2" style={{ color: "var(--text-secondary)" }}>Karachi, Pakistan</p>
              <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
                Visit us at our headquarters or reach out through any of the contact methods above.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Bottom glow bar ─────────────────────────────────────────── */}
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, var(--accent), #3b82f6, #facc15, var(--accent))",
            backgroundSize: "200%",
            animation: "bottom-bar-slide 4s linear infinite",
          }}
        />
      </div>
    </>
  );
};

export default ContactPage;