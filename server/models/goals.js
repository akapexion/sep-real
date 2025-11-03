const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'register', required: true },
  goalType: { type: String, required: true },
  target: { type: Number, required: true },
  current: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Goals', goalsSchema);