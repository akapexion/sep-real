// src/Dashboard/components/ProgressInputSection.jsx
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { usePreferencesContext } from "../pages/PreferencesContext";

const ProgressInputSection = ({ onProgressAdded }) => {
  const { preferences, getWeightUnit, getHeightUnit } = usePreferencesContext();
  const API_BASE_URL = 'http://localhost:3000';
  const [form, setForm] = useState({
    date: "",
    weight: "",
    chest: "",
    waist: "",
    runTime: "",
    liftWeight: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const userId = user._id;
    if (!userId) {
      toast.error("Please log in to save progress");
      return;
    }

    const payload = {
      userId,
      date: form.date,
      weight: form.weight ? parseFloat(form.weight) : null,
      measurements: {
        chest: form.chest ? parseFloat(form.chest) : null,
        waist: form.waist ? parseFloat(form.waist) : null,
      },
      performance: {
        runTime: form.runTime ? parseFloat(form.runTime) : null,
        liftWeight: form.liftWeight ? parseFloat(form.liftWeight) : null,
      },
    };

    try {
      await axios.post(`${API_BASE_URL}/progress`, payload);
      toast.success("Progress saved!");
      setForm({
        date: "",
        weight: "",
        chest: "",
        waist: "",
        runTime: "",
        liftWeight: "",
      });
      onProgressAdded();
    } catch (err) {
      toast.error("Failed to save progress");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-xl shadow-md space-y-5"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <Toaster />
      <h2 className="text-xl font-semibold" style={{ color: "var(--accent)" }}>
        Log New Progress
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Date
          </label>
          <input
            type="date"
            name="date"
            required
            value={form.date}
            onChange={handleChange}
            className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Weight ({getWeightUnit()})
          </label>
          <input
            type="number"
            name="weight"
            placeholder={`Weight (${getWeightUnit()})`}
            step="0.1"
            value={form.weight}
            onChange={handleChange}
            className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Chest ({getHeightUnit()})
          </label>
          <input
            type="number"
            name="chest"
            placeholder={`Chest (${getHeightUnit()})`}
            step="0.1"
            value={form.chest}
            onChange={handleChange}
            className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Waist ({getHeightUnit()})
          </label>
          <input
            type="number"
            name="waist"
            placeholder={`Waist (${getHeightUnit()})`}
            step="0.1"
            value={form.waist}
            onChange={handleChange}
            className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Run Time (min)
          </label>
          <input
            type="number"
            name="runTime"
            placeholder="Run Time (min)"
            step="0.1"
            value={form.runTime}
            onChange={handleChange}
            className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Lift Weight ({getWeightUnit()})
          </label>
          <input
            type="number"
            name="liftWeight"
            placeholder={`Lift Weight (${getWeightUnit()})`}
            step="0.1"
            value={form.liftWeight}
            onChange={handleChange}
            className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-2.5 rounded font-medium text-white transition hover:opacity-90"
        style={{ backgroundColor: "var(--accent)" }}
      >
        Save Progress
      </button>
    </form>
  );
};

export default ProgressInputSection;