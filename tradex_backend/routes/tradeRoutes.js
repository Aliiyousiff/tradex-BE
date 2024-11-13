const express = require('express');
const { buyCrypto, sellCrypto } = require('../controllers/tradeController');
const router = express.Router();

// Buy Crypto
router.post('/buy-crypto', buyCrypto);

// Sell Crypto
router.post('/sell-crypto', sellCrypto);

module.exports = router;
