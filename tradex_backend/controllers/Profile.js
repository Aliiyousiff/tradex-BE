const User = require('../models/User')

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id // Extract user ID from middleware
    //console.log('Fetching profile for user ID:', userId)

    // Populate the favorites and addedPodcasts fields
    const user = await User.findById(userId)
      .populate('favorites')
      .populate('addedPodcasts')
      .populate('history')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error('Error in getProfile:', error)
    res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = { getProfile }
