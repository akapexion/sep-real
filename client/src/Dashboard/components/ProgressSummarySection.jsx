import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from "axios";
import toast from "react-hot-toast";
import { Download, FileText, Trash2, Edit2 } from "lucide-react";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";
import { useLanguage } from '../pages/UseLanguage';
import { usePreferencesContext } from "../pages/PreferencesContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressSummarySection = ({ progressEntries = [], onProgressUpdate }) => {
  const printRef = useRef();
  const { getWeightUnit, getHeightUnit } = usePreferencesContext();
  const { t } = useLanguage();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const API_BASE_URL = "http://localhost:3000";

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setEditForm({
      date: entry.date.split("T")[0],
      weight: entry.weight || "",
      chest: entry.measurements?.chest || "",
      waist: entry.measurements?.waist || "",
      runTime: entry.performance?.runTime || "",
      liftWeight: entry.performance?.liftWeight || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdate = async () => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const userId = user._id;
    if (!userId) return toast.error(t('pleaseLogin'));

    const payload = {
      userId,
      date: editForm.date,
      weight: editForm.weight ? parseFloat(editForm.weight) : null,
      measurements: {
        chest: editForm.chest ? parseFloat(editForm.chest) : null,
        waist: editForm.waist ? parseFloat(editForm.waist) : null,
      },
      performance: {
        runTime: editForm.runTime ? parseFloat(editForm.runTime) : null,
        liftWeight: editForm.liftWeight ? parseFloat(editForm.liftWeight) : null,
      },
    };

    try {
      await axios.post(`${API_BASE_URL}/progress/${editingId}`, payload);
      toast.success(t('progressUpdated'));
      setEditingId(null);
      onProgressUpdate?.();
    } catch (err) {
      toast.error(t('updateFailed'));
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    showDeleteConfirm({
      message: t('deleteProgressConfirmation'),
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/progress/${id}`);
          toast.success(t('deleteSuccessfully'));
          onProgressUpdate?.();
        } catch (error) {
          toast.error(t('unableToDelete'));
        }
      },
    });
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const exportPDF = () => {
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html><head><title>${t('progressReport')} – ${new Date().toLocaleDateString()}</title>
      <style>
        body{font-family:Arial,sans-serif;margin:2rem;}
        table{width:100%;border-collapse:collapse;margin-top:1rem;}
        th,td{border:1px solid #ddd;padding:8px;text-align:left;}
        th{background:#f4f4f4;}
      </style></head><body>`);
    win.document.write(printRef.current.innerHTML);
    win.document.write(`</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const exportCSV = () => {
    const header = [
      t('date'),
      `${t('weight')}(${getWeightUnit()})`,
      `${t('chest')}(${getHeightUnit()})`,
      `${t('waist')}(${getHeightUnit()})`,
      `${t('runTime')}(${t('minutesShort')})`,
      `${t('liftWeight')}(${getWeightUnit()})`
    ];
    const rows = progressEntries.map(e => [
      new Date(e.date).toLocaleDateString(),
      e.weight ?? "",
      e.measurements?.chest ?? "",
      e.measurements?.waist ?? "",
      e.performance?.runTime ?? "",
      e.performance?.liftWeight ?? "",
    ]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progress-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sortedProgress = [...progressEntries].sort((a, b) => new Date(a.date) - new Date(b.date));

  const labels = sortedProgress.map((entry) => new Date(entry.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }));

  const bodyChartData = {
    labels,
    datasets: [
      {
        label: `${t('weight')} (${getWeightUnit()})`,
        data: sortedProgress.map((entry) => entry.weight ?? null),
        borderColor: "#8884d8",
        backgroundColor: "#8884d8",
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: `${t('chest')} (${getHeightUnit()})`,
        data: sortedProgress.map((entry) => entry.measurements?.chest ?? null),
        borderColor: "#82ca9d",
        backgroundColor: "#82ca9d",
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: `${t('waist')} (${getHeightUnit()})`,
        data: sortedProgress.map((entry) => entry.measurements?.waist ?? null),
        borderColor: "#ffc658",
        backgroundColor: "#ffc658",
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: t('date'),
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: t('value'),
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 rounded-xl shadow-md"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
          {t('progressSummary')}
        </h3>
        <div className="flex gap-2">
          <button onClick={exportPDF} title={t('exportPDF')} className="p-2 rounded hover:bg-[var(--bg-secondary)]">
            <FileText className="w-5 h-5" style={{ color: "var(--accent)" }} />
          </button>
          <button onClick={exportCSV} title={t('exportCSV')} className="p-2 rounded hover:bg-[var(--bg-secondary)]">
            <Download className="w-5 h-5" style={{ color: "var(--accent)" }} />
          </button>
        </div>
      </div>

      <div ref={printRef}>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y" style={{ borderColor: "var(--border)" }}>
            <thead style={{ backgroundColor: "var(--bg-secondary)" }}>
              <tr>
                {[
                  t('date'), 
                  t('weight'), 
                  t('chest'), 
                  t('waist'), 
                  t('runTime'), 
                  t('liftWeight'), 
                  t('actions')
                ].map(
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
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {sortedProgress.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center" style={{ color: "var(--text-muted)" }}>
                    {t('noProgressRecorded')}
                  </td>
                </tr>
              ) : (
                sortedProgress.map((e) => (
                  <tr key={e._id} className="hover:bg-[var(--bg-card-hover)]">
                    {editingId === e._id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            name="date"
                            value={editForm.date}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 rounded border text-sm"
                            style={{
                              backgroundColor: "var(--input-bg)",
                              color: "var(--text-primary)",
                              borderColor: "var(--border)",
                            }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            name="weight"
                            value={editForm.weight}
                            onChange={handleInputChange}
                            step="0.1"
                            placeholder={getWeightUnit()}
                            className="w-full px-2 py-1 rounded border text-sm"
                            style={{
                              backgroundColor: "var(--input-bg)",
                              color: "var(--text-primary)",
                              borderColor: "var(--border)",
                            }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            name="chest"
                            value={editForm.chest}
                            onChange={handleInputChange}
                            step="0.1"
                            placeholder={getHeightUnit()}
                            className="w-full px-2 py-1 rounded border text-sm"
                            style={{
                              backgroundColor: "var(--input-bg)",
                              color: "var(--text-primary)",
                              borderColor: "var(--border)",
                            }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            name="waist"
                            value={editForm.waist}
                            onChange={handleInputChange}
                            step="0.1"
                            placeholder={getHeightUnit()}
                            className="w-full px-2 py-1 rounded border text-sm"
                            style={{
                              backgroundColor: "var(--input-bg)",
                              color: "var(--text-primary)",
                              borderColor: "var(--border)",
                            }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            name="runTime"
                            value={editForm.runTime}
                            onChange={handleInputChange}
                            step="0.1"
                            placeholder={t('minutesShort')}
                            className="w-full px-2 py-1 rounded border text-sm"
                            style={{
                              backgroundColor: "var(--input-bg)",
                              color: "var(--text-primary)",
                              borderColor: "var(--border)",
                            }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            name="liftWeight"
                            value={editForm.liftWeight}
                            onChange={handleInputChange}
                            step="0.1"
                            placeholder={getWeightUnit()}
                            className="w-full px-2 py-1 rounded border text-sm"
                            style={{
                              backgroundColor: "var(--input-bg)",
                              color: "var(--text-primary)",
                              borderColor: "var(--border)",
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-1">
                            <button
                              onClick={handleUpdate}
                              className="px-2 py-1 text-xs rounded text-white"
                              style={{ backgroundColor: "var(--accent)" }}
                            >
                              {t('update')}
                            </button>
                            <button
                              onClick={handleCancel}
                              className="px-2 py-1 text-xs rounded bg-gray-500 text-white"
                            >
                              {t('cancel')}
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
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
                              onClick={() => handleEdit(e)}
                              className="px-2 py-1 text-xs rounded text-white"
                            >
                              <Edit2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
                            </button>
                            <button
                              onClick={() => handleDelete(e._id)}
                              className="px-2 py-1 text-xs rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {sortedProgress.length > 1 ? (
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: "var(--accent)" }}>
              {t('bodyCompositionOverTime')}
            </h4>
            <Line data={bodyChartData} options={chartOptions} />
          </div>
        ) : sortedProgress.length > 0 ? (
          <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            {t('addMoreProgressEntries')}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
};

export default ProgressSummarySection;