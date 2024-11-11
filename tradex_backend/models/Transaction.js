// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User model
  type: { type: String, enum: ['buy', 'sell'], required: true },  // Type of transaction (buy or sell)
  symbol: { type: String, required: true },  // Asset symbol (e.g., BTC, ETH)
  amount: { type: Number, required: true },  // Amount of the asset bought or sold
  price: { type: Number, required: true },  // Price per unit of the asset at the time of transaction
  date: { type: Date, default: Date.now },  // Timestamp of the transaction
});

module.exports = mongoose.model('Transaction', transactionSchema);
