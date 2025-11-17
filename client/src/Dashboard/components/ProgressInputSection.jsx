// src/Dashboard/components/ProgressInputSection.jsx
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { usePreferencesContext } from "../pages/PreferencesContext";
import {check, date, z} from 'zod'

const progSchema = z.object({
  date:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  weight:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  chest:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  waist:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  runTime:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
  liftWeight:z.any().refine((v) => v !== "" && v != null, {
    message: "Please enter detail"
  }),
})
import { useLanguage } from '../pages/UseLanguage';

const ProgressInputSection = ({ onProgressAdded }) => {
  const { preferences, getWeightUnit, getHeightUnit } = usePreferencesContext();
  const { t } = useLanguage();
  const API_BASE_URL = 'http://localhost:3000';
  const [form, setForm] = useState({
    date: "",
    weight: "",
    chest: "",
    waist: "",
    runTime: "",
    liftWeight: "",
  });
  const [error,setError]=useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const userId = user._id;
    if (!userId) {
      toast.error(t('pleaseLogin'));
      return;
    }

    const result = progSchema.safeParse({liftWeight:form.liftWeight,weight:form.weight,chest:form.chest,waist:form.waist,runTime:form.runTime,date:form.date})
 if(!result.success){
      const formattedErrors = result.error.format();

      setError({

        liftWeight:formattedErrors.liftWeight?._errors[0] || "",
        weight: formattedErrors.weight?._errors[0] || "",
        chest: formattedErrors.chest?._errors[0] || "",
        waist: formattedErrors.waist?._errors[0] || "",
        date: formattedErrors.date?._errors[0] || "",
        runTime: formattedErrors.runTime?._errors[0] || "",
       
      })
      return;
    }
setError("")
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
      toast.success(t('progressSaved'));
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
      toast.error(t('saveFailed'));
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-xl shadow-md space-y-5"
      style={{ backgroundColor: "var(--bg-secondary)" }}
     noValidate>
      <Toaster />
      <h2 className="text-xl font-semibold" style={{ color: "var(--accent)" }}>
        {t('logNewProgress')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            {t('date')}
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
           <p className="mb-4 text-xs" style={{ color: "red" }}>{error.date}</p>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            {t('weight')} ({getWeightUnit()})
          </label>
          <input
            type="number"
            name="weight"
            placeholder={`${t('weight')} (${getWeightUnit()})`}
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
           <p className="mb-4 text-xs" style={{ color: "red" }}>{error.weight}</p>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            {t('chest')} ({getHeightUnit()})
          </label>
          <input
            type="number"
            name="chest"
            placeholder={`${t('chest')} (${getHeightUnit()})`}
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
           <p className="mb-4 text-xs" style={{ color: "red" }}>{error.chest}</p>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            {t('waist')} ({getHeightUnit()})
          </label>
          <input
            type="number"
            name="waist"
            placeholder={`${t('waist')} (${getHeightUnit()})`}
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
           <p className="mb-4 text-xs" style={{ color: "red" }}>{error.waist}</p>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            {t('runTime')} ({t('minutes')})
          </label>
          <input
            type="number"
            name="runTime"
            placeholder={`${t('runTime')} (${t('minutes')})`}
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
           <p className="mb-4 text-xs" style={{ color: "red" }}>{error.runTime}</p>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            {t('liftWeight')} ({getWeightUnit()})
          </label>
          <input
            type="number"
            name="liftWeight"
            placeholder={`${t('liftWeight')} (${getWeightUnit()})`}
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
           <p className="mb-4 text-xs" style={{ color: "red" }}>{error.liftWeight}</p>
        </div>
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-2.5 rounded font-medium text-white transition hover:opacity-90"
        style={{ backgroundColor: "var(--accent)" }}
      >
        {t('saveProgress')}
      </button>
    </form>
  );
};

export default ProgressInputSection;