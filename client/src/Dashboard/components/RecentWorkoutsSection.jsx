// src/Dashboard/components/RecentWorkoutsSection.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";
import { Trash2, Edit2, Plus, Loader2 } from "lucide-react";
import { usePreferencesContext } from "../pages/PreferencesContext";
import {z} from 'zod'

const workoutSchema = z.object({
  exerciseName : z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  sets:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  reps:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail hjhjh"
  }),
  weights:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
notes:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
tags:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
date:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
category:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
})
import { useLanguage } from "../pages/UseLanguage";

const RecentWorkoutsSection = () => {
  const { preferences, formatWeight, getWeightUnit } = usePreferencesContext();
  const { t } = useLanguage();
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weights, setWeights] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Other");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");

  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;
    if (!userId) return toast.error(t('userNotLoggedIn'));

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/workouts`, {
        params: { userId },
      });
      setWorkouts(res.data);
    } catch (error) {
      toast.error(t('unableToFetchWorkouts'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
       const result = workoutSchema.safeParse({exerciseName,reps,sets,weights,notes,tags,date,category})
    if(!result.success){
      const formattedErrors = result.error.format();

      setError({

        exerciseName:formattedErrors.exerciseName?._errors[0] || "",
        tags: formattedErrors.tags?._errors[0] || "",
        reps: formattedErrors.reps?._errors[0] || "",
        sets: formattedErrors.sets?._errors[0] || "",
        date: formattedErrors.date?._errors[0] || "",
        category: formattedErrors.category?._errors[0] || "",
        notes: formattedErrors.notes?._errors[0] || "",
        weights: formattedErrors.weights?._errors[0] || "",
      })
      return;
    }
setError("")

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;
    if (!userId) return toast.error(t('userNotLoggedIn'));

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
        toast.success(t('updateSuccessfully'));
      } else {
        await axios.post(`${API_BASE_URL}/workouts`, body);
        toast.success(t('workoutAddedSuccessfully'));
      }

      resetForm();
      fetchWorkouts();
    } catch (error) {
      toast.error(t('unableToSave'));
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
      message: t('deleteWorkoutConfirmation'),
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/workouts/${id}`);
          toast.success(t('deleteSuccessfully'));
          fetchWorkouts();
        } catch (error) {
          toast.error(t('unableToDelete'));
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
        {editingId ? t('editWorkout') : t('addWorkout')}
      </h3>

      <form onSubmit={handleSubmit} className="" noValidate>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
          {t('exerciseName')}
        </label>
        <input
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border"
          style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
        />
<p className="mb-4 text-xs" style={{ color: "red" }}>{error.exerciseName}</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              {t('sets')}
            </label>
            <input
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              min="1"
              required
              className="w-full px-4 py-2 rounded border"
              style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
            />
             <p className="mb-4 text-xs" style={{ color: "red" }}>{error.sets}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              {t('reps')}
            </label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              min="1"
              required
              className="w-full px-4 py-2 rounded border"
              style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
            />
              <p className="mb-4 text-xs" style={{ color: "red" }}>{error.reps}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              {t('weight')} ({getWeightUnit()})
            </label>
            <input
              type="number"
              value={weights}
              onChange={(e) => setWeights(e.target.value)}
              step="0.5"
              className="w-full px-4 py-2 rounded border"
              style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
            />
                      <p className="mb-4 text-xs" style={{ color: "red" }}>{error.weights}</p>
          </div>
        </div>

        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
          {t('notes')}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded border"
          style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
        />
        <p className="mb-4 text-xs" style={{ color: "red" }}>{error.notes}</p>

        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
          {t('category')}
        </label>
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
        <p className="mb-4 text-xs" style={{ color: "red" }}>{error.category}</p>

        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
          {t('tags')}
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 rounded border"
          style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
        />
        <p className="mb-4 text-xs" style={{ color: "red" }}>{error.tags}</p>

        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
          {t('date')}
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border"
          style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
        />
             <p className="mb-4 text-xs" style={{ color: "red" }}>{error.date}</p>

        <button
          type="submit"
          className="w-full py-3 mt-4 font-medium text-white rounded-lg"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {editingId ? t('updateWorkout') : t('saveWorkout')}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full py-3 mt-2 font-medium text-white rounded-lg bg-gray-500"
          >
            {t('cancelEdit')}
          </button>
        )}
      </form>

      <h3 className="text-xl font-semibold my-6" style={{ color: "var(--accent)" }}>
        {t('recentWorkouts')}
      </h3>

      {loading ? (
        <p className="text-center py-4" style={{ color: "var(--text-muted)" }}>
          {t('loading')}…
        </p>
      ) : workouts.length === 0 ? (
        <p className="text-center py-4" style={{ color: "var(--text-muted)" }}>
          {t('noWorkoutsFound')}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="min-w-full divide-y divide-[var(--border)]">
            <thead className="bg-[var(--bg-card-hover)]">
              <tr>
                {[
                  t('date'),
                  t('exercise'),
                  t('sets'),
                  t('reps'),
                  t('weight'),
                  t('category'),
                  t('tags'),
                  t('notes'),
                  t('actions')
                ].map((h) => (
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
                    {formatWeight(w.weights)}
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
                      title={t('edit')}
                    >
                      <Edit2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    </button>
                    <button
                      onClick={() => handleDelete(w._id)}
                      className="font-medium transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
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