// src/Dashboard/components/RemindersSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import { Trash2, Edit2, Plus, Loader2 } from "lucide-react";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";

const API_BASE = "http://localhost:3000";   

export default function RemindersSection() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("workout");
  const [notes, setNotes] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const resetForm = () => {
    setTitle(""); setDate(""); setTime(""); setType("workout"); setNotes(""); setEditingId(null);
  };

  const fetchReminders = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const { data } = await axios.get(`${API_BASE}/reminders?userId=${userId}`);
      setReminders(data);
    } catch { toast.error("Failed to load reminders"); }
    finally { setLoading(false); }
  }, [userId]);

const save = async (e) => {
  e.preventDefault();
  if (!title || !date || !time) return toast.error("Fill required fields");

  const fullDateTime = `${date}T${time}:00`; 

  const payload = {
    userId,
    title,
    date: fullDateTime,   
    type,
    notes,
  };

  setSaving(true);
  try {
    if (editingId) {
      await axios.post(`${API_BASE}/reminders/${editingId}`, payload);
      toast.success("Reminder updated");
    } else {
      await axios.post(`${API_BASE}/reminders`, payload);
      toast.success("Reminder created");
    }
    resetForm();
    fetchReminders();
  } catch (err) {
    console.error(err);
    toast.error("Save failed");
  } finally {
    setSaving(false);
  }
};

const startEdit = (r) => {
  setEditingId(r._id);
  setTitle(r.title);
  setType(r.type);
  setNotes(r.notes || "");

  // SPLIT ISO DATE INTO date + time
  const reminderDate = new Date(r.date);
  const dateStr = reminderDate.toISOString().split("T")[0]; // YYYY-MM-DD
  const timeStr = reminderDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // HH:MM

  setDate(dateStr);
  setTime(timeStr);
};

  // const del = async (id) => {
  //   if (!window.confirm("Delete reminder?")) return;
  //   try {
  //     await axios.delete(`${API_BASE}/reminders/${id}`);
  //     toast.success("Deleted");
  //     fetchReminders();
  //   } catch { toast.error("Delete failed"); }
  // };

  const del = (id) => {
    showDeleteConfirm({
      message: "Are you sure you want to delete this workout?",
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE}/reminders/${id}`);
          toast.success("Reminder deleted successfully");
          fetchReminders(); 
        } catch (error) {
          toast.error("Unable to delete");
        }
      },
    });
  };




  useEffect(() => { fetchReminders(); }, [fetchReminders]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" style={{color:"var(--accent)"}}/></div>;

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
      className="mt-6 p-4 rounded-lg shadow-md"
      style={{backgroundColor:"var(--bg-card)",border:"1px solid var(--border)"}}>
      <h3 className="text-xl font-semibold mb-4" style={{color:"var(--accent)"}}>Reminders & Alerts</h3>

            <Toaster />
      

      <form onSubmit={save} className="grid md:grid-cols-2 gap-3 mb-6">
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}
          className="p-2 rounded" style={{background:"var(--input-bg)",color:"var(--text-primary)",border:"1px solid var(--border)"}} required/>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          className="p-2 rounded" style={{background:"var(--input-bg)",color:"var(--text-primary)",border:"1px solid var(--border)"}} required/>
        <input
  type="time"
  value={time}
  onChange={(e) => setTime(e.target.value)}
  step="300"
  className="p-2 rounded ..."
  required
/>
        <select value={type} onChange={e=>setType(e.target.value)}
          className="p-2 rounded" style={{background:"var(--input-bg)",color:"var(--text-primary)",border:"1px solid var(--border)"}}>
          {["workout","meal","goal"].map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <input placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)}
          className="p-2 rounded md:col-span-2" style={{background:"var(--input-bg)",color:"var(--text-primary)",border:"1px solid var(--border)"}}/>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded font-medium text-white"
            style={{backgroundColor:"var(--accent)"}}>
            {saving?<Loader2 className="w-4 h-4 animate-spin"/>:editingId?<Edit2 className="w-4 h-4"/>:<Plus className="w-4 h-4"/>}
            {saving?"Saving…":editingId?"Update":"Add"}
          </button>
          {editingId && <button type="button" onClick={resetForm}
            className="px-4 py-2 rounded font-medium"
            style={{background:"var(--bg-secondary)",color:"var(--text-primary)"}}>Cancel</button>}
        </div>
      </form>

      {/* ---- LIST ---- */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" style={{borderColor:"var(--border)"}}>
          <thead style={{background:"var(--bg-secondary)"}}>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color:"var(--text-secondary)"}}>Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color:"var(--text-secondary)"}}>Date / Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color:"var(--text-secondary)"}}>Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color:"var(--text-secondary)"}}>Active</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color:"var(--text-secondary)"}}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{borderColor:"var(--border)"}}>
            {reminders.length===0?
              <tr><td colSpan={5} className="px-4 py-6 text-center" style={{color:"var(--text-muted)"}}>No reminders yet</td></tr>
            :reminders.map(r=>(
              <tr key={r._id} className={`hover:bg-[var(--bg-card-hover)] ${!r.isActive?'opacity-50':''}`}>
                <td className="px-4 py-3 text-sm" style={{color:"var(--text-primary)"}}>{r.title}</td>
                <td className="px-4 py-3 text-sm" style={{color:"var(--text-primary)"}}>
                  {new Date(r.date).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm" style={{color:"var(--text-primary)"}}>{r.type}</td>
                <td className="px-4 py-3 text-sm" style={{color:"var(--text-primary)"}}>{r.isActive?"Yes":"No"}</td>
                <td className="px-4 py-3 text-sm">
                  <button onClick={()=>startEdit(r)} className="mr-2 text-[var(--accent)]"><Edit2 className="w-4 h-4" style={{ color: "var(--accent)" }} /></button>
                  <button onClick={()=>del(r._id)} className="text-red-500">                          <Trash2 className="w-4 h-4 text-red-500" />
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}