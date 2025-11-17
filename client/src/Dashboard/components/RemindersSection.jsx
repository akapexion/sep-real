// src/Dashboard/components/RemindersSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { 
  Trash2, Edit2, Plus, Loader2, Bell, ToggleLeft, ToggleRight, 
  Clock, AlertTriangle, Calendar, Utensils, Dumbbell, Target 
} from "lucide-react";
import { showDeleteConfirm } from "../../showDeleteConfirm.jsx";
import {z} from 'zod'

const API_BASE = "http://localhost:3000";   

const reminderSchema=z.object({
  category:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  type:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  time:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  date:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  title:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
})

export default function RemindersSection() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); 
  const [error,setError] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("workout");
  const [category, setCategory] = useState("reminder"); // "reminder" or "alert"
  const [priority, setPriority] = useState("medium"); // for alerts
  const [notes, setNotes] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const resetForm = () => {
    setTitle(""); setDate(""); setTime(""); setType("workout"); 
    setCategory("reminder"); setPriority("medium"); setNotes(""); 
    setEditingId(null);
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
   
    const result = reminderSchema.safeParse({title,date,time,category,type})
    if(!result.success){
      const formattedErrors = result.error.format();

      setError({

        title:formattedErrors.title?._errors[0] || "",
        date: formattedErrors.date?._errors[0] || "",
        time: formattedErrors.time?._errors[0] || "",
        category: formattedErrors.category?._errors[0] || "",
        type: formattedErrors.type?._errors[0] || "",
       
      })
      return;
    }
setError("")

    const fullDateTime = `${date}T${time}:00`; 

    const payload = {
      userId,
      title,
      date: fullDateTime,   
      type,
      category,
      priority: category === "alert" ? priority : "none",
      notes,
      isActive: true,
    };

    setSaving(true);
    try {
      if (editingId) {
        await axios.post(`${API_BASE}/reminders/${editingId}`, payload);
        toast.success(`${category === "alert" ? "Alert" : "Reminder"} updated`);
      } else {
        await axios.post(`${API_BASE}/reminders`, payload);
        toast.success(`${category === "alert" ? "Alert" : "Reminder"} created`);
        
        scheduleNotification(payload);
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
    setCategory(r.category || "reminder");
    setPriority(r.priority || "medium");
    setNotes(r.notes || "");

    const reminderDate = new Date(r.date);
    const dateStr = reminderDate.toISOString().split("T")[0];
    const timeStr = reminderDate.toTimeString().split(':').slice(0, 2).join(':');
    
    setDate(dateStr);
    setTime(timeStr);
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_BASE}/reminders/${id}`, { 
        isActive: !currentStatus 
      });
      toast.success(`${!currentStatus ? 'Activated' : 'Deactivated'}`);
      fetchReminders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  const del = (id) => {
    showDeleteConfirm({
      message: "Are you sure you want to delete this?",
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE}/reminders/${id}`);
          toast.success("Deleted successfully");
          fetchReminders(); 
        } catch (error) {
          toast.error("Unable to delete");
        }
      },
    });
  };

  // Filter reminders based on active tab
  const filteredReminders = reminders.filter(reminder => {
    if (activeTab === "all") return true;
    return reminder.category === activeTab;
  });

  // Get icon based on type and category
  const getIcon = (item) => {
    if (item.category === "alert") {
      return <AlertTriangle className="w-4 h-4" />;
    }

    switch (item.type) {
      case "workout": return <Dumbbell className="w-4 h-4" />;
      case "meal": return <Utensils className="w-4 h-4" />;
      case "goal": return <Target className="w-4 h-4" />;
      case "appointment": return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-500/20 border-red-500/30";
      case "medium": return "text-yellow-500 bg-yellow-500/20 border-yellow-500/30";
      case "low": return "text-blue-500 bg-blue-500/20 border-blue-500/30";
      default: return "text-gray-500 bg-gray-500/20 border-gray-500/30";
    }
  };

  // Get category color and style
  const getCategoryStyle = (category) => {
    return category === "alert" 
      ? "text-red-500 bg-red-500/20 border-red-500/30"
      : "text-[var(--accent)] bg-[var(--accent)]/20 border-[var(--accent)]/30";
  };

  const scheduleNotification = (reminder) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          scheduleSingleNotification(reminder);
        }
      });
    } else if (Notification.permission === "granted") {
      scheduleSingleNotification(reminder);
    }
  };

  const scheduleSingleNotification = (reminder) => {
    const reminderTime = new Date(reminder.date).getTime();
    const now = Date.now();
    const timeUntilReminder = reminderTime - now;

    if (timeUntilReminder > 0 && timeUntilReminder < 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        if (reminder.isActive) {
          const notificationTitle = reminder.category === "alert" 
            ? `🚨 Alert: ${reminder.title}` 
            : `⏰ Reminder: ${reminder.title}`;

          new Notification(notificationTitle, {
            body: `${reminder.category === "alert" ? 'Important: ' : ''}${reminder.notes || `Time for your ${reminder.type}`}`,
            icon: '/favicon.ico',
            tag: reminder._id
          });

          createNotificationRecord(reminder);
        }
      }, timeUntilReminder);
    }
  };

  const createNotificationRecord = async (reminder) => {
    try {
      await axios.post(`${API_BASE}/notifications`, {
        userId: reminder.userId,
        type: reminder.category,
        message: `${reminder.category === "alert" ? "Alert" : "Reminder"}: ${reminder.title}`,
        isRead: false,
        date: new Date().toISOString(),
        priority: reminder.priority
      });
    } catch (err) {
      console.error('Failed to create notification record:', err);
    }
  };

  useEffect(() => {
    if (reminders.length === 0) return;

    const checkReminders = () => {
      const now = new Date();
      reminders.forEach(reminder => {
        if (reminder.isActive) {
          const reminderTime = new Date(reminder.date);
          const timeDiff = reminderTime.getTime() - now.getTime();
          
          if (timeDiff > 0 && timeDiff <= 60000 && !reminder.notified) {
            showBrowserNotification(reminder);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [reminders]);

  const showBrowserNotification = (reminder) => {
    if (Notification.permission === "granted") {
      const notificationTitle = reminder.category === "alert" 
        ? `🚨 Alert: ${reminder.title}` 
        : `⏰ Reminder: ${reminder.title}`;

      new Notification(notificationTitle, {
        body: `${reminder.category === "alert" ? 'Important: ' : ''}${reminder.notes || `Time for your ${reminder.type}`}`,
        icon: '/favicon.ico',
      });

      createNotificationRecord(reminder);
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => { 
    fetchReminders(); 
  }, [fetchReminders]);

  if (loading) return (
    <div className="flex justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin" style={{color:"var(--accent)"}}/>
    </div>
  );

  return (
    <motion.div 
      initial={{opacity:0,y:20}} 
      animate={{opacity:1,y:0}}
      className="mt-6 p-4 rounded-lg shadow-md"
      style={{backgroundColor:"var(--bg-card)",border:"1px solid var(--border)"}}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold" style={{color:"var(--accent)"}}>
          Reminders & Alerts
        </h3>
        <div className="flex items-center space-x-2 text-sm" style={{color:"var(--text-muted)"}}>
          <Bell className="w-4 h-4" />
          <span>Real-time notifications</span>
        </div>
      </div>

      <Toaster />
      
      {/* Category Tabs */}
      <div className="flex space-x-1 mb-6 p-1 rounded-lg" style={{backgroundColor:"var(--bg-secondary)"}}>
        {["all", "reminders", "alerts"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab 
                ? "text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
            style={{
              backgroundColor: activeTab === tab ? "var(--accent)" : "transparent",
              color: activeTab === tab ? "white" : "var(--text-secondary)"
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab !== "all" && (
              <span className="ml-1 text-xs opacity-75">
                ({reminders.filter(r => r.category === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Reminder/Alert Form */}
      <form onSubmit={save} className="grid md:grid-cols-2 gap-3 mb-6" noValidate>
       <div> <input 
          placeholder="Title *" 
          value={title} 
          onChange={e=>setTitle(e.target.value)}
          className="p-2 rounded w-full" 
          style={{background:"var(--input-bg)",color:"var(--text-primary)",border:"1px solid var(--border)"}} 
          required
        />
        <p className="mb-4 text-xs" style={{ color: "red" }}>{error.title}</p></div>
      <div>
          <select 
          value={category} 
          onChange={e=>setCategory(e.target.value)}
          className="p-2 rounded w-full" 
          style={{background:"var(--input-bg)",color:"var(--text-primary)",border:"1px solid var(--border)"}}
        >
          <option value="reminder">📅 Reminder</option>
          <option value="alert">🚨 Alert</option>
        </select>
        <p className="mb-4 text-xs" style={{ color: "red" }}>{error.category}</p>
      </div>
<div>       <input 
          type="date" 
          value={date} 
          onChange={e=>setDate(e.target.value)}
          className="p-2 rounded w-full" 
          style={{background:"var(--input-bg)",color:"var(--text-primary)",border:"1px solid var(--border)"}} 
          required
        />
        <p className="mb-4 text-xs" style={{ color: "red" }}>{error.date}</p></div>
     <div>
         <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          step="300"
          className="p-2 rounded w-full"
          style={{background:"var(--input-bg)",color:"var(--text-primary)",border:"1px solid var(--border)"}}
          required
        />
        <p className="mb-4 text-xs" style={{ color: "red" }}>{error.time}</p>
     </div>
     <div>   <select 
          value={type} 
          onChange={e=>setType(e.target.value)}
          className="p-2 rounded w-full" 
          style={{background:"var(--input-bg)",color:"var(--text-primary)",border:"1px solid var(--border)"}}
        >
          {["workout","meal","goal","appointment","medication","other"].map(t=>
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          )}
        </select>
<p className="mb-4 text-xs" style={{ color: "red" }}>{error.type}</p></div>
        {category === "alert" && (
        <div>
            <select 
            value={priority} 
            onChange={e=>setPriority(e.target.value)}
            className="p-2 rounded w-full" 
            style={{background:"var(--input-bg)",color:"var(--text-primary)",border:"1px solid var(--border)"}}
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>
        )}
        
        <input 
          placeholder="Notes (optional)" 
          value={notes} 
          onChange={e=>setNotes(e.target.value)}
          className="p-2 rounded md:col-span-2" 
          style={{background:"var(--input-bg)",color:"var(--text-primary)",border:"1px solid var(--border)"}}
        />
        
        <div className="md:col-span-2 flex gap-2">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded font-medium text-white"
            style={{backgroundColor:"var(--accent)"}}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : 
             editingId ? <Edit2 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
            {saving ? "Saving…" : editingId ? "Update" : `Add ${category === "alert" ? "Alert" : "Reminder"}`}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={resetForm}
              className="px-4 py-2 rounded font-medium"
              style={{background:"var(--bg-secondary)",color:"var(--text-primary)"}}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Reminders/Alerts List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" style={{borderColor:"var(--border)"}}>
          <thead style={{background:"var(--bg-secondary)"}}>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color:"var(--text-secondary)"}}>Item</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color:"var(--text-secondary)"}}>Date / Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color:"var(--text-secondary)"}}>Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color:"var(--text-secondary)"}}>Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color:"var(--text-secondary)"}}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{borderColor:"var(--border)"}}>
            {filteredReminders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center" style={{color:"var(--text-muted)"}}>
                  No {activeTab === "all" ? "items" : activeTab} found.
                </td>
              </tr>
            ) : filteredReminders.map(r => (
              <tr key={r._id} className={`hover:bg-[var(--bg-card-hover)] ${!r.isActive?'opacity-50':''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getCategoryStyle(r.category)}`}>
                      {getIcon(r)}
                    </div>
                    <div>
                      <div className="font-medium text-sm" style={{color:"var(--text-primary)"}}>
                        {r.title}
                        {r.category === "alert" && (
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs border ${getPriorityColor(r.priority)}`}>
                            {r.priority}
                          </span>
                        )}
                      </div>
                      {r.notes && (
                        <div className="text-xs mt-1" style={{color:"var(--text-muted)"}}>
                          {r.notes}
                        </div>
                      )}
                      <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${getCategoryStyle(r.category)}`}>
                        {r.category === "alert" ? "🚨 Alert" : "⏰ Reminder"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm" style={{color:"var(--text-primary)"}}>
                  {new Date(r.date).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span 
                    className="px-2 py-1 rounded-full text-xs capitalize"
                    style={{
                      backgroundColor: "var(--accent)/20",
                      color: 'var(--accent)',
                      border: '1px solid var(--accent)/30'
                    }}
                  >
                    {r.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button 
                    onClick={() => toggleActive(r._id, r.isActive)}
                    className="flex items-center space-x-2"
                  >
                    {r.isActive ? (
                      <ToggleRight className="w-6 h-6" style={{color: "var(--accent)"}} />
                    ) : (
                      <ToggleLeft className="w-6 h-6" style={{color: "var(--text-muted)"}} />
                    )}
                    <span style={{color: r.isActive ? "var(--accent)" : "var(--text-muted)"}}>
                      {r.isActive ? "Active" : "Inactive"}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => startEdit(r)} 
                      className="p-1 rounded hover:bg-[var(--bg-secondary)]"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    </button>
                    <button 
                      onClick={() => del(r._id)} 
                      className="p-1 rounded hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}