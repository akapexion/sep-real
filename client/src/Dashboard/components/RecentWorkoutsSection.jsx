// src/Dashboard/components/RecentWorkoutsSection.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const RecentWorkoutsSection = () => {
  // ——— ALL useState (8 fields) ———
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weights, setWeights] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Other");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Additional state for fetched workouts, editing, etc.
  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app'; 

  // Fetch workouts on component mount
  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/workouts`, { userId });
      setWorkouts(res.data);
    } catch (error) {
      toast.error("Unable to fetch workouts");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
    try {
      if (editingId) {
        // Update existing workout
        const res = await axios.put(`${API_BASE_URL}/workouts/${editingId}`, {
          userId,
          exerciseName,
          sets,
          reps,
          weights,
          notes,
          category,
          tags,
          date
        });
        toast.success("Updated successfully");
        console.log(res.data.message);
      } else {
        // Add new workout
        const res = await axios.post(`${API_BASE_URL}/workouts`, {
          userId,
          exerciseName,
          sets,
          reps,
          weights,
          notes,
          category,
          tags,
          date
        });
        toast.success("Inserted successfully");
        console.log(res.data.message);
      }
      resetForm();
      fetchWorkouts(); // Refresh the list
    } catch (error) {
      toast.error("Unable to save" + error);
      console.log(error);
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

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/workouts/${id}`);
      toast.success("Deleted successfully");
      console.log(res.data.message);
      fetchWorkouts(); // Refresh the list
    } catch (error) {
      toast.error("Unable to delete" + error);
      console.log(error);
    }
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
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <h3
        className="text-xl font-semibold mb-6"
        style={{ color: "var(--accent)" }}
      >
        {editingId ? "Edit Workout" : "Add Workout"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Exercise Name"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />

        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            min="1"
            required
            className="px-4 py-2 rounded border"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            min="1"
            required
            className="px-4 py-2 rounded border"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weights}
            onChange={(e) => setWeights(e.target.value)}
            step="0.5"
            className="px-4 py-2 rounded border"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded border"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 rounded border"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        >
          {["Strength", "Cardio", "Yoga", "HIIT", "Mobility", "Other"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 rounded border"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
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
            className="w-full py-3 mt-2 font-medium text-white rounded-lg"
            style={{ backgroundColor: "gray" }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h3
        className="text-xl font-semibold my-6"
        style={{ color: "var(--accent)" }}
      >
        Recent Workouts
      </h3>

      {loading ? (
        <p>Loading...</p>
      ) : workouts.length === 0 ? (
        <p>No workouts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workouts.map((workout) => (
                <tr key={workout._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(workout.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{workout.exerciseName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{workout.sets}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{workout.reps}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{workout.weights}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{workout.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{workout.tags}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{workout.notes}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(workout)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(workout._id)}
                      className="text-red-600 hover:text-red-900"
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