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
  const [editingEntry, setEditingEntry] = useState(null);

  const fetchProgress = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app/progress?userId=${userId}`
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

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(
        `https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app/progress/${id}`
      );
      toast.success("Entry deleted");
      fetchProgress();
    } catch (err) {
      toast.error("Failed to delete entry");
      console.error(err);
    }
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

        {/* Input Form - Handles both Add and Edit */}
        <div className="mb-12">
          <ProgressInputSection 
            onProgressAdded={handleProgressAdded} 
            editingEntry={editingEntry}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {loading ? (
          <p className="text-center text-var(--text-muted)">Loading progress...</p>
        ) : (
          <ProgressSummarySection
            progressEntries={progressEntries}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onProgressUpdate={fetchProgress}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ProgressPage;