// controllers/Trade.js
const User = require('../models/User');
const Trade = require('../models/Trade'); // Assuming you have a Trade model
const mongoose = require('mongoose');

// Create a new trade
const createTrade = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { symbol, quantity, price } = req.body;

    // Validate input
    if (!symbol || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new trade document
    const trade = new Trade({
      userId: mongoose.Types.ObjectId(userId),
      symbol,
      quantity,
      price,
      total: quantity * price,
      createdAt: new Date(),
    });

    // Save the trade
    await trade.save();

    // Update the user's transaction history (optional)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.transactions.push(trade._id);
    await user.save();

    res.status(201).json({ message: 'Trade created successfully', trade });
  } catch (error) {
    console.error('Error creating trade:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all trades for the authenticated user
const getTrades = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch all trades for the user
    const trades = await Trade.find({ userId }).sort({ createdAt: -1 });

    if (!trades || trades.length === 0) {
      return res.status(404).json({ message: 'No trades found' });
    }

    res.status(200).json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete a trade by trade ID
const deleteTrade = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { tradeId } = req.params;

    // Find and delete the trade
    const trade = await Trade.findOneAndDelete({ _id: tradeId, userId });

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    // Update user's transaction history
    await User.findByIdAndUpdate(userId, {
      $pull: { transactions: tradeId },
    });

    res.status(200).json({ message: 'Trade deleted successfully' });
  } catch (error) {
    console.error('Error deleting trade:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createTrade,
  getTrades,
  deleteTrade,
};
