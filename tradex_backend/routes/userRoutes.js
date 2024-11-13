const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const { stripToken, verifyToken } = require('../middleware');
const { getProfile } = require('../controllers/Profile');

const authMiddleware = [stripToken, verifyToken];

// Get user profile details
router.get('/profile/details', authMiddleware, getProfile);

// Get user profile by user ID (includes wallet balance and favorites)
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('favorites');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      wallet: user.wallet,
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add an asset to the user's favorites
router.post('/favorites', authMiddleware, async (req, res) => {
  const { symbol } = req.body;
  const userId = req.user.userId;

  try {
    // Check if the asset is already favorited by the user
    const existingFavorite = await Favorite.findOne({ symbol, userId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Asset already in favorites' });
    }

    // Create a new favorite
    const newFavorite = new Favorite({ symbol, userId });
    await newFavorite.save();

    // Add reference to the user's favorites
    await User.findByIdAndUpdate(userId, {
      $push: { favorites: newFavorite._id },
    });

    res.status(201).json({ message: 'Asset added to favorites', favorite: newFavorite });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all user's favorite assets
router.get('/favorites', authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  try {
    const favorites = await Favorite.find({ userId });
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Remove an asset from the user's favorites
router.delete('/favorites', authMiddleware, async (req, res) => {
  const { symbol } = req.body;
  const userId = req.user.userId;

  try {
    // Find and delete the favorite
    const favorite = await Favorite.findOneAndDelete({ symbol, userId });
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    // Remove reference from the user's favorites
    await User.findByIdAndUpdate(userId, {
      $pull: { favorites: favorite._id },
    });

    res.status(200).json({ message: 'Asset removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
