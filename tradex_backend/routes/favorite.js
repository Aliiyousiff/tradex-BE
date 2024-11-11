const express = require('express')
const { addFavorite } = require('../controllers/favorite')
const middleware = require('../middleware/index')

const router = express.Router()

router.post(
  '/favorite',
  middleware.stripToken,
  middleware.verifyToken,
  addFavorite
)

module.exports = router
