// src/Dashboard/components/ProgressSummarySection.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Download, FileText, Trash2, Edit2, TrendingUp, Loader2 } from "lucide-react";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";
import { useLanguage } from "../pages/UseLanguage";
import { usePreferencesContext } from "../pages/PreferencesContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_BASE_URL = "http://localhost:3000";

// ── Glassmorphism shared styles ──────────────────────────────────────────────
const glassCard = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
};

const glassInput = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "var(--text-primary)",
  borderRadius: "10px",
  transition: "all 0.2s ease",
};

const sharedStyles = `
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }
  .glass-input:focus {
    outline: none;
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    background: rgba(255,255,255,0.08) !important;
  }
  .glass-input::placeholder { color: rgba(255,255,255,0.3); }
  .glass-input::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
  .glass-input[type="number"]::-webkit-inner-spin-button,
  .glass-input[type="number"]::-webkit-outer-spin-button { opacity: 0.4; }
  .row-hover:hover {
    background: rgba(255,255,255,0.04) !important;
    transition: background 0.2s ease;
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

export default function ProgressSummarySection({ progressEntries = [], onProgressUpdate }) {
  const printRef = useRef();
  const { getWeightUnit, getHeightUnit } = usePreferencesContext();
  const { t } = useLanguage();

  const [editingId, setEditingId]   = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [updating, setUpdating]     = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setEditForm({
      date:       entry.date.split("T")[0],
      weight:     entry.weight ?? "",
      chest:      entry.measurements?.chest ?? "",
      waist:      entry.measurements?.waist ?? "",
      runTime:    entry.performance?.runTime ?? "",
      liftWeight: entry.performance?.liftWeight ?? "",
    });
  };

  const handleCancel = () => { setEditingId(null); setEditForm({}); };

  const handleUpdate = async () => {
    const user   = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id;
    if (!userId) return toast.error(t("pleaseLogin"));

    const payload = {
      userId,
      date:   editForm.date,
      weight: editForm.weight     ? parseFloat(editForm.weight)     : null,
      measurements: {
        chest: editForm.chest     ? parseFloat(editForm.chest)      : null,
        waist: editForm.waist     ? parseFloat(editForm.waist)      : null,
      },
      performance: {
        runTime:    editForm.runTime    ? parseFloat(editForm.runTime)    : null,
        liftWeight: editForm.liftWeight ? parseFloat(editForm.liftWeight) : null,
      },
    };

    setUpdating(true);
    try {
      await axios.post(`${API_BASE_URL}/progress/${editingId}`, payload);
      toast.success(t("progressUpdated"));
      setEditingId(null);
      onProgressUpdate?.();
    } catch (err) {
      console.error(err);
      toast.error(t("updateFailed"));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = (id) => {
    showDeleteConfirm({
      message: t("deleteProgressConfirmation"),
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/progress/${id}`);
          toast.success(t("deleteSuccessfully"));
          onProgressUpdate?.();
        } catch {
          toast.error(t("unableToDelete"));
        }
      },
    });
  };

  const handleInputChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  // ── Export ─────────────────────────────────────────────────────────────────
  const exportPDF = () => {
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html><head><title>${t("progressReport")} – ${new Date().toLocaleDateString()}</title>
      <style>
        body{font-family:Arial,sans-serif;margin:2rem;}
        table{width:100%;border-collapse:collapse;margin-top:1rem;}
        th,td{border:1px solid #ddd;padding:8px;text-align:left;}
        th{background:#f4f4f4;}
      </style></head><body>`);
    win.document.write(printRef.current.innerHTML);
    win.document.write("</body></html>");
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const exportCSV = () => {
    const header = [
      t("date"),
      `${t("weight")}(${getWeightUnit()})`,
      `${t("chest")}(${getHeightUnit()})`,
      `${t("waist")}(${getHeightUnit()})`,
      `${t("runTime")}(${t("minutesShort")})`,
      `${t("liftWeight")}(${getWeightUnit()})`,
    ];
    const rows = progressEntries.map(e => [
      new Date(e.date).toLocaleDateString(),
      e.weight ?? "",
      e.measurements?.chest ?? "",
      e.measurements?.waist ?? "",
      e.performance?.runTime ?? "",
      e.performance?.liftWeight ?? "",
    ]);
    const csv  = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `progress-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Chart ──────────────────────────────────────────────────────────────────
  const sorted = [...progressEntries].sort((a, b) => new Date(a.date) - new Date(b.date));

  const labels = sorted.map(e =>
    new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );

  const bodyChartData = {
    labels,
    datasets: [
      {
        label: `${t("weight")} (${getWeightUnit()})`,
        data: sorted.map(e => e.weight ?? null),
        borderColor: "var(--accent)",
        backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
        borderWidth: 2, tension: 0.4, pointRadius: 4,
        pointBackgroundColor: "var(--accent)",
        pointBorderColor: "rgba(255,255,255,0.2)",
        fill: true,
      },
      {
        label: `${t("chest")} (${getHeightUnit()})`,
        data: sorted.map(e => e.measurements?.chest ?? null),
        borderColor: "#4ade80",
        backgroundColor: "rgba(74,222,128,0.08)",
        borderWidth: 2, tension: 0.4, pointRadius: 4,
        pointBackgroundColor: "#4ade80",
        pointBorderColor: "rgba(255,255,255,0.2)",
        fill: true,
      },
      {
        label: `${t("waist")} (${getHeightUnit()})`,
        data: sorted.map(e => e.measurements?.waist ?? null),
        borderColor: "#facc15",
        backgroundColor: "rgba(250,204,21,0.08)",
        borderWidth: 2, tension: 0.4, pointRadius: 4,
        pointBackgroundColor: "#facc15",
        pointBorderColor: "rgba(255,255,255,0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255,255,255,0.55)",
          font: { size: 12 },
          usePointStyle: true,
          pointStyleWidth: 8,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15,15,20,0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,0.10)",
        borderWidth: 1,
        titleColor: "rgba(255,255,255,0.9)",
        bodyColor: "rgba(255,255,255,0.65)",
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        grid:  { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "rgba(255,255,255,0.4)", font: { size: 11 } },
      },
      y: {
        grid:  { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "rgba(255,255,255,0.4)", font: { size: 11 } },
      },
    },
  };

  // ── Table column headers ───────────────────────────────────────────────────
  const columnHeaders = [
    t("date"),
    `${t("weight")} (${getWeightUnit()})`,
    `${t("chest")} (${getHeightUnit()})`,
    `${t("waist")} (${getHeightUnit()})`,
    `${t("runTime")} (${t("minutesShort")})`,
    `${t("liftWeight")} (${getWeightUnit()})`,
    t("actions"),
  ];

  const editFields = [
    { name: "date",       type: "date",   placeholder: "" },
    { name: "weight",     type: "number", placeholder: getWeightUnit() },
    { name: "chest",      type: "number", placeholder: getHeightUnit() },
    { name: "waist",      type: "number", placeholder: getHeightUnit() },
    { name: "runTime",    type: "number", placeholder: t("minutesShort") },
    { name: "liftWeight", type: "number", placeholder: getWeightUnit() },
  ];

  return (
    <>
      <style>{sharedStyles}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 rounded-2xl overflow-hidden"
        style={{ ...glassCard, padding: "1.75rem" }}
      >
        <Toaster toastOptions={{
          style: { ...glassCard, color: "var(--text-primary)", fontSize: "0.875rem" },
        }} />

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div style={{
              padding: "10px", borderRadius: "12px",
              background: "color-mix(in srgb, var(--accent) 15%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
              boxShadow: "0 0 16px color-mix(in srgb, var(--accent) 20%, transparent)",
              animation: "glow-pulse 3s ease-in-out infinite",
            }}>
              <TrendingUp className="w-5 h-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {t("progressSummary")}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {sorted.length} {t("entriesRecorded")}
              </p>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={exportPDF}
              title={t("exportPDF")}
              className="p-2 rounded-lg transition-all"
              style={{
                background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
              }}
            >
              <FileText className="w-4 h-4" style={{ color: "var(--accent)" }} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={exportCSV}
              title={t("exportCSV")}
              className="p-2 rounded-lg transition-all"
              style={{
                background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
              }}
            >
              <Download className="w-4 h-4" style={{ color: "var(--accent)" }} />
            </motion.button>
          </div>
        </div>

        <div ref={printRef}>

          {/* ── Table ── */}
          <div className="rounded-xl overflow-hidden mb-8" style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {columnHeaders.map(h => (
                      <th key={h}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {sorted.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div style={{
                              padding: 16, borderRadius: "50%",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}>
                              <TrendingUp className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                            </div>
                            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                              {t("noProgressRecorded")}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : sorted.map((e, i) => (
                      <motion.tr
                        key={e._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                        className="row-hover"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        {editingId === e._id ? (
                          <>
                            {editFields.map(({ name, type, placeholder }) => (
                              <td key={name} className="px-4 py-3">
                                <input
                                  type={type}
                                  name={name}
                                  value={editForm[name]}
                                  onChange={handleInputChange}
                                  placeholder={placeholder}
                                  step={type === "number" ? "0.1" : undefined}
                                  className="glass-input w-full px-3 py-2 text-sm"
                                  style={{ ...glassInput, minWidth: "80px" }}
                                />
                              </td>
                            ))}
                            <td className="px-4 py-3">
                              <div className="flex gap-1.5">
                                <motion.button
                                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  onClick={handleUpdate}
                                  disabled={updating}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                                  style={{
                                    background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))",
                                    boxShadow: "0 2px 10px color-mix(in srgb, var(--accent) 35%, transparent)",
                                    border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
                                  }}
                                >
                                  {updating
                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                    : <Edit2 className="w-3 h-3" />}
                                  {updating ? t("saving") + "…" : t("update")}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  onClick={handleCancel}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                  style={{
                                    ...glassInput,
                                    color: "var(--text-primary)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                  }}
                                >
                                  {t("cancel")}
                                </motion.button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            {/* Date */}
                            <td className="px-5 py-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                  {new Date(e.date).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            {/* Weight */}
                            <td className="px-5 py-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                                style={{
                                  background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                                  color: "var(--accent)",
                                  border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                                }}>
                                {e.weight ?? "–"}
                              </span>
                            </td>
                            {/* Chest */}
                            <td className="px-5 py-4">
                              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                                {e.measurements?.chest ?? "–"}
                              </span>
                            </td>
                            {/* Waist */}
                            <td className="px-5 py-4">
                              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                                {e.measurements?.waist ?? "–"}
                              </span>
                            </td>
                            {/* Run time */}
                            <td className="px-5 py-4">
                              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                                {e.performance?.runTime ?? "–"}
                              </span>
                            </td>
                            {/* Lift weight */}
                            <td className="px-5 py-4">
                              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                                {e.performance?.liftWeight ?? "–"}
                              </span>
                            </td>
                            {/* Actions */}
                            <td className="px-5 py-4">
                              <div className="flex gap-1.5">
                                <motion.button
                                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                                  onClick={() => handleEdit(e)}
                                  className="p-2 rounded-lg transition-all"
                                  style={{
                                    background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                                    border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                                  }}
                                  title={t("edit")}
                                >
                                  <Edit2 className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(e._id)}
                                  className="p-2 rounded-lg transition-all"
                                  style={{
                                    background: "rgba(239,68,68,0.08)",
                                    border: "1px solid rgba(239,68,68,0.2)",
                                  }}
                                  title={t("delete")}
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </motion.button>
                              </div>
                            </td>
                          </>
                        )}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Chart ── */}
          {sorted.length > 1 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="rounded-xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{
                color: "var(--accent)", letterSpacing: "0.12em",
              }}>
                📈 {t("bodyCompositionOverTime")}
              </p>
              <Line data={bodyChartData} options={chartOptions} />
            </motion.div>
          ) : sorted.length === 1 ? (
            <div className="rounded-xl py-8 text-center" style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {t("addMoreProgressEntries")}
              </p>
            </div>
          ) : null}

        </div>
      </motion.div>
    </>
  );
}