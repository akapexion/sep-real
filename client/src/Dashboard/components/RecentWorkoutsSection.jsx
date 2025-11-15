// src/Dashboard/components/RecentWorkoutsSection.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";

const RecentWorkoutsSection = () => {
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weights, setWeights] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Other");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return toast.error("User not logged in");

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/workouts`, {
        params: { userId },
      });
      setWorkouts(res.data);
    } catch (error) {
      toast.error("Unable to fetch workouts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) return toast.error("User not logged in");

    try {
      const body = {
        userId,
        exerciseName,
        sets,
        reps,
        weights,
        notes,
        category,
        tags,
        date,
      };

      if (editingId) {
        await axios.post(`${API_BASE_URL}/workouts/${editingId}`, body);
        toast.success("Updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/workouts`, body);
        toast.success("Inserted successfully");
      }

      resetForm();
      fetchWorkouts();
    } catch (error) {
      toast.error("Unable to save");
    }
  };

  const handleEdit = (workout) => {
    setExerciseName(workout.exerciseName);
    setSets(workout.sets);
    setReps(workout.reps);
    setWeights(workout.weights);
    setNotes(workout.notes);
    setCategory(workout.category);
    setTags(workout.tags);
    setDate(new Date(workout.date).toISOString().split("T")[0]);
    setEditingId(workout._id);
  };

  const handleDelete = (id) => {
    showDeleteConfirm({
      message: "Are you sure you want to delete this workout?",
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/workouts/${id}`);
          toast.success("Deleted successfully");
          fetchWorkouts();
        } catch (error) {
          toast.error("Unable to delete");
        }
      },
    });
  };

  const resetForm = () => {
    setExerciseName("");
    setReps("");
    setSets("");
    setWeights("");
    setNotes("");
    setCategory("Other");
    setTags("");
    setDate(new Date().toISOString().split("T")[0]);
    setEditingId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <Toaster />

      <h3 className="text-xl font-semibold mb-6" style={{ color: "var(--accent)" }}>
        {editingId ? "Edit Workout" : "Add Workout"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Exercise Name</label>
        <input
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border"
          style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
        />

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Sets</label>
            <input
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              min="1"
              required
              className="w-full px-4 py-2 rounded border"
              style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Reps</label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              min="1"
              required
              className="w-full px-4 py-2 rounded border"
              style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Weight (kg)</label>
            <input
              type="number"
              value={weights}
              onChange={(e) => setWeights(e.target.value)}
              step="0.5"
              className="w-full px-4 py-2 rounded border"
              style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
            />
          </div>
        </div>

        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded border"
          style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
        />

        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 rounded border"
          style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
        >
          {['Strength', 'Cardio', 'Yoga', 'HIIT', 'Mobility', 'Other'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Tags</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 rounded border"
          style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
        />

        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border"
          style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
        />

        <button
          type="submit"
          className="w-full py-3 mt-4 font-medium text-white rounded-lg"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {editingId ? "Update Workout" : "Save Workout"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full py-3 mt-2 font-medium text-white rounded-lg bg-gray-500"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h3 className="text-xl font-semibold my-6" style={{ color: "var(--accent)" }}>
        Recent Workouts
      </h3>

      {loading ? (
        <p className="text-center py-4" style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : workouts.length === 0 ? (
        <p className="text-center py-4" style={{ color: "var(--text-muted)" }}>
          No workouts found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="min-w-full divide-y divide-[var(--border)]">
            <thead className="bg-[var(--bg-card-hover)]">
              <tr>
                {["Date","Exercise","Sets","Reps","Weight","Category","Tags","Notes","Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border)]">
              {workouts.map((w) => (
                <tr key={w._id} className="hover:bg-[var(--bg-card-hover)] transition-colors duration-150">
                  <td className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>
                    {new Date(w.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>
                    {w.exerciseName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>
                    {w.sets}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>
                    {w.reps}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>
                    {w.weights}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>
                    {w.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>
                    {w.tags}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>
                    {w.notes}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(w)}
                      className="mr-3 font-medium transition-colors"
                      style={{ color: "var(--accent)" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(w._id)}
                      className="font-medium transition-colors"
                      style={{ color: "#ef4444" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default RecentWorkoutsSection;