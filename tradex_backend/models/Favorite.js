// models/Favorite.js
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  symbol: { type: String, required: true }, // The asset symbol (e.g., 'AAPL', 'BTC')
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the favorite was added
});

// Register the model
module.exports = mongoose.model('Favorite', favoriteSchema);
