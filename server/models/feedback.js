const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'register', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: String, required: true  },
  message: { type:String, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Feedbacks', feedbackSchema);