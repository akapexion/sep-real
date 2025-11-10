const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'register', required: true },
    title: { type: String, required: true },          // e.g. "Morning run"
    date: { type: Date, required: true },            // full date-time
    type: { type: String, enum: ['workout', 'meal', 'goal'], default: 'workout' },
    isActive: { type: Boolean, default: true },
    notes: String,
  },
  { timestamps: true }
);

reminderSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Reminder', reminderSchema);