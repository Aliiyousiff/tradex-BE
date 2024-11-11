// routes/tradeRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Helper function to get market price (example using an API)
const getMarketPrice = async (symbol) => {
  const response = await axios.get(`https://api.example.com/market/${symbol}`);  // Replace with real API
  return response.data.price;
};

// Buy asset
router.post('/:userId/buy', async (req, res) => {
  const { symbol, amount } = req.body;
  try {
    const price = await getMarketPrice(symbol);
    const totalCost = price * amount;

    const user = await User.findById(req.params.userId);
    if (user.wallet < totalCost) return res.status(400).send('Insufficient funds');

    user.wallet -= totalCost;
    await user.save();

    const transaction = new Transaction({
      user: user._id,
      type: 'buy',
      symbol,
      amount,
      price
    });

    await transaction.save();
    user.transactions.push(transaction._id);
    await user.save();

    res.json({ message: 'Transaction successful', transaction });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Sell asset
router.post('/:userId/sell', async (req, res) => {
  const { symbol, amount } = req.body;
  try {
    const price = await getMarketPrice(symbol);
    const user = await User.findById(req.params.userId);

    // Assuming user has enough quantity of the asset (handle asset quantities separately if needed)
    const totalProfit = price * amount;
    user.wallet += totalProfit;
    await user.save();

    const transaction = new Transaction({
      user: user._id,
      type: 'sell',
      symbol,
      amount,
      price
    });

    await transaction.save();
    user.transactions.push(transaction._id);
    await user.save();

    res.json({ message: 'Transaction successful', transaction });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get transaction history
router.get('/:userId/transactions', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('transactions');
    if (!user) return res.status(404).send('User not found');

    const transactions = await Transaction.find({ user: user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
