// server/models/register.js
const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  image: String,
  preferences: {
    notifications: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    units: { type: String, default: "metric", enum: ["metric", "imperial"] },
    theme: { type: String, default: "dark", enum: ["dark", "light"] },
    language: { type: String, default: "en", enum: ["en", "es", "fr", "de", "ur"] },
    reminders: {
      workout: { type: String, default: "07:00" },
      meal: { type: String, default: "12:00" },
    },
  },
});

module.exports = mongoose.model("Register", registerSchema);