// controllers/Favorite.js
const Favorite = require('../models/Favorite');
const User = require('../models/User');

// Add a new favorite
const addFavorite = async (req, res) => {
  const { symbol } = req.body;
  const userId = req.user.userId;

  try {
    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({ symbol, userId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Asset already in favorites' });
    }

    // Create a new favorite
    const newFavorite = new Favorite({ symbol, userId });
    await newFavorite.save();

    res.status(201).json({ message: 'Asset added to favorites', favorite: newFavorite });
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all favorites for a user
const getFavorites = async (req, res) => {
  const userId = req.user.userId;

  try {
    const favorites = await Favorite.find({ userId });
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Remove a favorite
const removeFavorite = async (req, res) => {
  const { symbol } = req.body;
  const userId = req.user.userId;

  try {
    const favorite = await Favorite.findOneAndDelete({ symbol, userId });
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Asset removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};
