// models/User.js
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  score: Number,
  total: Number,
  date: { type: Date, default: Date.now },
  details: { type: Array, default: [] } // array of objects with question, answer, correct
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
  scores: [scoreSchema],
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.models.User || mongoose.model('User', userSchema);
