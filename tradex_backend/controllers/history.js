const History = require('../models/History')
const User = require('../models/User')

// Save or update history
const saveHistory = async (req, res) => {
  const {
    podcastId,
    episodeId,
    podcastTitle,
    episodeTitle,
    progress,
    totalLength,
    userId
  } = req.body

  try {
    // Check if there's already a history entry for the same user and episode
    let history = await History.findOne({ userId, episodeId })

    if (history) {
      // Update the progress if history exists
      history.progress = progress

      // If progress is complete, mark the episode as finished
      if (progress >= totalLength) {
        history.isFinished = true
      }
    } else {
      // Create new history if not exists
      history = new History({
        podcastId,
        episodeId,
        podcastTitle,
        episodeTitle,
        progress,
        totalLength,
        userId,
        isFinished: progress >= totalLength // Mark finished if the episode is completed on first play
      })
    }

    await history.save()

    // Add the history to the user's history list if not already added
    const user = await User.findById(userId)

    if (!user.history.includes(history._id)) {
      user.history.push(history._id)
      await user.save()
    }

    res.status(200).json(history)
  } catch (err) {
    console.error('Error saving history:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  saveHistory
}
