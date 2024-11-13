const express = require('express');
const router = express.Router();

const { getProfile } = require('../controllers/Profile');
const { stripToken, verifyToken } = require('../middleware');

// Route to get user profile with middleware applied
router.get('/details', stripToken, verifyToken, getProfile);

module.exports = router;
