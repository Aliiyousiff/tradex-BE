const express = require('express');

const router = express.Router();

const { getProfile } = require('../controllers/Profile');
const middleware = require('../middleware/index')

// Route to get a user's profile
router.get('/details', middleware.stripToken,
    middleware.verifyToken, getProfile);

module.exports = router;
