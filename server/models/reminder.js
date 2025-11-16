// models/reminder.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Register', 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['workout', 'meal', 'goal', 'appointment', 'medication', 'other'], 
      default: 'workout' 
    },
    category: {
      type: String,
      enum: ['reminder', 'alert'],
      default: 'reminder'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'none'],
      default: 'none'
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    notified: {
      type: Boolean,
      default: false
    },
    notes: String,
  },
  { timestamps: true }
);

reminderSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Reminder', reminderSchema);