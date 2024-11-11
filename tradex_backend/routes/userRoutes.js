// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile (wallet balance and favorites)
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
    res.json({ username: user.username, wallet: user.wallet, favorites: user.favorites });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update user wallet (e.g., adding profits or deducting losses)
router.patch('/:userId/wallet', async (req, res) => {
  const { amount } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { $inc: { wallet: amount } }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add asset to favorites
router.post('/:userId/favorites', async (req, res) => {
  const { symbol } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
    
    if (!user.favorites.includes(symbol)) {
      user.favorites.push(symbol);
      await user.save();
      res.json({ message: 'Asset added to favorites', favorites: user.favorites });
    } else {
      res.status(400).send('Asset already in favorites');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Remove asset from favorites
router.delete('/:userId/favorites', async (req, res) => {
  const { symbol } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    user.favorites = user.favorites.filter(fav => fav !== symbol);
    await user.save();
    res.json({ message: 'Asset removed from favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
