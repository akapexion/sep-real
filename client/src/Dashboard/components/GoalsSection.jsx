// src/Dashboard/components/GoalsSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";
import { Trash2, Edit2, Plus, Loader2 } from "lucide-react";
import { usePreferencesContext } from "../pages/PreferencesContext";

const API_BASE = "http://localhost:3000";

export default function GoalsSection() {
  const { preferences, formatWeight } = usePreferencesContext();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [goalType, setGoalType] = useState("weight");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const resetForm = () => {
    setGoalType("weight");
    setTarget("");
    setCurrent("");
    setDeadline(new Date().toISOString().split("T")[0]);
    setNotes("");
    setEditingId(null);
  };

  const fetchGoals = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/goals?userId=${userId}`);
      setGoals(res.data);
    } catch (err) {
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveGoal = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("You must be logged in");

    const payload = {
      userId,
      goalType,
      target: Number(target),
      current: Number(current),
      deadline,
      notes,
    };

    setSaving(true);
    try {
      if (editingId) {
        await axios.post(`${API_BASE}/goals/${editingId}`, payload);
        toast.success("Goal updated");
      } else {
        await axios.post(`${API_BASE}/goals`, payload);
        toast.success("Goal added");
      }
      resetForm();
      fetchGoals();
    } catch (err) {
      toast.error(editingId ? "Update failed" : "Add failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteGoal = (id) => {
    showDeleteConfirm({
      message: "Are you sure you want to delete this goal?",
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE}/goals/${id}`);
          toast.success("Goal deleted successfully");
          fetchGoals();
        } catch (error) {
          toast.error("Unable to delete");
        }
      },
    });
  };

  const startEdit = (goal) => {
    setEditingId(goal._id);
    setGoalType(goal.goalType);
    setTarget(String(goal.target));
    setCurrent(String(goal.current));
    setDeadline(new Date(goal.deadline).toISOString().split("T")[0]);
    setNotes(goal.notes || "");
  };

  const isWeightRelated = (goalType) => {
    return goalType.toLowerCase().includes('weight') || 
           goalType.toLowerCase().includes('loss') || 
           goalType.toLowerCase().includes('gain');
  };

  const isLossGoal = (goalType) => {
    return goalType.toLowerCase().includes('loss') || 
           goalType.toLowerCase().includes('reduce');
  };

  const calculateProgress = (goal) => {
    const { goalType, current, target } = goal;
    
    if (current === 0 && target === 0) return 0;
    if (target === 0) return 0;

    if (isLossGoal(goalType)) {
      // For weight loss: progress increases as current weight decreases
      // Example: Start 80kg, Target 70kg -> Progress based on how close to 70kg
      const startWeight = Math.max(current, target); // Assume starting from higher weight
      const totalToLose = startWeight - target;
      const alreadyLost = startWeight - current;
      
      if (totalToLose <= 0) return 100; // Already at or below target
      const progress = (alreadyLost / totalToLose) * 100;
      return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
    } else {
      // For gain goals: progress increases as current increases toward target
      // Example: Start 50kg, Target 60kg -> Progress based on how close to 60kg
      const startValue = Math.min(current, target); // Assume starting from lower value
      const totalToGain = target - startValue;
      const alreadyGained = current - startValue;
      
      if (totalToGain <= 0) return 100; // Already at or above target
      const progress = (alreadyGained / totalToGain) * 100;
      return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getProgressStatus = (goal) => {
    const progress = calculateProgress(goal);
    
    if (progress >= 100) {
      return isLossGoal(goal.goalType) ? "Goal Achieved! 🎉" : "Goal Achieved! 🎉";
    }
    
    const daysRemaining = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) {
      return "Overdue";
    } else if (daysRemaining === 0) {
      return "Due today";
    } else if (daysRemaining === 1) {
      return "1 day left";
    } else {
      return `${daysRemaining} days left`;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--accent)" }}>
        Fitness Goals
      </h3>

      <Toaster />

      <form onSubmit={saveGoal} className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Goal Type
          </label>
          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
            className="p-2 rounded-md"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
            required
          >
            {["Weight Loss", "Muscle Gain", "Run Distance", "Lift Target", "Other"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Deadline
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="p-2 rounded-md"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Target
          </label>
          <input
            type="number"
            placeholder={isWeightRelated(goalType) ? `Target (${preferences?.units === 'imperial' ? 'lbs' : 'kg'})` : "Target"}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="p-2 rounded-md"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Current
          </label>
          <input
            type="number"
            placeholder={isWeightRelated(goalType) ? `Current (${preferences?.units === 'imperial' ? 'lbs' : 'kg'})` : "Current"}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="p-2 rounded-md"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
            required
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Notes
          </label>
          <input
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="p-2 rounded-md"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          />
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : editingId ? (
              <Edit2 className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {saving ? "Saving…" : editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-md font-medium"
              style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" style={{ borderColor: "var(--border)" }}>
          <thead style={{ backgroundColor: "var(--bg-secondary)" }}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Target</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Current</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Deadline</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Progress</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {goals.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>No goals set yet</td>
              </tr>
            ) : (
              goals.map((goal) => {
                const progress = calculateProgress(goal);
                const progressColor = getProgressColor(progress);
                const status = getProgressStatus(goal);
                
                return (
                  <tr key={goal._id} className="hover:bg-var(--bg-card-hover)">
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>{goal.goalType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>
                      {isWeightRelated(goal.goalType) ? formatWeight(goal.target) : goal.target}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>
                      {isWeightRelated(goal.goalType) ? formatWeight(goal.current) : goal.current}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "var(--text-primary)" }}>
                      {new Date(goal.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div 
                            className={`h-2 rounded-full ${progressColor}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ 
                      color: progress >= 100 ? "var(--success)" : 
                            status === "Overdue" ? "var(--error)" : "var(--text-primary)" 
                    }}>
                      {status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => startEdit(goal)} className="mr-2">
                        <Edit2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
                      </button>
                      <button onClick={() => deleteGoal(goal._id)}>
                        <Trash2 className="w-4 h-4" style={{ color: "var(--error)" }} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}