// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet: { type: Number, default: 10000 },  // Initial wallet balance
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],  // Referencing Transaction model
  favorites: [{ type: String }],  // Array of favorite asset symbols (e.g., BTC, ETH)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
