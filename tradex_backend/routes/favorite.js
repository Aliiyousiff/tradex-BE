const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite');

router.post('/add', favoriteController.addToFavorites);
router.post('/remove', favoriteController.removeFromFavorites);

module.exports = router;
