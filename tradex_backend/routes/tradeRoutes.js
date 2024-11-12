// routes/tradeRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { getCryptoPrice, getStockPrice } = require('../services/apiService');
const authMiddleware = require('../middleware');

// Buy asset
router.post('/:userId/buy', authMiddleware, async (req, res) => {
  const { symbol, amount, assetType } = req.body; // Include assetType in the request
  try {
    let price;

    // Determine which function to use based on asset type
    if (assetType === 'crypto') {
      price = await getCryptoPrice(symbol);
    } else if (assetType === 'stock') {
      price = await getStockPrice(symbol);
    } else {
      return res.status(400).send('Invalid asset type');
    }

    const totalCost = price * amount;

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    if (user.wallet < totalCost) return res.status(400).send('Insufficient funds');

    user.wallet -= totalCost;
    await user.save();

    const transaction = new Transaction({
      user: user._id,
      type: 'buy',
      symbol,
      amount,
      price,
      assetType,
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
router.post('/:userId/sell', authMiddleware, async (req, res) => {
  const { symbol, amount, assetType } = req.body;
  try {
    let price;

    if (assetType === 'crypto') {
      price = await getCryptoPrice(symbol);
    } else if (assetType === 'stock') {
      price = await getStockPrice(symbol);
    } else {
      return res.status(400).send('Invalid asset type');
    }

    const totalProfit = price * amount;

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    user.wallet += totalProfit;
    await user.save();

    const transaction = new Transaction({
      user: user._id,
      type: 'sell',
      symbol,
      amount,
      price,
      assetType,
    });

    await transaction.save();
    user.transactions.push(transaction._id);
    await user.save();

    res.json({ message: 'Transaction successful', transaction });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;