const Favorite = require('../models/Favorite')
const Podcast = require('../models/Podcast')
const User = require('../models/User')

const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id

    // Check if the podcast is already in the user's favorites
    const existingFavorite = await Favorite.findOne({
      externalId: req.body.externalId
    })
    if (existingFavorite) {
      console.log('Podcast is already in favorites')
      return res.status(409).send({ error: 'Podcast is already in favorites' })
    }

    // Add the podcast to the user's favorites using the API ID
    const newFavorite = new Favorite({
      externalId: req.body.externalId,
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      genre_ids: req.body.genre_ids,
      user: userId
    })

    const savedFavorite = await newFavorite.save()
    console.log('Saved favorite:', savedFavorite)

    // Update the user's favorites array by pushing the _id of the Favorite document
    await User.findByIdAndUpdate(
      userId,
      { $push: { favorites: savedFavorite._id } }, // Push the _id of the favorite document
      { new: true }
    )

    console.log('Updated user favorites array')

    res.status(201).send(savedFavorite)
  } catch (error) {
    console.error('Error adding to favorites:', error.message)
    res.status(500).send({
      error: 'Failed to add to favorites',
      details: error.message
    })
  }
}

module.exports = { addFavorite }
