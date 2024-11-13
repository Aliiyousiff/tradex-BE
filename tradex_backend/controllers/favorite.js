const User = require('../models/User');

// Add to favorites
exports.addToFavorites = async (req, res) => {
    const { userId, item } = req.body; // item should contain type ('stock' or 'crypto') and symbol

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if item already exists in favorites to avoid duplicates
        const isExisting = user.favorites.some(fav => fav.symbol === item.symbol && fav.type === item.type);
        if (!isExisting) {
            user.favorites.push(item);
            await user.save();
            res.status(200).json({ message: 'Added to favorites successfully!', favorites: user.favorites });
        } else {
            res.status(400).json({ message: 'Item already in favorites' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove from favorites
exports.removeFromFavorites = async (req, res) => {
    const { userId, item } = req.body; // item should contain type ('stock' or 'crypto') and symbol

    try {
        const user = await User.findByIdAndUpdate(userId, 
            { $pull: { favorites: { symbol: item.symbol, type: item.type } } },
            { new: true }
        );
        res.status(200).json({ message: 'Removed from favorites successfully!', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
