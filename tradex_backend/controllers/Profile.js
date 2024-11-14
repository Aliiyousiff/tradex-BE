const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    // Ensure req.user is defined and has userId
    if (!req.user || !req.user.userId) {
      console.error("User information not found in request. Verify middleware is working correctly.");
      return res.status(400).json({ message: "User information is missing. Please log in again." });
    }

    const userId = req.user.userId;
    console.log("Fetching profile for user ID:", userId);

    // Log the entire req.user object for debugging
    console.log("Decoded user object:", req.user);

    // Fetch user data and populate 'favorites' with relevant fields
    const user = await User.findById(userId).populate('favorites', 'symbol name price');

    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      return res.status(404).json({ message: "User not found." });
    }

    // Log the fetched user data for debugging
    console.log("Fetched user profile data:", {
      userId: user._id,
      username: user.username,
      email: user.email || "No email provided",
      wallet: user.wallet,
      favorites: user.favorites,
    });

    // Respond with user profile details
    res.status(200).json({
      userId: user._id,
      username: user.username,
      email: user.email || "No email provided",
      wallet: user.wallet,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Error in getProfile function:", error.stack);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getProfile };
