// src/Dashboard/components/GoalsSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Edit2, Plus, Loader2 } from "lucide-react";

const API_BASE = "https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app";

export default function GoalsSection() {
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
        await axios.put(`${API_BASE}/goals/${editingId}`, payload);
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

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await axios.delete(`${API_BASE}/goals/${id}`);
      toast.success("Goal deleted");
      fetchGoals();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const startEdit = (goal) => {
    setEditingId(goal._id);
    setGoalType(goal.goalType);
    setTarget(String(goal.target));
    setCurrent(String(goal.current));
    setDeadline(new Date(goal.deadline).toISOString().split("T")[0]);
    setNotes(goal.notes || "");
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

      <form onSubmit={saveGoal} className="grid md:grid-cols-2 gap-4 mb-6">
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

        <input
          type="number"
          placeholder="Target (e.g. 70 kg)"
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

        <input
          type="number"
          placeholder="Current (e.g. 80 kg)"
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

        <input
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="p-2 rounded-md md:col-span-2"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        />

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
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Target</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Current</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-var(--border)">
            {goals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-var(--text-muted)">No goals set yet</td>
              </tr>
            ) : (
              goals.map((goal) => (
                <tr key={goal._id} className="hover:bg-var(--bg-card-hover)">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{goal.goalType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{goal.target}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{goal.current}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{new Date(goal.deadline).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">
                    {((goal.current / goal.target) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button onClick={() => startEdit(goal)} className="text-var(--accent) mr-2">Edit</button>
                    <button onClick={() => deleteGoal(goal._id)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}