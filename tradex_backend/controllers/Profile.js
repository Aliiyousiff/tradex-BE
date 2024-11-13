// controllers/Profile.js
const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching profile for user ID:', userId);

    // Populate the 'favorites' field with the Favorite model data
    const user = await User.findById(userId).populate('favorites');

    if (!user) {
      console.error('User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      wallet: user.wallet,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error('Error in getProfile:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { getProfile };
