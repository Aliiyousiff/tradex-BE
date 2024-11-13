const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware'); // Authentication Middleware

// Get user profile (wallet balance and favorites)
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
    res.json({ username: user.username, wallet: user.wallet, favorites: user.favorites });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add an asset to the user's favorites
router.post('/:userId/favorites', authMiddleware, async (req, res) => {
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

// Remove an asset from the user's favorites
router.delete('/:userId/favorites', authMiddleware, async (req, res) => {
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
