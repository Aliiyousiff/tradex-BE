// models/Trade.js
const mongoose = require('mongoose');

// Define the Trade schema
const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be non-negative'],
  },
  total: {
    type: Number,
    required: true,
  },
  tradeType: {
    type: String,
    enum: ['buy', 'sell'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to calculate the total value of the trade
tradeSchema.pre('save', function (next) {
  this.total = this.quantity * this.price;
  next();
});

// Export the model
module.exports = mongoose.model('Trade', tradeSchema);
