// src/Dashboard/pages/RemindersPage.jsx
import React from "react";
import { motion } from "framer-motion";
import RemindersSection from "../components/RemindersSection";

export default function RemindersPage() {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="p-8">
      <h2 className="text-2xl font-bold mb-4" style={{color:"var(--accent)"}}>Reminders & Alerts</h2>
      <p className="mb-6" style={{color:"var(--text-muted)"}}>
        Create, edit or delete personal reminders for workouts, meals or goals.
      </p>
      <RemindersSection />
    </motion.div>
  );
}