const User = require('../models/User');
const Trade = require('../models/Trade');
const mongoose = require('mongoose');

// Create a new trade (Buy or Sell)
const createTrade = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { symbol, quantity, price } = req.body;

    // Validate input
    if (!userId || !symbol || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields: userId, symbol, quantity, or price' });
    }

    // Create a new trade document
    const trade = new Trade({
      userId: new mongoose.Types.ObjectId(userId),
      symbol,
      quantity,
      price,
      total: quantity * price,
      createdAt: new Date(),
    });

    // Save the trade
    await trade.save();

    // Update the user's transaction history
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
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

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
    const userId = req.user?.userId;
    const { tradeId } = req.params;

    if (!userId || !tradeId) {
      return res.status(400).json({ message: 'User ID or Trade ID is missing' });
    }

    const trade = await Trade.findOneAndDelete({ _id: tradeId, userId });

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { transactions: tradeId },
    });

    res.status(200).json({ message: 'Trade deleted successfully' });
  } catch (error) {
    console.error('Error deleting trade:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Add a stock to user's favorites
const addFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { symbol } = req.body;

    if (!userId || !symbol) {
      return res.status(400).json({ message: 'User ID or Symbol is missing' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.favorites.includes(symbol)) {
      return res.status(400).json({ message: 'Asset already in favorites' });
    }

    user.favorites.push(symbol);
    await user.save();

    res.status(200).json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Error adding to favorites:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Remove a stock from user's favorites
const removeFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { symbol } = req.body;

    if (!userId || !symbol) {
      return res.status(400).json({ message: 'User ID or Symbol is missing' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favorites.includes(symbol)) {
      return res.status(404).json({ message: 'Asset not found in favorites' });
    }

    user.favorites = user.favorites.filter((fav) => fav !== symbol);
    await user.save();

    res.status(200).json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Error removing from favorites:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createTrade,
  getTrades,
  deleteTrade,
  addFavorite,
  removeFavorite,
};
