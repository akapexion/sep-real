// src/i18n.js
export const t = (key, lang) => {
  const dict = {
    en: { save: "Save", workout: "Workout", weight: "Weight (kg)" },
    ur: { save: "محفوظ کریں", workout: "ورزش", weight: "وزن (کلو)" },
    es: { save: "Guardar", workout: "Entrenamiento", weight: "Peso (kg)" },
  };
  return dict[lang]?.[key] || dict.en[key];
};