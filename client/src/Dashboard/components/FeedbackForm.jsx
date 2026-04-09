import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, Star, MessageSquare } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const API_BASE = "http://localhost:3000";

const feedbackSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().min(1, "Please enter your email").email("Invalid email format"),
  rating: z.number().min(1, "Please give a rating").max(5),
  message: z.string().trim().min(1, "Please write your feedback")
    .refine(val => /[a-zA-Z0-9]/.test(val), "Must contain at least one letter or number"),
});

// ── Glassmorphism shared styles ──────────────────────────────────────────────
const glassCard = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
};

const glassInput = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "var(--text-primary)",
  borderRadius: "10px",
  transition: "all 0.2s ease",
};

const inputFocusStyle = `
  .glass-input:focus {
    outline: none;
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    background: rgba(255,255,255,0.08) !important;
  }
  .glass-input::placeholder { color: rgba(255,255,255,0.3); }
  .glass-input option { background: var(--bg-card); color: var(--text-primary); }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

export default function FeedbackForm() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: 0,
      message: "",
    },
  });

  const onSubmit = async (data) => {
    if (!userId) {
      toast.error("Please login first!");
      return;
    }

    const payload = { 
      userId, 
      name: data.name, 
      email: data.email, 
      rating: "⭐".repeat(data.rating), 
      message: data.message 
    };

    try {
      await axios.post(`${API_BASE}/feedback`, payload);
      toast.success("Feedback submitted!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Error submitting feedback");
    }
  };

  return (
    <>
      <style>{inputFocusStyle}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 rounded-2xl overflow-hidden"
        style={{ ...glassCard, padding: "1.75rem" }}
      >
        <Toaster toastOptions={{
          style: { ...glassCard, color: "var(--text-primary)", fontSize: "0.875rem" },
        }} />

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <div style={{
            padding: "10px",
            borderRadius: "12px",
            background: "color-mix(in srgb, var(--accent) 15%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
            boxShadow: "0 0 16px color-mix(in srgb, var(--accent) 20%, transparent)",
            animation: "glow-pulse 3s ease-in-out infinite",
          }}>
            <MessageSquare className="w-5 h-5" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Feedback Form
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Share your thoughts with us
            </p>
          </div>
        </div>

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--accent)", letterSpacing: "0.12em" }}>
            ✉️ New Feedback
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-3" noValidate>

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider pl-1"
                style={{ color: "var(--text-muted)" }}>
                Name *
              </label>
              <input
                {...register("name")}
                placeholder="Your name"
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.name ? 'border-red-500' : ''}`}
                style={glassInput}
              />
              {errors.name && (
                <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider pl-1"
                style={{ color: "var(--text-muted)" }}>
                Email *
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Your email"
                className={`glass-input w-full px-3 py-2.5 text-sm ${errors.email ? 'border-red-500' : ''}`}
                style={glassInput}
              />
              {errors.email && (
                <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.email.message}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider pl-1"
                style={{ color: "var(--text-muted)" }}>
                Rating *
              </label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <div
                    className={`flex items-center gap-2 px-3 py-2 ${errors.rating ? 'border-red-500' : ''}`}
                    style={{
                      ...glassInput,
                      borderRadius: "10px",
                      minHeight: "42px",
                      border: errors.rating ? "1px solid #f87171" : glassInput.border
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star
                          className="cursor-pointer transition-all duration-200"
                          style={{
                            color: (hoverRating || field.value) >= star ? "#facc15" : "rgba(255,255,255,0.2)",
                            fill: (hoverRating || field.value) >= star ? "#facc15" : "transparent",
                            filter: (hoverRating || field.value) >= star
                              ? "drop-shadow(0 0 6px rgba(250,204,21,0.6))"
                              : "none",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => field.onChange(star)}
                          size={24}
                        />
                      </motion.div>
                    ))}
                    {field.value > 0 && (
                      <span className="ml-1 text-xs font-medium" style={{ color: "#facc15" }}>
                        {["", "Poor", "Fair", "Good", "Great", "Excellent"][field.value]}
                      </span>
                    )}
                  </div>
                )}
              />
              {errors.rating && (
                <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.rating.message}</p>
              )}
            </div>

            {/* Spacer on md to keep grid aligned */}
            <div className="hidden md:block" />

            {/* Message */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider pl-1"
                style={{ color: "var(--text-muted)" }}>
                Feedback *
              </label>
              <textarea
                {...register("message")}
                placeholder="Write your feedback…"
                rows={4}
                className={`glass-input w-full px-3 py-2.5 text-sm resize-none ${errors.message ? 'border-red-500' : ''}`}
                style={{ ...glassInput, borderRadius: "10px" }}
              />
              {errors.message && (
                <p className="text-xs pl-1" style={{ color: "#f87171" }}>{errors.message.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex gap-2 pt-1">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))",
                  boxShadow: "0 4px 16px color-mix(in srgb, var(--accent) 35%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />}
                {isSubmitting ? "Sending…" : "Submit Feedback"}
              </motion.button>
            </div>

          </form>
        </motion.div>
      </motion.div>
    </>
  );
}