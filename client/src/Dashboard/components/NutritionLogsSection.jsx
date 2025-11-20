import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Edit2, Plus, Loader2, Download, FileText } from "lucide-react";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";
import {z} from 'zod' 
import { useLanguage } from '../pages/UseLanguage';

const API_BASE = "http://localhost:3000";

const nutrySchema =z.object({
  mealType:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  
  foodName:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  quantity:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  calories:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  proteins:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  carbs:z.any().refine((v) => v !== "" && v != null, {
      message: "Please enter detail"
    }),
  fats:z.any().refine((v) => v !== "" && v != null, {
      message: "Please enter detail"
    }),
  date:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),

})

export default function NutritionLogsSection() {
  const printRef = useRef();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error,setError] = useState("");

  const [mealType, setMealType] = useState("Breakfast");
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [calories, setCalories] = useState("");
  const [proteins, setProteins] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const { t } = useLanguage();

  const calcTotals = (items) =>
    items.reduce(
      (acc, i) => ({
        totalCalories: acc.totalCalories + i.calories,
        totalProteins: acc.totalProteins + i.proteins,
        totalCarbs: acc.totalCarbs + i.carbs,
        totalFats: acc.totalFats + i.fats,
      }),
      { totalCalories: 0, totalProteins: 0, totalCarbs: 0, totalFats: 0 }
    );

  const resetForm = () => {
    setMealType("Breakfast");
    setFoodName("");
    setQuantity("");
    setCalories("");
    setProteins("");
    setCarbs("");
    setFats("");
    setDate(new Date().toISOString().split("T")[0]);
    setEditingId(null);
  };

  const fetchLogs = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/nutrition?userId=${userId}`);
      const enriched = res.data.map((log) => ({
        ...log,
        ...calcTotals(log.foodItems),
      }));
      setLogs(enriched);
    } catch (err) {
      toast.error(t('failedToLoadNutritionLogs'));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  const saveLog = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("You must be logged in");


        const result = nutrySchema.safeParse({mealType,quantity,foodName,calories,proteins,carbs,fats,date})
    if(!result.success){
      const formattedErrors = result.error.format();

      setError({

        mealType:formattedErrors.mealType?._errors[0] || "",
        foodName: formattedErrors.foodName?._errors[0] || "",
        quantity: formattedErrors.quantity?._errors[0] || "",
        carbs: formattedErrors.carbs?._errors[0] || "",
        date: formattedErrors.date?._errors[0] || "",
        calories: formattedErrors.calories?._errors[0] || "",
        fats: formattedErrors.fats?._errors[0] || "",
        proteins: formattedErrors.proteins?._errors[0] || "",
      })
      return;
    }
setError("")
    if (!userId) return toast.error(t('userNotLoggedIn'));

    const foodItem = {
      name: foodName,
      quantity,
      calories: Number(calories) || 0,
      proteins: Number(proteins) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
    };

    const payload = {
      userId,
      mealType,
      foodItems: [foodItem],
      date,
    };

    setSaving(true);
    try {
      if (editingId) {
        await axios.post(`${API_BASE}/nutrition/${editingId}`, payload);
        toast.success(t('logUpdated'));
      } else {
        await axios.post(`${API_BASE}/nutrition`, payload);
        toast.success(t('logAdded'));
      }
      resetForm();
      fetchLogs();
    } catch (err) {
      toast.error(editingId ? t('updateFailed') : t('addFailed'));
    } finally {
      setSaving(false);
    }
  };

  const deleteLog = (id) => {
    showDeleteConfirm({
      message: t('deleteLogConfirmation'),
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE}/nutrition/${id}`);
          toast.success(t('logDeleted'));
          fetchLogs();
        } catch (err) {
          toast.error(t('deleteFailed'));
        }
      },
    });
  };

  const startEdit = (log) => {
    setEditingId(log._id);
    setMealType(log.mealType);
    setDate(new Date(log.date).toISOString().split("T")[0]);
    const first = log.foodItems[0];
    setFoodName(first.name);
    setQuantity(first.quantity);
    setCalories(String(first.calories));
    setProteins(String(first.proteins));
    setCarbs(String(first.carbs));
    setFats(String(first.fats));
  };

  const exportPDF = () => {
    const content = printRef.current;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html><head><title>${t('nutritionReport')} – ${new Date().toLocaleDateString()}</title>
      <style>
        body{font-family:Arial,sans-serif;margin:2rem;}
        table{width:100%;border-collapse:collapse;margin-top:1rem;}
        th,td{border:1px solid #ddd;padding:8px;text-align:left;}
        th{background:#f4f4f4;}
        .totals{font-weight:bold;margin-top:1rem;}
      </style></head><body>`);
    win.document.write(content.innerHTML);
    win.document.write(`</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const exportCSV = () => {
    const header = [
      t('meal'), t('food'), t('quantity'), 
      t('caloriesShort'), t('proteinsShort'), t('carbsShort'), t('fatsShort'), t('date')
    ];
    const rows = logs.map(l => [
      l.mealType,
      l.foodItems.map(i=>i.name).join(" | "),
      l.foodItems.map(i=>i.quantity).join(" | "),
      l.totalCalories,
      l.totalProteins,
      l.totalCarbs,
      l.totalFats,
      new Date(l.date).toLocaleDateString(),
    ]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nutrition-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold" style={{ color: "var(--accent)" }}>
          {t('nutritionLogs')}
        </h3>

        <Toaster />
      </div>

      <form onSubmit={saveLog} className="grid md:grid-cols-2 gap-4 mb-6 " noValidate>

  <label className="flex flex-col text-sm font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
    {t('mealType')}
    <select
      value={mealType}
      onChange={(e) => setMealType(e.target.value)}
      className="p-2 rounded-md"
      style={{
        backgroundColor: "var(--input-bg)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
      }}

    >
      {["Breakfast", "Lunch", "Dinner", "Snacks", "Other"].map((meal) => (
        <option key={meal} value={meal}>{t(meal)}</option>
      ))}
    </select>
    <p className="mb-4 text-xs" style={{ color: "red" }}>{error.mealType}</p>
  </label>

  <label className="flex flex-col text-sm font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
    {t('date')}
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="p-2 rounded-md"
      style={{
        backgroundColor: "var(--input-bg)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
      }}
      required
    />
     <p className="mb-4 text-xs" style={{ color: "red" }}>{error.date}</p>
  </label>

  <label className="flex flex-col text-sm font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
    {t('foodName')}
    <input
      placeholder={t('foodNamePlaceholder')}
      value={foodName}
      onChange={(e) => setFoodName(e.target.value)}
      className="p-2 rounded-md"
      style={{
        backgroundColor: "var(--input-bg)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
      }}
      required
    />
     <p className=" text-xs" style={{ color: "red" }}>{error.foodName}</p>
  </label>

  <label className="flex flex-col text-sm font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
    {t('quantity')}
    <input
      placeholder={t('quantityPlaceholder')}
      value={quantity}
      onChange={(e) => setQuantity(e.target.value)}
      className="p-2 rounded-md"
      style={{
        backgroundColor: "var(--input-bg)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
      }}
      required
    />
     <p className=" text-xs" style={{ color: "red" }}>{error.quantity}</p>
  </label>

  <label className="flex flex-col text-sm font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
    {t('calories')}
    <input
      type="number"
      placeholder={t('calories')}
      value={calories}
      onChange={(e) => setCalories(e.target.value)}
      className="p-2 rounded-md"
      style={{
        backgroundColor: "var(--input-bg)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
      }}
      required
    />
     <p className=" text-xs" style={{ color: "red" }}>{error.calories}</p>
  </label>

  <label className="flex flex-col text-sm font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
    {t('proteins')} (g)
    <input
      type="number"
      placeholder={t('proteinsPlaceholder')}
      value={proteins}
      onChange={(e) => setProteins(e.target.value)}
      className="p-2 rounded-md"
      style={{
        backgroundColor: "var(--input-bg)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
      }}
      required
    />
     <p className=" text-xs" style={{ color: "red" }}>{error.proteins}</p>
  </label>

  <label className="flex flex-col text-sm font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
    {t('carbs')} (g)
    <input
      type="number"
      placeholder={t('carbsPlaceholder')}
      value={carbs}
      onChange={(e) => setCarbs(e.target.value)}
      className="p-2 rounded-md"
      style={{
        backgroundColor: "var(--input-bg)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
      }}
      required
    />
     <p className=" text-xs" style={{ color: "red" }}>{error.carbs}</p>
  </label>

  <label className="flex flex-col text-sm font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
    {t('fats')} (g)
    <input
      type="number"
      placeholder={t('fatsPlaceholder')}
      value={fats}
      onChange={(e) => setFats(e.target.value)}
      className="p-2 rounded-md"
      style={{
        backgroundColor: "var(--input-bg)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
      }}
      required
    />
     <p className=" text-xs" style={{ color: "red" }}>{error.fats}</p>
  </label>

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
      {saving ? t('saving') + "…" : editingId ? t('update') : t('add')}
    </button>

    {editingId && (
      <button
        type="button"
        onClick={resetForm}
        className="px-4 py-2 rounded-md font-medium"
        style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
      >
        {t('cancel')}
      </button>
    )}
  </div>
</form>

      <div ref={printRef}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
            {t('nutritionHistory')}
          </h4>
          <div className="flex gap-2">
            <button 
              onClick={exportPDF} 
              title={t('exportPDF')} 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium"
              style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
            >
              <FileText className="w-4 h-4" />
              {t('exportPDF')}
            </button>
            <button 
              onClick={exportCSV} 
              title={t('exportCSV')} 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium"
              style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
            >
              <Download className="w-4 h-4" />
              {t('exportCSV')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: "var(--border)" }}>
            <thead style={{ backgroundColor: "var(--bg-secondary)" }}>
              <tr>
                {[
                  t('meal'), t('food'), t('quantity'), 
                  t('caloriesShort'), t('proteinsShort'), t('carbsShort'), t('fatsShort'), 
                  t('date'), t('actions')
                ].map((h)=>(
                  <th key={h} className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                    {t('noNutritionLogs')}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[var(--bg-card-hover)] transition">
                    <td className="px-4 py-3 text-sm">{log.mealType}</td>
                    <td className="px-4 py-3 text-sm">{log.foodItems.map(i=>i.name).join(", ")}</td>
                    <td className="px-4 py-3 text-sm">{log.foodItems.map(i=>i.quantity).join(", ")}</td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: "var(--accent)" }}>
                      {log.totalCalories}
                    </td>
                    <td className="px-4 py-3 text-sm">{log.totalProteins}</td>
                    <td className="px-4 py-3 text-sm">{log.totalCarbs}</td>
                    <td className="px-4 py-3 text-sm">{log.totalFats}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--text-muted)" }}>
                      {new Date(log.date).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(log)}
                          className="p-1 rounded hover:bg-[var(--bg-secondary)]"
                          title={t('edit')}
                        >
                          <Edit2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
                        </button>

                        <button
                          onClick={() => deleteLog(log._id)}
                          className="p-1 rounded hover:bg-red-500/10"
                          title={t('delete')}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {logs.length > 0 && (
          <div className="mt-6 p-4 rounded bg-[var(--bg-secondary)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><strong>{t('totalCalories')}:</strong> {logs.reduce((s,l)=>s+l.totalCalories,0)}</div>
              <div><strong>{t('proteins')}:</strong> {logs.reduce((s,l)=>s+l.totalProteins,0)}g</div>
              <div><strong>{t('carbs')}:</strong> {logs.reduce((s,l)=>s+l.totalCarbs,0)}g</div>
              <div><strong>{t('fats')}:</strong> {logs.reduce((s,l)=>s+l.totalFats,0)}g</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}