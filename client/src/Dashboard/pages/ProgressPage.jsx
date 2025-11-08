// src/Dashboard/pages/ProgressPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import ProgressInputSection from "../components/ProgressInputSection";
import ProgressSummarySection from "../components/ProgressSummarySection";

const ProgressPage = () => {
  const [progressEntries, setProgressEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/progress?userId=${userId}`
      );
      setProgressEntries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load progress");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleProgressAdded = () => {
    fetchProgress(); // Refresh after save
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-5xl mx-auto px-4">
        <h1
          className="text-3xl md:text-4xl font-bold mb-10 text-center"
          style={{ color: "var(--accent)" }}
        >
          Track Your Progress
        </h1>

        {/* Input Form */}
        <div className="mb-12">
          <ProgressInputSection onProgressAdded={handleProgressAdded} />
        </div>

        {/* Summary */}
        {loading ? (
          <p className="text-center text-var(--text-muted)">Loading progress...</p>
        ) : (
          <ProgressSummarySection
  progressEntries={progressEntries}
  onProgressUpdate={fetchProgress}
/>
        )}
      </div>
    </motion.div>
  );
};

export default ProgressPage;