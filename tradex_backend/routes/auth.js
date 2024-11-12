
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = process.env.APP_SECRET || 'your_jwt_secret_key';

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt:', username);

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password with hashed password stored in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      jwtSecret, // Use APP_SECRET from .env
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token: token,
      userId: user._id,
    });
  } catch (err) {
    console.error('Error in login route:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;