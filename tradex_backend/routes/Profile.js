const express = require('express');
const router = express.Router();

const { getProfile } = require('../controllers/Profile');
const middleware = require('../middleware/index');

// Test route to verify Profile.js is loaded correctly
router.get('/test', (req, res) => {
  res.send('Profile test route is working!');
});

// Route to get a user's profile
// Temporarily removing middleware for testing
router.get('/details', getProfile);

module.exports = router;
