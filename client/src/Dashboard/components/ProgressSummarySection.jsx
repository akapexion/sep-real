// src/Dashboard/components/ProgressSummarySection.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import toast from "react-hot-toast";

const ProgressSummarySection = ({ progressEntries = [], onEditEntry, onDeleteEntry, onProgressUpdate }) => {
  const chartData = progressEntries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    weight: entry.weight ?? 0,
    chest: entry.measurements?.chest ?? 0,
    waist: entry.measurements?.waist ?? 0,
    runTime: entry.performance?.runTime ?? 0,
    liftWeight: entry.performance?.liftWeight ?? 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 rounded-xl shadow-md"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <h3 className="text-2xl font-bold mb-6" style={{ color: "var(--accent)" }}>
        Progress Summary
      </h3>

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-var(--border)">
          <thead style={{ backgroundColor: "var(--bg-secondary)" }}>
            <tr>
              {["Date", "Weight", "Chest", "Waist", "Run Time", "Lift Weight", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-var(--border)">
            {progressEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-var(--text-muted)">
                  No progress recorded yet.
                </td>
              </tr>
            ) : (
              progressEntries.map((e) => (
                <tr key={e._id} className="hover:bg-var(--bg-card-hover)">
                  <td className="px-4 py-3 text-sm">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">{e.weight ?? "-"}</td>
                  <td className="px-4 py-3 text-sm">{e.measurements?.chest ?? "-"}</td>
                  <td className="px-4 py-3 text-sm">{e.measurements?.waist ?? "-"}</td>
                  <td className="px-4 py-3 text-sm">{e.performance?.runTime ?? "-"}</td>
                  <td className="px-4 py-3 text-sm">{e.performance?.liftWeight ?? "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-1">
                      <button
                        onClick={() => onEditEntry(e)}
                        className="px-2 py-1 text-xs rounded text-white"
                        style={{ backgroundColor: "#10b981" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteEntry(e._id)}
                        className="px-2 py-1 text-xs rounded bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {progressEntries.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4" style={{ color: "var(--accent)" }}>
            Progress Over Time
          </h4>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-secondary)" }} />
              <YAxis tick={{ fill: "var(--text-secondary)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg)" strokeWidth={2} />
              <Line type="monotone" dataKey="chest" stroke="#82ca9d" name="Chest (cm)" strokeWidth={2} />
              <Line type="monotone" dataKey="waist" stroke="#ffc658" name="Waist (cm)" strokeWidth={2} />
              <Line type="monotone" dataKey="runTime" stroke="#ff7300" name="Run Time (min)" strokeWidth={2} />
              <Line type="monotone" dataKey="liftWeight" stroke="#a4de6c" name="Lift Weight (kg)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default ProgressSummarySection;