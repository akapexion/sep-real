import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Edit2, Plus, Loader2, Download, FileText, Utensils } from "lucide-react";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";
import { z } from "zod";
import { useLanguage } from "../pages/UseLanguage";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_BASE = "http://localhost:3000";

const nutrySchema = z.object({
  mealType: z.string().min(1, { message: "Meal type is required" }),
  foodName: z.string().min(1, { message: "Food name is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  calories: z.coerce.number().min(0, { message: "Cannot be negative" }),
  proteins: z.coerce.number().min(0, { message: "Cannot be negative" }),
  carbs: z.coerce.number().min(0, { message: "Cannot be negative" }),
  fats: z.coerce.number().min(0, { message: "Cannot be negative" }),
  date: z.string().min(1, { message: "Date is required" }),
});

const foodDatabase = {
  Breakfast: [
    { name: "Oatmeal (1 cup)", calories: 154, proteins: 5, carbs: 27, fats: 3 },
    { name: "Scrambled Eggs (2)", calories: 140, proteins: 12, carbs: 1, fats: 10 },
    { name: "Greek Yogurt (1 cup)", calories: 100, proteins: 17, carbs: 6, fats: 0 },
  ],
  Lunch: [
    { name: "Chicken Salad", calories: 350, proteins: 30, carbs: 10, fats: 20 },
    { name: "Turkey Sandwich", calories: 400, proteins: 25, carbs: 45, fats: 12 },
    { name: "Lentil Soup", calories: 230, proteins: 16, carbs: 40, fats: 2 },
  ],
  Dinner: [
    { name: "Grilled Salmon", calories: 412, proteins: 40, carbs: 0, fats: 27 },
    { name: "Chicken Breast & Rice", calories: 380, proteins: 35, carbs: 45, fats: 4 },
    { name: "Steak and Sweet Potato", calories: 550, proteins: 45, carbs: 30, fats: 25 },
  ],
  Snacks: [
    { name: "Apple", calories: 95, proteins: 0.5, carbs: 25, fats: 0.3 },
    { name: "Almonds (1 oz)", calories: 164, proteins: 6, carbs: 6, fats: 14 },
    { name: "Protein Shake", calories: 150, proteins: 25, carbs: 5, fats: 2 },
  ],
  Other: [
    { name: "Custom Entry", calories: 0, proteins: 0, carbs: 0, fats: 0 },
  ],
};

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

const inputFocusStyle = `
  .glass-input:focus {
    outline: none;
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    background: rgba(255,255,255,0.08) !important;
  }
  .glass-input::placeholder { color: rgba(255,255,255,0.3); }
  .glass-input option { background: var(--bg-card); color: var(--text-primary); }

  .row-hover:hover {
    background: rgba(255,255,255,0.04) !important;
    transition: background 0.2s ease;
  }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

const MEAL_TABS = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Other"];

const MACRO_META = [
  { key: "totalCalories", label: "Cal",     color: "text-orange-400",  bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { key: "totalProteins", label: "Protein", color: "text-blue-400",    bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
  { key: "totalCarbs",    label: "Carbs",   color: "text-yellow-400",  bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  { key: "totalFats",     label: "Fats",    color: "text-pink-400",    bg: "bg-pink-500/10",   border: "border-pink-500/20"   },
];

export default function NutritionLogsSection() {
  const printRef = useRef();

  const [logs, setLogs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [error, setError]       = useState({});

  const [mealType,  setMealType]  = useState("Breakfast");
  const [foodName,  setFoodName]  = useState("");
  const [quantity,  setQuantity]  = useState("");
  const [calories,  setCalories]  = useState("");
  const [proteins,  setProteins]  = useState("");
  const [carbs,     setCarbs]     = useState("");
  const [fats,      setFats]      = useState("");
  const [date,      setDate]      = useState(new Date().toISOString().split("T")[0]);

  const user   = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const { t }  = useLanguage();

  const calcTotals = (items) =>
    items.reduce(
      (acc, i) => ({
        totalCalories: acc.totalCalories + i.calories,
        totalProteins: acc.totalProteins + i.proteins,
        totalCarbs:    acc.totalCarbs    + i.carbs,
        totalFats:     acc.totalFats     + i.fats,
      }),
      { totalCalories: 0, totalProteins: 0, totalCarbs: 0, totalFats: 0 },
    );

  const resetForm = () => {
    setMealType("Breakfast"); setFoodName(""); setQuantity("");
    setCalories(""); setProteins(""); setCarbs(""); setFats("");
    setDate(new Date().toISOString().split("T")[0]);
    setEditingId(null); setError({});
  };

  const handleMealChange = (e) => {
    setMealType(e.target.value);
    setFoodName(""); setCalories(""); setProteins(""); setCarbs(""); setFats(""); setQuantity("");
  };

  const handleFoodNameChange = (e) => {
    const val = e.target.value;
    setFoodName(val);
    if (val === "Custom Entry" || val === "") return;
    const item = (foodDatabase[mealType] || []).find(i => i.name === val);
    if (item) {
      setCalories(String(item.calories)); setProteins(String(item.proteins));
      setCarbs(String(item.carbs));       setFats(String(item.fats));
      if (!quantity) setQuantity("1 serving");
    }
  };

  const fetchLogs = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const res = await axios.get(`${API_BASE}/nutrition?userId=${userId}`);
      setLogs(res.data.map(log => ({ ...log, ...calcTotals(log.foodItems) })));
    } catch { toast.error(t("failedToLoadNutritionLogs")); }
    finally   { setLoading(false); }
  }, [userId, t]);

  const saveLog = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("You must be logged in");

    const result = nutrySchema.safeParse({ mealType, quantity, foodName, calories, proteins, carbs, fats, date });
    if (!result.success) {
      const fe = result.error.format();
      setError({
        mealType: fe.mealType?._errors[0] || "",  foodName: fe.foodName?._errors[0] || "",
        quantity: fe.quantity?._errors[0] || "",   carbs:    fe.carbs?._errors[0]    || "",
        date:     fe.date?._errors[0]     || "",   calories: fe.calories?._errors[0] || "",
        fats:     fe.fats?._errors[0]     || "",   proteins: fe.proteins?._errors[0] || "",
      });
      return;
    }
    setError({});

    const payload = {
      userId, mealType, date,
      foodItems: [{ name: foodName, quantity, calories: Number(calories) || 0,
        proteins: Number(proteins) || 0, carbs: Number(carbs) || 0, fats: Number(fats) || 0 }],
    };

    setSaving(true);
    try {
      if (editingId) {
        await axios.post(`${API_BASE}/nutrition/${editingId}`, payload);
        toast.success(t("logUpdated"));
      } else {
        await axios.post(`${API_BASE}/nutrition`, payload);
        toast.success(t("logAdded"));
      }
      resetForm(); fetchLogs();
    } catch { toast.error(editingId ? t("updateFailed") : t("addFailed")); }
    finally { setSaving(false); }
  };

  const deleteLog = (id) => {
    showDeleteConfirm({
      message: t("deleteLogConfirmation"),
      onConfirm: async () => {
        try { await axios.delete(`${API_BASE}/nutrition/${id}`); toast.success(t("logDeleted")); fetchLogs(); }
        catch { toast.error(t("deleteFailed")); }
      },
    });
  };

  const startEdit = (log) => {
    setEditingId(log._id); setMealType(log.mealType);
    setDate(new Date(log.date).toISOString().split("T")[0]);
    const first = log.foodItems[0];
    setFoodName(first.name); setQuantity(first.quantity);
    setCalories(String(first.calories)); setProteins(String(first.proteins));
    setCarbs(String(first.carbs));       setFats(String(first.fats));
  };

  const exportPDF = async () => {
    const content = printRef.current;
    if (!content) return;
    try {
      const toastId = toast.loading("Generating PDF...");
      const canvas  = await html2canvas(content, { scale: 2 });
      const pdf     = new jsPDF("p", "mm", "a4");
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 10,
        pdf.internal.pageSize.getWidth(), (canvas.height * pdf.internal.pageSize.getWidth()) / canvas.width);
      pdf.save(`Nutrition_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.dismiss(toastId); toast.success("PDF Exported Successfully!");
    } catch { toast.error("Failed to generate PDF"); }
  };

  const exportCSV = () => {
    const header = [t("meal"), t("food"), t("quantity"), t("caloriesShort"),
      t("proteinsShort"), t("carbsShort"), t("fatsShort"), t("date")];
    const rows = logs.map(l => [l.mealType, l.foodItems.map(i => i.name).join(" | "),
      l.foodItems.map(i => i.quantity).join(" | "), l.totalCalories, l.totalProteins,
      l.totalCarbs, l.totalFats, new Date(l.date).toLocaleDateString()]);
    const blob = new Blob([[header, ...rows].map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `nutrition-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(a.href);
  };

  const filteredLogs = logs.filter(l => activeTab === "All" || l.mealType === activeTab);

  const grandTotals = logs.reduce((acc, l) => ({
    totalCalories: acc.totalCalories + l.totalCalories,
    totalProteins: acc.totalProteins + l.totalProteins,
    totalCarbs:    acc.totalCarbs    + l.totalCarbs,
    totalFats:     acc.totalFats     + l.totalFats,
  }), { totalCalories: 0, totalProteins: 0, totalCarbs: 0, totalFats: 0 });

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div style={{ position: "relative" }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--accent)" }} />
        <div style={{
          position: "absolute", inset: "-6px", borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)",
          animation: "glow-pulse 2s ease-in-out infinite",
        }} />
      </div>
    </div>
  );

  const tableHeaders = [t("meal"), t("food"), t("quantity"),
    t("caloriesShort"), t("proteinsShort"), t("carbsShort"), t("fatsShort"), t("date"), t("actions")];

  return (
    <>
      <style>{inputFocusStyle}</style>

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
              <Utensils className="w-5 h-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {t("nutritionLogs")}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {t("trackYourMeals") || "Track your daily nutrition intake"}
              </p>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={exportPDF}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "var(--text-primary)",
              }}
            >
              <FileText className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
              {t("exportPDF")}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={exportCSV}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "var(--text-primary)",
              }}
            >
              <Download className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
              {t("exportCSV")}
            </motion.button>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto" style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          {MEAL_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-shrink-0 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200"
              style={activeTab === tab ? {
                background: "var(--accent)",
                color: "#fff",
                boxShadow: "0 2px 12px color-mix(in srgb, var(--accent) 40%, transparent)",
              } : {
                color: "var(--text-muted)",
                background: "transparent",
              }}
            >
              {t(tab) || tab}
              {tab !== "All" && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{
                  background: activeTab === tab ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                  color: activeTab === tab ? "#fff" : "var(--text-muted)",
                }}>
                  {logs.filter(l => l.mealType === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl p-5 mb-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{
            color: "var(--accent)", letterSpacing: "0.12em",
          }}>
            {editingId ? `✏️ ${t("update")}` : `＋ ${t("add")} ${t("nutritionLog") || "Nutrition Log"}`}
          </p>

          <form onSubmit={saveLog} className="grid md:grid-cols-2 gap-3" noValidate>

            {/* Meal Type */}
            <div className="flex flex-col gap-1">
              <select value={mealType} onChange={handleMealChange}
                className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput}>
                {["Breakfast", "Lunch", "Dinner", "Snacks", "Other"].map(meal => (
                  <option key={meal} value={meal}>{t(meal) || meal}</option>
                ))}
              </select>
              {error.mealType && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{error.mealType}</p>}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput} required />
              {error.date && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{error.date}</p>}
            </div>

            {/* Food Name */}
            <div className="flex flex-col gap-1">
              <input
                list={`food-options-${mealType}`}
                placeholder={`${t("foodName") || "Food name"} *`}
                value={foodName} onChange={handleFoodNameChange}
                className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput} required />
              <datalist id={`food-options-${mealType}`}>
                {(foodDatabase[mealType] || []).map(item => (
                  <option key={item.name} value={item.name} />
                ))}
              </datalist>
              {error.foodName && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{error.foodName}</p>}
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
              <input placeholder={`${t("quantity") || "Quantity"} *`} value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput} required />
              {error.quantity && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{error.quantity}</p>}
            </div>

            {/* Calories */}
            <div className="flex flex-col gap-1">
              <input type="number" placeholder={`${t("calories") || "Calories"} *`} value={calories}
                onChange={e => setCalories(e.target.value)}
                className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput} required />
              {error.calories && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{error.calories}</p>}
            </div>

            {/* Proteins */}
            <div className="flex flex-col gap-1">
              <input type="number" placeholder={`${t("proteins") || "Proteins"} (g) *`} value={proteins}
                onChange={e => setProteins(e.target.value)}
                className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput} required />
              {error.proteins && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{error.proteins}</p>}
            </div>

            {/* Carbs */}
            <div className="flex flex-col gap-1">
              <input type="number" placeholder={`${t("carbs") || "Carbs"} (g) *`} value={carbs}
                onChange={e => setCarbs(e.target.value)}
                className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput} required />
              {error.carbs && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{error.carbs}</p>}
            </div>

            {/* Fats */}
            <div className="flex flex-col gap-1">
              <input type="number" placeholder={`${t("fats") || "Fats"} (g) *`} value={fats}
                onChange={e => setFats(e.target.value)}
                className="glass-input w-full px-3 py-2.5 text-sm" style={glassInput} required />
              {error.fats && <p className="text-xs pl-1" style={{ color: "#f87171" }}>{error.fats}</p>}
            </div>

            {/* Actions */}
            <div className="md:col-span-2 flex gap-2 pt-1">
              <motion.button
                type="submit" disabled={saving}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))",
                  boxShadow: "0 4px 16px color-mix(in srgb, var(--accent) 35%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
                }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> :
                 editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {saving ? t("saving") + "…" : editingId ? t("update") : t("add")}
              </motion.button>

              {editingId && (
                <motion.button
                  type="button" onClick={resetForm}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium"
                  style={{ ...glassInput, color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  {t("cancel")}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* ── Totals Summary Cards ── */}
        {logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            {MACRO_META.map(({ key, label, color, bg, border }) => (
              <div key={key} className={`rounded-xl px-4 py-3 ${bg} border ${border}`}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>{label}</p>
                <p className={`text-xl font-bold ${color}`}>{grandTotals[key]}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {key === "totalCalories" ? "kcal" : "g"} total
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Table ── */}
        <div ref={printRef} className="rounded-xl overflow-hidden" style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
        }}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {tableHeaders.map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div style={{
                            padding: 16, borderRadius: "50%",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}>
                            <Utensils className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                          </div>
                          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            {t("noNutritionLogs") || "No nutrition logs found"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredLogs.map((log, i) => (
                    <motion.tr
                      key={log._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className="row-hover"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      {/* Meal */}
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                          style={{
                            background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                            color: "var(--accent)",
                            border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                          }}>
                          {log.mealType}
                        </span>
                      </td>

                      {/* Food */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                          {log.foodItems.map(i => i.name).join(", ")}
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-5 py-4">
                        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                          {log.foodItems.map(i => i.quantity).join(", ")}
                        </span>
                      </td>

                      {/* Calories */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                          {log.totalCalories}
                        </span>
                      </td>

                      {/* Proteins */}
                      <td className="px-5 py-4">
                        <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                          {log.totalProteins}g
                        </span>
                      </td>

                      {/* Carbs */}
                      <td className="px-5 py-4">
                        <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                          {log.totalCarbs}g
                        </span>
                      </td>

                      {/* Fats */}
                      <td className="px-5 py-4">
                        <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                          {log.totalFats}g
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {new Date(log.date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5">
                          <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                            onClick={() => startEdit(log)}
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
                            onClick={() => deleteLog(log._id)}
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
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
}