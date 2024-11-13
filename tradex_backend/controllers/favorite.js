const Favorite = require('../models/Favorite');
const User = require('../models/User');

// Add a new favorite
const addFavorite = async (userId, symbol) => {
  try {
    const existingFavorite = await Favorite.findOne({ userId, symbol });
    if (existingFavorite) {
      throw new Error('Asset already in favorites');
    }

    const newFavorite = new Favorite({ userId, symbol });
    await newFavorite.save();

    return newFavorite;
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    throw error;
  }
};

// Get all favorites for a user
const getFavorites = async (userId) => {
  try {
    return await Favorite.find({ userId });
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    throw error;
  }
};

// Remove a favorite
const removeFavorite = async (userId, symbol) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ userId, symbol });
    return favorite;
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    throw error;
  }
};

module.exports = { addFavorite, getFavorites, removeFavorite };
